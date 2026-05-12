---
name: tdd-discipline
description: Test-driven development discipline (red-green-refactor). Triggers when authoring new functionality or fixing bugs. Enforces failing test first, minimal code to pass, then refactor. Pairs with the test-writer subagent (sonnet tier). Used by Triora's test-writer + migration-writer agents and Pillarworks tester agent.
version: 0.1.0
license: MIT
---

# tdd-discipline

## TL;DR

For new functionality: write the failing test before the code. Pass with the minimum implementation. Then refactor. For bug fixes: reproduce with a test first, fix code to make it green, leave the test as a regression guard.

## When to use

- Adding new functions / classes / endpoints (new functionality)
- Fixing bugs (regression test first)
- Refactoring code that has gaps in test coverage
- Touching critical-path code (auth, billing, data integrity)

When NOT strictly TDD:
- Exploratory spikes / prototypes (not committed)
- UI / styling changes (visual review catches errors)
- Documentation
- Generated code (the generator should be TDD'd, not the output)

## The cycle (red → green → refactor)

### RED — write a failing test

1. Name the test for the behaviour, not the implementation
   - Good: `it('rejects expired tokens')`
   - Bad: `it('checkTokenExpiry returns false')`
2. Write the minimum assertion that captures the contract
3. Run the test. **Confirm it fails.** If it passes without code, the test is wrong.
4. Confirm it fails for the right reason (not import errors, not setup bugs).

### GREEN — minimum code to pass

1. Write the simplest code that makes this test green
2. Don't generalise yet. "Make it work" first.
3. Run the test. Confirm green.
4. Run the full test suite. Confirm no regressions.

### REFACTOR — improve under green

1. With tests green, refactor freely:
   - Extract helpers
   - Simplify conditionals
   - Better names
   - Remove duplication
2. After each refactor, re-run tests. Stay green.
3. Stop when the code is clear, not when it's "perfect."

## Per-language conventions

### Triora (Python + pytest)

```python
def test_rejects_expired_tokens():
    """Trial-eligibility endpoint must reject tokens issued > 1h ago."""
    expired_token = make_token(issued_at=datetime.utcnow() - timedelta(hours=2))
    with pytest.raises(AuthError):
        check_eligibility(token=expired_token, patient_id="P-001")
```

### Pillarworks (TypeScript + vitest)

```typescript
it('rejects expired tokens', () => {
  const expired = makeToken({ issuedAt: subHours(new Date(), 2) });
  expect(() => checkEligibility(expired, 'P-001')).toThrow(AuthError);
});
```

### Domain MCPs (TypeScript + vitest, using @orryx/core/domain-mcp-base)

```typescript
it('rejects expired tokens at /check-eligibility', async () => {
  const expired = makeToken({ issuedAt: subHours(new Date(), 2) });
  await expect(callEndpoint('/check-eligibility', { token: expired, patient_id: 'P-001' }))
    .rejects.toMatchObject({ error: 'TokenExpired' });
});
```

## Bug fixes — regression test first

1. Reproduce the bug in code first (write the failing test that captures the reported behaviour)
2. Confirm it reproduces the bug
3. Fix the code
4. Confirm the test now passes
5. The test stays — regression guard for the future

This is non-negotiable for production-impact bugs. Even small bugs deserve a regression test.

## When TDD is friction (and what to do)

- **External API not stubbed yet** — write the test against a mock first; integrate later
- **Test infra missing** — set up the test infra as a prerequisite step (don't skip TDD)
- **"It's hard to test"** — that's the design feedback. Refactor to be testable, then TDD.
- **"This is just a small change"** — small changes are where regression tests pay off most

## Anti-patterns

- **Skipping RED.** Writing test after code = the test passes by construction and doesn't actually test anything useful.
- **Refactoring during GREEN.** Stay green; refactor as a separate step.
- **Coverage chasing.** Don't write tests just for coverage numbers. Test behaviour, not lines.
- **Brittle assertion sets.** Tests that break on every refactor aren't testing behaviour — they're testing implementation.

## Coverage targets

Per `D:\orryx-standards\README.md`:
- All products MUST maintain **>80% test coverage**

But coverage alone isn't enough — coverage measures "lines hit," not "behaviours verified." Aim for: every public function has at least one happy-path test + one edge-case test. Coverage will follow.

## See also

- `methodology/code-review` — code-reviewer subagent flags missing tests
- `methodology/systematic-debugging` — bug-fix workflow that starts with a regression test
- `delivery/quality-check` (Wave 4) — runs test suite + coverage report
- Triora's `test-writer` + `migration-writer` subagents — sonnet-tier; well-tested patterns
- Pillarworks's `tester` agent — sonnet-tier
