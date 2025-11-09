# Claude + Copilot Tandem Workflow
## Token-Optimized Development Strategy

**Purpose**: Maximize Claude plan value by delegating mundane tasks to Copilot
**Goal**: Get more work output with fewer Claude tokens

---

## 🎯 RESPONSIBILITY MATRIX

### Claude Handles (High Complexity)
**Token Budget**: Use sparingly for complex work only

✅ **Architecture & Design**:
- System architecture decisions
- Component hierarchy design
- Data flow design
- API contract design
- Performance optimization strategies

✅ **Complex Implementation**:
- New algorithms (pattern detection, recommendation engines)
- Complex state management solutions
- Advanced TypeScript type gymnastics
- Accessibility implementations (WCAG compliance)
- Security-sensitive code (encryption, RLS policies)

✅ **Code Analysis & Debugging**:
- Root cause analysis of complex bugs
- Performance bottleneck identification
- Security vulnerability analysis
- Architectural code reviews

✅ **Agent Orchestration**:
- Coordinating multiple Sonnet agents
- Complex Task agent workflows
- MCP tool orchestration
- Multi-step automated processes

✅ **Strategic Planning**:
- Feature breakdown and estimation
- Technical risk assessment
- Dependency analysis
- Implementation roadmaps

### Copilot Handles (Mundane Tasks)
**Token Budget**: Free - use liberally

✅ **Documentation**:
- README updates
- CHANGELOG entries
- Component documentation
- API documentation
- Inline code comments
- Migration guides

✅ **Git Operations**:
- Commit messages
- Pull request descriptions
- Branch management
- Merge conflict resolution (simple)

✅ **Routine Refactoring**:
- Rename variables/functions
- Extract constants
- Code formatting
- Import organization
- Simple type updates

✅ **Simple Components**:
- Basic UI components (following existing patterns)
- Form components
- Layout components
- Simple utility functions

✅ **Test Writing**:
- Unit tests (following existing patterns)
- Simple integration tests
- Test data generation
- Mock creation

✅ **Configuration**:
- ESLint rule updates
- Prettier config
- Package.json updates
- Environment variable documentation

✅ **Content Creation**:
- Seed data creation
- Translation files
- Static content
- Example data

---

## 📋 DELEGATION WORKFLOW

### Step 1: Claude Creates Issues for Copilot

When Claude completes complex work, it should:

1. **Create Local Task Files** (not direct commits):
```markdown
File: .claude/copilot-tasks/TASK_001_update_docs.md

# Task: Update Documentation After Phase 3.6 Completion

**Type**: Documentation
**Priority**: Medium
**Estimated Time**: 30 minutes
**Complexity**: Low (Copilot)

## Context
Phase 3.6 wellness components completed:
- StreakVisualizer component created
- ActivityLog component created
- 48 tests passing

## Tasks
1. Update README.md with new components
2. Update CHANGELOG.md with Phase 3.6 entry
3. Update IMPLEMENTATION_STATUS.md progress (79/105 → XX/105)
4. Create component usage examples in docs/

## Acceptance Criteria
- [ ] README has StreakVisualizer and ActivityLog sections
- [ ] CHANGELOG has dated entry for Phase 3.6
- [ ] Examples show correct import and props
- [ ] Links to component READMEs work

## References
- New components: src/components/wellness/StreakVisualizer.tsx, ActivityLog.tsx
- Architecture: specs/003-integrate-betterhelp-tailor/PHASE_3_6_UI_COMPONENT_ARCHITECTURE.md
```

2. **User converts to GitHub Issue** (or Copilot can):
```bash
# User or Copilot creates issue from task file
gh issue create --title "[Copilot] Update docs for Phase 3.6" \
  --body-file .claude/copilot-tasks/TASK_001_update_docs.md \
  --label "documentation,copilot,low-complexity"
```

### Step 2: Copilot Executes

