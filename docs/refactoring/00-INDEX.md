# Education Malaysia Refactoring Documentation

**Project:** Education Malaysia React Frontend  
**Refactoring Type:** Production-Grade Architecture Migration  
**Status:** In Progress  
**Last Updated:** 2026-02-14

---

## 📋 Table of Contents

### Overview Documents
1. [00-INDEX.md](./00-INDEX.md) — This file
2. [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) — New folder structure and design principles
3. [02-MIGRATION-STRATEGY.md](./02-MIGRATION-STRATEGY.md) — Step-by-step migration approach

### Core Infrastructure
4. [03-SHARED-UTILITIES.md](./03-SHARED-UTILITIES.md) — utils/, constants/, hooks/
5. [04-SERVICE-LAYER.md](./04-SERVICE-LAYER.md) — API centralization and service modules
6. [05-SHARED-COMPONENTS.md](./05-SHARED-COMPONENTS.md) — components/ui/, components/forms/

### Feature Modules
7. [06-COURSES-FEATURE.md](./06-COURSES-FEATURE.md) — features/courses/ (Courses.jsx refactoring)
8. [07-UNIVERSITIES-FEATURE.md](./07-UNIVERSITIES-FEATURE.md) — features/universities/ (UniversityDetail.jsx)
9. [08-PARTNERS-FEATURE.md](./08-PARTNERS-FEATURE.md) — features/partners/ (Partners.jsx)
10. [09-SPECIALIZATIONS-FEATURE.md](./09-SPECIALIZATIONS-FEATURE.md) — features/specializations/
11. [10-AUTH-FEATURE.md](./10-AUTH-FEATURE.md) — features/auth/ (Login, SignUp, OTP)

### Page Components
12. [11-PAGES-REFACTORING.md](./11-PAGES-REFACTORING.md) — Thin page orchestrators
13. [12-REGISTRATION-PAGES.md](./12-REGISTRATION-PAGES.md) — Student registration flow (formerly "Regstation")

### Performance & Optimization
14. [13-PERFORMANCE-OPTIMIZATIONS.md](./13-PERFORMANCE-OPTIMIZATIONS.md) — Memoization, lazy loading, code splitting
15. [14-IMAGE-OPTIMIZATION.md](./14-IMAGE-OPTIMIZATION.md) — Lazy images and IntersectionObserver

### File Renaming & Cleanup
16. [15-FILE-RENAMING.md](./15-FILE-RENAMING.md) — Typo fixes and naming conventions
17. [16-FORM-CONSOLIDATION.md](./16-FORM-CONSOLIDATION.md) — GetInTouch form variants merge

### Testing & Verification
18. [17-TESTING-CHECKLIST.md](./17-TESTING-CHECKLIST.md) — Route-by-route verification
19. [18-BUILD-VERIFICATION.md](./18-BUILD-VERIFICATION.md) — Production build and Lighthouse audit

---

## 🎯 Refactoring Goals

1. ✅ **Scalability** — Feature-based folder structure
2. ✅ **Maintainability** — Single responsibility principle (files < 200 lines)
3. ✅ **Performance** — Code splitting, memoization, lazy loading
4. ✅ **Testability** — Isolated components and hooks
5. ✅ **Code Reuse** — Shared components and utilities
6. ✅ **No Breaking Changes** — All routes, URLs, and designs remain identical

---

## 📊 Current vs. Target Metrics

| Metric | Before | After |
|--------|--------|-------|
| **Largest File** | 2,766 lines (Courses.jsx) | < 200 lines |
| **Average File Size** | ~800 lines | ~100 lines |
| **Total Files** | 75 | 130+ |
| **Service Files** | 2 | 10+ |
| **Custom Hooks** | 0 | 15+ |
| **Reusable Components** | Minimal | High |
| **Test Coverage** | 0% (untestable) | Ready for testing |

---

## 📁 New Folder Structure

