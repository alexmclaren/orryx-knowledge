# Authentication Pattern

Standard pattern for implementing authentication across Orryx products.

## Overview

All Orryx products use:
- JWT tokens for stateless authentication
- HTTP-only secure cookies for web
- Session expiration (30 minutes)
- Audit logging for all auth events

## Login Flow

```typescript
// src/api/auth/login.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(email: string, password: string) {
  // 1. Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // 2. Verify password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    // Log failed attempt
    await AuditLog.create({
      userId: user.id,
      action: 'login_failed',
      timestamp: new Date(),
    });
    throw new UnauthorizedError('Invalid credentials');
  }

  // 3. Generate access token
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '30m' }
  );

  // 4. Log successful login
  await AuditLog.create({
    userId: user.id,
    action: 'login_success',
    timestamp: new Date(),
  });

  return { accessToken };
}
```

## Logout Flow

```typescript
// src/api/auth/logout.ts

export async function logout(userId: string) {
  // 1. Log logout event
  await AuditLog.create({
    userId,
    action: 'logout',
    timestamp: new Date(),
  });

  // 2. Clear session (frontend clears cookie)
  return { success: true };
}
```

## Middleware

```typescript
// src/middleware/auth.ts

import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  // 1. Extract token from cookie
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 2. Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Frontend Usage

```typescript
// src/api/auth.ts (frontend)

export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const { accessToken } = await response.json();
  return { accessToken };
}

export async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  // Clear local state and redirect
  window.location.href = '/login';
}
```

## Security Checklist

- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] JWT signed with strong secret
- [ ] Cookies are httpOnly and secure
- [ ] Session expiration (30 minutes)
- [ ] Failed login attempts logged
- [ ] Successful login logged
- [ ] Logout logged

## Common Mistakes (Anti-Patterns)

❌ **Storing JWT in localStorage**: Vulnerable to XSS
✅ **Use httpOnly cookies**: Not accessible to JavaScript

❌ **Long-lived tokens**: Security risk
✅ **Short access token (30m)**

❌ **Not logging auth events**: Compliance issue
✅ **Log all login, logout, failed attempts**

## References

- OWASP Authentication Cheat Sheet
- JWT Best Practices
- orryx-governance/security/security-policy.md