Copilot should be assigned to:
- Issues labeled `copilot` or `low-complexity`
- All documentation issues
- All git commit tasks

### Step 3: Claude Reviews (If Needed)

For critical paths only:
- Security-sensitive documentation
- Architecture decision records
- Breaking change commits

---

## 🔧 TOOL USAGE REQUIREMENTS

### Claude MUST Use All Available Tools

**Agents** (always consider for automation):
- `sonnet-architect` - Architecture reviews, design decisions
- `sonnet-ui-blueprint` - UI/UX design, component specs
- `sonnet-validator` - Code quality validation, testing
- `sonnet-mechanic` - Refactoring, code cleanup
- `sonnet-scribe` - Documentation (but delegate to Copilot when possible)
- `general-purpose` - Complex multi-step tasks
- `Explore` - Codebase exploration

**MCP Tools** (use when available):
- GitHub MCP - Issue management, PR operations
- Browser MCP - Web research, documentation lookup
- File system MCP - Bulk file operations

**Local Tools**:
- Read/Write/Edit - File operations
- Bash - Command execution
- Grep/Glob - Code search
- Task - Agent orchestration

### Copilot MUST Use All Available Tools

**GitHub Copilot CLI**:
```bash
gh copilot suggest "update README with new components"
gh copilot explain "why is this component not accessible"
```

**GitHub Copilot in Editor**:
- Code completion
- Inline chat for simple refactors
- Test generation
- Documentation generation

**GitHub CLI**:
```bash
gh issue create/list/edit
gh pr create/merge/review
gh api - Direct API calls
```

---

## 💰 TOKEN OPTIMIZATION STRATEGIES

### 1. Batch Similar Work
❌ **Bad** (wastes tokens):
```
Claude creates component A (50 tokens)
Claude documents component A (30 tokens)
Claude creates component B (50 tokens)
Claude documents component B (30 tokens)
```

✅ **Good** (saves tokens):
```
Claude creates components A + B in parallel (80 tokens)
→ Delegate documentation to Copilot (0 Claude tokens)
```

### 2. Use Agents for Automation
❌ **Bad**:
```
Claude manually refactors 10 components (500 tokens)
```

✅ **Good**:
```
Claude uses sonnet-mechanic agent to refactor (50 tokens)
```

### 3. Delegate Early
❌ **Bad**:
```
Claude completes feature → Claude writes docs → Claude commits
Total: 300 tokens
```

✅ **Good**:
```
Claude completes feature → Creates Copilot task for docs + commit
Total: 100 tokens (saved 200 tokens)
```

### 4. Minimal Documentation in Code
❌ **Bad**:
```typescript
/**
 * StreakVisualizer component displays a calendar visualization
 * of sobriety streaks with the following features:
 * - Color-coded days (success, today, future)
 * - Interactive hover cards
 * - Keyboard navigation
 * - WCAG 2.1 AA compliant
 * - Responsive design
 * ... (10 more lines)
 */
```

✅ **Good**:
```typescript
/** Calendar visualization for sobriety streaks. See README for details. */
```
→ Full docs delegated to Copilot

### 5. Reference Existing Patterns
❌ **Bad**:
```
Claude explains entire component pattern from scratch (200 tokens)
```

✅ **Good**:
```
Claude: "Follow ActivityLog.tsx pattern" (10 tokens)
```

---

## 📊 TOKEN BUDGET ALLOCATION

### Recommended Distribution

**Total Claude Plan**: ~100M tokens/month (estimate)
**Goal**: Reserve 80% for complex work

| Activity | Token % | Strategy |
|----------|---------|----------|
| **Architecture & Design** | 30% | Claude only |
| **Complex Implementation** | 30% | Claude only |
| **Code Analysis** | 20% | Claude only |
| **Agent Orchestration** | 10% | Claude only |
| **Simple Implementation** | 5% | Mostly Copilot |
| **Documentation** | 3% | 100% Copilot |
| **Git Operations** | 2% | 100% Copilot |