```
src/
├── app/                    # App shell & routing
├── layouts/                # Page layouts
├── pages/                  # Thin page orchestrators (~40 files)
├── features/               # Domain-driven modules (~6 domains)
│   ├── courses/
│   ├── universities/
│   ├── partners/
│   ├── specializations/
│   └── auth/
├── components/             # Shared components
│   ├── ui/                 # Atomic primitives
│   ├── forms/              # Form components
│   ├── seo/                # SEO components
│   ├── navigation/         # Nav/Footer
│   └── common/             # Shared display
├── hooks/                  # Shared custom hooks
├── services/               # API layer
├── utils/                  # Pure utilities
├── constants/              # App constants
├── context/                # React Context
└── styles/                 # Global styles
```

---

## 🔄 Migration Phases

### Phase 1: Foundation (Docs 03-05)
- Extract shared utilities, constants, and hooks
- Centralize API service layer
- Build reusable UI components

### Phase 2: Feature Extraction (Docs 06-10)
- Refactor Courses feature (largest file)
- Refactor Universities feature
- Refactor Partners feature
- Refactor Specializations feature
- Refactor Auth feature

### Phase 3: Page Composition (Docs 11-12)
- Create thin page orchestrators
- Update registration pages
- Wire up new imports

### Phase 4: Optimization (Docs 13-14)
- Apply performance optimizations
- Implement image lazy loading
- Add memoization

### Phase 5: Cleanup (Docs 15-16)
- Fix file naming typos
- Consolidate duplicate forms
- Remove old files

### Phase 6: Verification (Docs 17-18)
- Test all routes
- Production build
- Lighthouse audit

---

## 📝 Documentation Format

Each document follows this structure:

### File Header
- **Document Title**
- **Related Files** (list of all affected files)
- **Purpose** (what problem it solves)

### Change Details
For each file changed:
1. **File Path** — Full path of the file
2. **Type of Change** — NEW / MODIFIED / MOVED / DELETED
3. **Lines Changed** — Specific line numbers (if applicable)
4. **What Changed** — Code snippets showing before/after
5. **Why Changed** — Rationale and benefits
6. **Dependencies** — What this change depends on
7. **Testing Notes** — How to verify the change

### Review Checklist
- Functional testing steps
- Edge cases to verify
- Performance impact
- Breaking change check

---

## 🚀 Getting Started

If you're reviewing this refactoring:

1. **Start with Architecture** — Read [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md)
2. **Understand Strategy** — Read [02-MIGRATION-STRATEGY.md](./02-MIGRATION-STRATEGY.md)
3. **Review by Feature** — Go through docs 06-10 for each feature module
4. **Check Pages** — Review docs 11-12 for page changes
5. **Verify Tests** — Use doc 17 to test routes

If you're implementing:
- Follow the phase order listed above
- Complete one document's changes before moving to the next
- Test after each document's changes are applied
- Check off items in [task.md](../../.gemini/antigravity/brain/6ad3f99b-0bc6-4b61-899b-24afad8891e1/task.md)

---

## ⚠️ Critical Rules

1. **No Route Changes** — All URLs must remain identical
2. **No Design Changes** — All UI must look identical
3. **No Breaking Changes** — All functionality must work identically
4. **Test After Each Phase** — Don't move forward until current phase is verified
5. **Commit After Each Phase** — Small, atomic commits

---

## 👥 Team Collaboration

- **Code Review Format** — Each MD file is a separate pull request
- **Approval Required** — Get sign-off on each phase before proceeding
- **Rollback Strategy** — Each phase can be reverted independently
- **Documentation Updates** — Update this index as you complete each phase

---

## 📞 Questions or Issues?

If you encounter issues during refactoring:
1. Check the specific MD file for troubleshooting notes
2. Refer to [02-MIGRATION-STRATEGY.md](./02-MIGRATION-STRATEGY.md) for rollback procedures
3. Review the original [ARCHITECTURE_REFACTORING_PLAN.md](../../ARCHITECTURE_REFACTORING_PLAN.md)

---

**Next Steps:** Read [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) to understand the new architecture.
