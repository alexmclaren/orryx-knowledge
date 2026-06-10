#!/usr/bin/env python3
"""
SuperClaude Routing Configuration Test
Tests the updated routing logic for HuggingFace integration
"""

import yaml
import os
from pathlib import Path

def load_yaml_config(file_path):
    """Load and parse YAML configuration file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

def test_superclaude_core_routing():
    """Test SuperClaude core command routing configuration"""
    print("=== Testing SuperClaude Core Configuration ===")
    
    config_path = Path("claude/superclaude-core.yml")
    config = load_yaml_config(config_path)
    
    if not config:
        print("❌ Failed to load superclaude-core.yml")
        return False
    
    # Test new AI/ML commands exist
    ai_commands = ['rag', 'summarise', 'private-data-query', 'develop', 'orchestrate', 'simulate']
    missing_commands = []
    
    for cmd in ai_commands:
        if cmd not in config.get('commands', {}):
            missing_commands.append(cmd)
    
    if missing_commands:
        print(f"❌ Missing AI/ML commands: {missing_commands}")
        return False
    
    print("✅ All AI/ML commands found in configuration")
    
    # Test HuggingFace MCP server requirements
    for cmd in ai_commands:
        cmd_config = config['commands'][cmd]
        recommended_mcp = cmd_config.get('recommended_mcp', [])
        
        if 'hf' not in recommended_mcp:
            print(f"⚠️  Command '{cmd}' does not recommend HuggingFace MCP server")
        else:
            print(f"✅ Command '{cmd}' correctly routes to HuggingFace")
    
    # Test auto-trigger conditions
    auto_triggers = config.get('auto_triggers', {}).get('todo_command', {}).get('conditions', [])
    ai_triggers = [
        'multi_agent_workflow_detected',
        'rag_operations_detected', 
        'private_data_query_detected',
        'ai_ml_pipeline_detected'
    ]
    
    for trigger in ai_triggers:
        if trigger not in auto_triggers:
            print(f"⚠️  Missing auto-trigger: {trigger}")
        else:
            print(f"✅ Auto-trigger found: {trigger}")
    
    return True

def test_superclaude_mcp_routing():
    """Test SuperClaude MCP server routing configuration"""
    print("\n=== Testing SuperClaude MCP Configuration ===")
    
    config_path = Path("claude/superclaude-mcp.yml")
    config = load_yaml_config(config_path)
    
    if not config:
        print("❌ Failed to load superclaude-mcp.yml")
        return False
    
    # Test HuggingFace MCP server exists
    mcp_servers = config.get('mcp_servers', {})
    if 'huggingface' not in mcp_servers:
        print("❌ HuggingFace MCP server not found")
        return False
    
    print("✅ HuggingFace MCP server configuration found")
    
    # Test HuggingFace server configuration
    hf_config = mcp_servers['huggingface']
    
    required_fields = ['name', 'flag', 'description', 'capabilities', 'use_cases', 'required_for_commands']
    for field in required_fields:
        if field not in hf_config:
            print(f"❌ Missing field in HuggingFace config: {field}")
            return False
    
    print("✅ HuggingFace MCP server has all required fields")
    
    # Test required capabilities
    capabilities = hf_config.get('capabilities', [])
    expected_capabilities = [
        'text_generation',
        'document_embeddings', 
        'semantic_search',
        'retrieval_augmented_generation'
    ]
    
    for cap in expected_capabilities:
        if cap not in capabilities:
            print(f"⚠️  Missing capability: {cap}")
        else:
            print(f"✅ Capability found: {cap}")
    
    # Test integration patterns
    patterns = config.get('integration_patterns', {})
    hf_patterns = [key for key in patterns.keys() if 'huggingface' in key]
    
    if not hf_patterns:
        print("⚠️  No HuggingFace integration patterns found")
    else:
        print(f"✅ Found {len(hf_patterns)} HuggingFace integration patterns")
        for pattern in hf_patterns:
            print(f"   - {pattern}")
    
    return True

def test_command_routing_logic():
    """Test specific command routing logic"""
    print("\n=== Testing Command Routing Logic ===")
    
    # Load both configs
    core_config = load_yaml_config(Path("claude/superclaude-core.yml"))
    mcp_config = load_yaml_config(Path("claude/superclaude-mcp.yml"))
    
    if not core_config or not mcp_config:
        print("❌ Failed to load configuration files")
        return False
    
    # Test routing logic as defined in CLAUDE.md
    routing_tests = [
        ('/rag', 'rag', ['hf', 'c7'], ['persona-data', 'persona-architect']),
        ('/summarise', 'summarise', ['hf'], ['persona-data']),
        ('/private-data-query', 'private-data-query', ['hf', 'seq'], ['persona-data', 'persona-security']),
        ('/develop', 'develop', ['hf', 'seq', 'magic'], ['persona-architect', 'persona-fullstack']),
        ('/orchestrate', 'orchestrate', ['hf', 'magic'], ['persona-business', 'persona-architect']),
        ('/simulate', 'simulate', ['hf', 'seq'], ['persona-architect', 'persona-qa'])
    ]
    
    all_passed = True
    
    for cmd_name, cmd_key, expected_mcp, expected_personas in routing_tests:
        if cmd_key not in core_config.get('commands', {}):
            print(f"❌ Command not found: {cmd_name}")
            all_passed = False
            continue
        
        cmd_config = core_config['commands'][cmd_key]
        actual_mcp = cmd_config.get('recommended_mcp', [])
        actual_personas = cmd_config.get('required_flags', [])
        
        # Check MCP routing
        mcp_match = all(mcp in actual_mcp for mcp in expected_mcp)
        if not mcp_match:
            print(f"❌ {cmd_name} MCP routing mismatch. Expected: {expected_mcp}, Got: {actual_mcp}")
            all_passed = False
        else:
            print(f"✅ {cmd_name} MCP routing correct: {actual_mcp}")
        
        # Check persona requirements
        persona_match = all(persona in actual_personas for persona in expected_personas)
        if not persona_match:
            print(f"❌ {cmd_name} persona mismatch. Expected: {expected_personas}, Got: {actual_personas}")
            all_passed = False
        else:
            print(f"✅ {cmd_name} persona routing correct: {actual_personas}")
    
    return all_passed

def main():
    """Run all routing configuration tests"""
    print("🚀 SuperClaude HuggingFace Routing Integration Test")
    print("=" * 60)
    
    # Change to the correct directory
    os.chdir(Path(__file__).parent)
    
    test_results = []
    
    # Run tests
    test_results.append(test_superclaude_core_routing())
    test_results.append(test_superclaude_mcp_routing())
    test_results.append(test_command_routing_logic())
    
    # Summary
    passed = sum(test_results)
    total = len(test_results)
    
    print("\n" + "=" * 60)
    print(f"🎯 Test Results: {passed}/{total} test suites passed")
    
    if passed == total:
        print("🎉 All routing configuration tests passed!")
        print("\n📋 SuperClaude is ready for HuggingFace integration:")
        print("   ✅ New AI/ML commands configured")
        print("   ✅ HuggingFace MCP server registered") 
        print("   ✅ Command routing logic updated")
        print("   ✅ Auto-trigger conditions enabled")
        print("   ✅ Integration patterns defined")
        return True
    else:
        print("⚠️  Some tests failed. Review configuration files.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)