**Savings**: ~50% token reduction by delegating docs + git to Copilot

---

## 🎯 PRACTICAL EXAMPLES

### Example 1: Component Creation

**Old Workflow** (High Token Usage):
```
1. Claude designs component (100 tokens)
2. Claude implements component (200 tokens)
3. Claude writes tests (150 tokens)
4. Claude writes README (100 tokens)
5. Claude updates CHANGELOG (50 tokens)
6. Claude commits with message (50 tokens)
Total: 650 tokens
```

**New Workflow** (Optimized):
```
1. Claude designs component (100 tokens)
2. Claude implements component (200 tokens)
3. Claude writes tests (150 tokens)
4. Claude creates Copilot task for docs + commit (20 tokens)
5. Copilot handles README, CHANGELOG, commit (0 Claude tokens)
Total: 470 tokens (saved 180 tokens = 28% reduction)
```

### Example 2: Feature Implementation

**Old Workflow**:
```
1. Claude creates 5 components (500 tokens)
2. Claude writes docs for each (250 tokens)
3. Claude updates status files (100 tokens)
4. Claude creates commit messages (50 tokens)
Total: 900 tokens
```

**New Workflow**:
```
1. Claude uses agents to create 5 components (150 tokens)
2. Claude delegates all docs to Copilot (10 tokens)
3. Copilot handles docs + commits (0 Claude tokens)
Total: 160 tokens (saved 740 tokens = 82% reduction)
```

### Example 3: Refactoring

**Old Workflow**:
```
1. Claude analyzes codebase (200 tokens)
2. Claude refactors manually (300 tokens)
3. Claude updates docs (100 tokens)
4. Claude commits (50 tokens)
Total: 650 tokens
```

**New Workflow**:
```
1. Claude analyzes and creates refactor plan (150 tokens)
2. Claude uses sonnet-mechanic agent (50 tokens)
3. Copilot updates docs + commits (0 Claude tokens)
Total: 200 tokens (saved 450 tokens = 69% reduction)
```

---

## 📝 TASK TEMPLATE FOR COPILOT

File: `.claude/copilot-tasks/TASK_XXX_description.md`

```markdown
# Task: [Brief Description]

**Type**: [Documentation | Git | Refactoring | Testing | Content]
**Priority**: [High | Medium | Low]
**Estimated Time**: [XX minutes/hours]
**Complexity**: Low (Copilot)
**Assigned To**: GitHub Copilot

## Context
[What was completed that requires this work]

## Tasks
1. [Specific task 1]
2. [Specific task 2]
3. [Specific task 3]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## References
- [File paths]
- [Documentation links]
- [Related issues]

## Notes
[Any additional context or gotchas]
```

---

## 🚀 IMMEDIATE ACTION ITEMS

### For This Session (Retroactive)

Claude should create Copilot tasks for:

1. **Documentation Updates**:
   - Update README with StreakVisualizer and ActivityLog
   - Update CHANGELOG with Phase 3.6 completion
   - Update PROJECT_STATUS_CURRENT.md
   - Create component usage examples

2. **Git Operations**:
   - Commit Phase 3.5 JSON files
   - Commit Phase 3.6 new components
   - Commit architecture documentation
   - Create PR for Phase 3.6 progress

### For Future Sessions

**Claude's Checklist** (before ending session):
```
[ ] Identify all documentation needs
[ ] Create Copilot task files for docs
[ ] Identify all git operations needed
[ ] Create Copilot task files for commits/PRs
[ ] Verify complex work only done by Claude
[ ] Calculate token savings achieved
```

**Copilot's Checklist** (when picking up tasks):
```
[ ] Read all .claude/copilot-tasks/*.md files
[ ] Convert to GitHub issues (if not done)
[ ] Execute tasks in priority order
[ ] Update task files with completion status
[ ] Notify user when all tasks complete
```

---

## 📊 SUCCESS METRICS

Track these to measure optimization:

1. **Token Savings**:
   - Tokens used per session
   - % delegated to Copilot
   - Target: 30-50% reduction

2. **Work Output**:
   - Tasks completed per session
   - Target: 2x increase with same token budget

3. **Delegation Efficiency**:
   - Time to delegate (should be <1 min)
   - Copilot task completion rate
   - Target: 95%+ completion rate

4. **Quality**:
   - Test pass rate (maintain 100%)
   - Accessibility compliance (maintain WCAG 2.1 AA)
   - Documentation completeness

---

## ⚠️ IMPORTANT RULES

### Claude MUST NOT:
- ❌ Update documentation files (README, CHANGELOG, etc.)
- ❌ Create git commits
- ❌ Write PR descriptions
- ❌ Update status tracking files
- ❌ Create examples/demos
- ❌ Write inline comments (unless complex algorithm)

### Claude SHOULD:
- ✅ Create task files for Copilot
- ✅ Focus on complex implementation
- ✅ Use agents for automation
- ✅ Architect and design systems
- ✅ Analyze and debug complex issues
- ✅ Review Copilot's work (critical paths only)

### Copilot MUST:
- ✅ Handle all documentation
- ✅ Handle all git operations
- ✅ Follow existing patterns
- ✅ Use GitHub CLI and Copilot CLI
- ✅ Execute delegated tasks promptly

---

## 🔄 WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│  COMPLEX WORK (Claude)                                  │
│  - Architecture design                                  │
│  - Complex implementation                               │
│  - Algorithm development                                │
│  - Agent orchestration                                  │
│  - Security-sensitive code                              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Creates Task Files
                  ↓
┌─────────────────────────────────────────────────────────┐
│  TASK DELEGATION                                        │
│  .claude/copilot-tasks/TASK_XXX.md                     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ User or Copilot converts to issues
                  ↓
┌─────────────────────────────────────────────────────────┐
│  MUNDANE WORK (Copilot)                                │
│  - Documentation updates                                │
│  - Git commits & PRs                                    │
│  - Simple refactoring                                   │
│  - Test generation                                      │
│  - Content creation                                     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ (Optional) Critical path review
                  ↓
┌─────────────────────────────────────────────────────────┐
│  CLAUDE REVIEW (If Needed)                             │
│  - Security-sensitive changes only                      │
│  - Breaking changes only                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 REFERENCE

### Quick Decision Tree

**When you're about to do something, ask:**

1. **Is this complex?**
   - Yes → Claude does it
   - No → Continue to #2

2. **Does it involve documentation or git?**
   - Yes → Copilot does it
   - No → Continue to #3

3. **Could an agent automate this?**
   - Yes → Use appropriate Sonnet agent
   - No → Continue to #4

4. **Is it a pattern that exists elsewhere?**
   - Yes → Reference pattern, delegate to Copilot
   - No → Claude implements, creates pattern

### Agent Selection Guide

- **Architecture questions** → sonnet-architect
- **UI component design** → sonnet-ui-blueprint
- **Code quality/testing** → sonnet-validator
- **Refactoring/cleanup** → sonnet-mechanic
- **Documentation** → Copilot (not sonnet-scribe)
- **Exploration** → Explore agent
- **Multi-step automation** → general-purpose
- **Planning** → Plan agent

---

**Last Updated**: 2025-11-01
**Status**: Active Workflow
**Review**: Monthly or when token costs increase

**$("$([char]0x26A0) Playwright/E2E Testing Handoff$([char]0x20)**

As of November 2025, all Playwright E2E and accessibility test execution, triage, and results review are now handled by Claude (AI agent). For the latest E2E and accessibility test results, see [PLAYWRIGHT_TEST_RESULTS_HANDOFF.md](PLAYWRIGHT_TEST_RESULTS_HANDOFF.md). To request a new test run or triage, contact Claude.

