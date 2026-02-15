# Migration Strategy

**Document:** 02-MIGRATION-STRATEGY.md  
**Purpose:** Define the step-by-step approach for migrating to the new architecture  
**Status:** Phase 1 — Foundation

---

## 🎯 Migration Philosophy

**Core Principle:** Incremental, testable changes with zero downtime.

### Key Guidelines

1. **Small atomic changes** — One feature/component at a time
2. **Test after each change** — Verify routes work before proceeding
3. **Reversible commits** — Each phase can be rolled back
4. **No breaking changes** — All routes/URLs remain identical
5. **Parallel development** — Old and new code coexist during migration

---

## 📋 Migration Phases

### Phase 1: Foundation (Week 1)
**Goal:** Set up infrastructure without touching existing pages

| Step | Task | Files Created | Risk |
|------|------|---------------|------|
| 1.1 | Create folder structure | All directories | Low |
| 1.2 | Extract shared utilities | `utils/*` | Low |
| 1.3 | Create constants | `constants/*` | Low |
| 1.4 | Build shared hooks | `hooks/*` | Low |
| 1.5 | Centralize API service | `services/api.js` | Medium |
| 1.6 | Build UI components | `components/ui/*` | Low |

**Verification:**
- Build succeeds: `npm run build`
- Dev server runs: `npm run dev`
- No console errors

---

### Phase 2: Feature Extraction (Week 2-3)
**Goal:** Extract features one by one

| Order | Feature | Files Affected | Priority | Complexity |
|-------|---------|----------------|----------|------------|
| 1 | Courses | `Courses.jsx` (2766 lines) | High | High |
| 2 | Universities | `UniversityDetail.jsx` (2069 lines) | High | High |
| 3 | Partners | `Partners.jsx` (1145 lines) | Medium | Medium |
| 4 | Specializations | `SpecializationDetail.jsx` (1241 lines) | Medium | Medium |
| 5 | Auth | `ModalSignUp.jsx`, `ModalLogin.jsx` | Medium | Low |

**Per-Feature Steps:**
1. Create `features/{name}/services/` — Extract API calls
2. Create `features/{name}/hooks/` — Extract stateful logic
3. Create `features/{name}/components/` — Extract UI components
4. Test feature in isolation
5. Integrate into existing page (side-by-side with old code)
6. Verify page works identically
7 Remove old code
8. Commit

**Verification per feature:**
- Feature renders identically
- All interactions work (filters, search, pagination)
- No console errors
- Lighthouse score doesn't degrade

---

### Phase 3: Page Composition (Week 4)
**Goal:** Create thin page orchestrators

| Step | Task | Files Created |
|------|------|---------------|
| 3.1 | Create layouts | `layouts/*` |
| 3.2 | Create page components | `pages/**/*Page.jsx` |
| 3.3 | Update App.jsx imports | `App.jsx` |
| 3.4 | Verify all routes | All 45+ routes |

**Page Migration Pattern:**
1. Create new page file in `pages/{category}/{Name}Page.jsx`
2. Import feature components
3. Compose page with SEO + features
4. Update lazy import in `App.jsx`
5. Test route
6. Delete old page file
7. Commit

---

### Phase 4: Optimization (Week 5)
**Goal:** Apply performance optimizations

| Step | Task | Impact |
|------|------|--------|
| 4.1 | Add React.memo to list items | -200ms render |
| 4.2 | Implement lazy images | -500ms LCP |
| 4.3 | Add debounced search | Fewer API calls |
| 4.4 | Optimize imports (icons, MUI) | -350KB bundle |
| 4.5 | Add route preloading | -300ms navigation |

**Verification:**
- Run Lighthouse audit
- Target: Performance > 90, LCP < 2.5s

---

### Phase 5: Cleanup (Week 5)
**Goal:** Clean up remnants

| Step | Task |
|------|------|
| 5.1 | Fix file naming typos |
| 5.2 | Consolidate GetInTouch forms |
| 5.3 | Remove unused files |
| 5.4 | Update imports |

**Verification:**
- No unused files
- No broken imports
- Build succeeds

---

### Phase 6: Verification (Week 6)
**Goal:** Final comprehensive testing

| Step | Task |
|------|------|
| 6.1 | Test all 45+ routes |
| 6.2 | Test mobile responsiveness |
| 6.3 | Verify SEO meta tags |
| 6.4 | Production build |
| 6.5 | Lighthouse audit |
| 6.6 | Deploy to staging |

---

## 🔧 Technical Migration Steps

### Step 1: Create Folder Structure

```bash
# Create all necessary directories
mkdir -p src/app
mkdir -p src/layouts
mkdir -p src/pages/{home,universities,courses,specializations,scholarships,resources,about,partners,blog,student,auth,legal,qualification,contact}
mkdir -p src/features/{courses,universities,partners,specializations,auth}/{components,hooks,services}
mkdir -p src/components/{ui,forms,seo,navigation,common}
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/context
mkdir -p src/styles
```

**Verification:**
```bash
ls -R src/  # Verify all directories exist
```

---

### Step 2: Extract Utilities (No Dependencies)

**Order of extraction:**

1. **Pure functions first** (no React dependencies)
   - `utils/formatters.js`
   - `utils/slugHelpers.js`
   - `utils/htmlHelpers.js`
   - `utils/validators.js`

2. **Constants** (no dependencies)
   - `constants/config.js`
   - `constants/routes.js`
   - `constants/filterOptions.js`

3. **API service** (depends on constants)
   - `services/api.js`
   - `services/endpoints.js`

**Example: Extract formatters**

```jsx
// NEW FILE: src/utils/formatters.js
export function formatCurrency(amount, currency = 'MYR') {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-MY');
}
```

**Usage in existing files:**
```jsx
// BEFORE (in Courses.jsx line 1234)
const formatted = `RM ${course.fee}`;

// AFTER
import { formatCurrency } from '../../utils/formatters';
const formatted = formatCurrency(course.fee);
```

**Test:**
```bash
npm run dev
# Verify no errors
```

---

### Step 3: Create Shared Hooks

**Order:**

1. `hooks/useDebounce.js` (no dependencies)
2. `hooks/useIntersectionObserver.js`
3. `hooks/useMediaQuery.js`
4. `hooks/usePagination.js`
5. `hooks/useScrollLock.js`

**Example: useDebounce**

```jsx
// NEW FILE: src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

**Test:** Create a test component to verify the hook works

---

### Step 4: Build Reusable UI Components

**Order (no dependencies → with dependencies):**

1. `components/ui/Skeleton.jsx`
2. `components/ui/Spinner.jsx`
3. `components/ui/Button.jsx`
4. `components/ui/Input.jsx`
5. `components/ui/Select.jsx`
6. `components/ui/Card.jsx`
7. `components/ui/Modal.jsx`
8. `components/ui/Pagination.jsx`

**Example: Skeleton**

```jsx
// NEW FILE: src/components/ui/Skeleton.jsx
export default function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
}
```

**Test:** Use in existing components to verify styling

---

### Step 5: Extract Feature — Courses (LARGEST FILE)

**This is the most complex migration. Break it down into 10 sub-steps:**

#### 5.1: Extract API Service

```jsx
// NEW FILE: src/features/courses/services/courseApi.js
import api from '../../../services/api';

export async function fetchCourses({ page = 1, filters = {}, search = '' }) {
  const params = new URLSearchParams();
  params.append('page', page);
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  if (search) params.append('search', search);
  
  const { data } = await api.get(`/courses?${params.toString()}`);
  return data;
}

export async function fetchFilterOptions(filters = {}) {
  const { data } = await api.get('/courses/filters', { params: filters });
  return data;
}

export async function fetchDynamicDescription(filterType, filterId) {
  const { data } = await api.get(`/courses/description/${filterType}/${filterId}`);
  return data;
}
```

**Test:**
```jsx
// In browser console
import { fetchCourses } from './features/courses/services/courseApi';
fetchCourses({ page: 1 }).then(console.log);
```

#### 5.2: Extract Filter Hook

```jsx
// NEW FILE: src/features/courses/hooks/useCourseFilters.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFilterOptions } from '../services/courseApi';

export function useCourseFilters() {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [openSections, setOpenSections] = useState({});
  const navigate = useNavigate();
  
  // ... Extract handleFilterChange, toggleFilter, handleReset
  
  return {
    filters,
    filterOptions,
    openSections,
    handleFilterChange,
    toggleFilter,
    handleReset,
  };
}
```

**Lines extracted from Courses.jsx:** 801-991 (190 lines)

**Test:** Use hook in Courses.jsx side-by-side with old logic

#### 5.3-5.10: Continue for other hooks and components

*Detailed in [06-COURSES-FEATURE.md](./06-COURSES-FEATURE.md)*

---

## 🧪 Testing Strategy

### After Each File Change

```bash
# 1. Verify no syntax errors
npm run dev

# 2. Open browser
# http://localhost:5173

# 3. Test the affected route
# Example: http://localhost:5173/courses-in-malaysia

# 4. Check console for errors (F12 → Console)

# 5. Test interactions
# - Click filters
# - Type in search
# - Click pagination
# - Open modals
```

### After Each Feature

**Functional Test Checklist:**
- [ ] Page renders without errors
- [ ] All filters work
- [ ] Search works
- [ ] Pagination works
- [ ] Sorting works
- [ ] Modals open/close
- [ ] Forms submit
- [ ] API calls succeed
- [ ] Skeletons show during loading
- [ ] Mobile responsive

**Visual Test:**
- [ ] Layout looks identical
- [ ] Colors match
- [ ] Spacing matches
- [ ] Fonts match
- [ ] Icons render

**Performance Test:**
```bash
npm run build
npm run preview
# Open Lighthouse in Chrome DevTools
# Run audit
# Verify: Performance > 85
```

### After Each Phase

**Regression Test:**
- Test ALL 45+ routes
- Verify no broken links
- Check SEO meta tags (`view-source:`)
- Test on mobile device
- Test in multiple browsers (Chrome, Safari, Firefox)

---

## 🔄 Rollback Procedures

### If a Change Breaks Something

**Immediate rollback:**
```bash
git status
git checkout .  # Discard all changes
npm run dev     # Verify it works
```

**Rollback specific file:**
```bash
git checkout -- path/to/file.jsx
```

**Rollback to last commit:**
```bash
git reset --hard HEAD
```

### If Migration Needs to Pause

**Safe pause points:**
- After Phase 1 (foundation complete)
- After each feature extraction
- After Phase 3 (pages complete)

**To pause:**
1. Commit current work
2. Tag the commit: `git tag migration-pause-point`
3. Push to backup branch
4. Document what's left in task.md

**To resume:**
1. Pull latest
2. Check task.md
3. Continue from next uncompleted step

---

## 📊 Progress Tracking

### Use task.md

Update `C:\Users\prins\.gemini\antigravity\brain\6ad3f99b-0bc6-4b61-899b-24afad8891e1\task.md`:

```markdown
## Phase 1: Foundation
- [x] Create folder structure
- [x] Extract utilities
- [x] Create constants
- [x] Build shared hooks
- [/] Centralize API service
- [ ] Build UI components

## Phase 2: Feature Extraction
- [ ] Courses feature
- [ ] Universities feature
- [ ] Partners feature
- [ ] Specializations feature
- [ ] Auth feature
```

### Commit Message Format

```
refactor(feature): extract {component} from {oldFile}

- Extracted {ComponentName} to features/{feature}/components/
- Moved API calls to features/{feature}/services/
- Created useSomething hook in features/{feature}/hooks/
- Updated imports in {oldFile}

Routes tested: /path/to/route
No breaking changes
```

---

## ⚠️ Risk Mitigation

### High-Risk Changes

| Change | Risk | Mitigation |
|--------|------|------------|
| Extracting API calls | May break data flow | Test each API function independently |
| Moving hooks | State may reset | Verify state persists across renders |
| Updating imports | May break build | Use IDE refactoring tools |
| Deleting old files | Lose code | Keep old files until fully verified |

### Safety Measures

1. **Never delete original files immediately** — Keep as `.old` suffix
2. **Test on feature branch first** — Merge only after verification
3. **Deploy to staging** — Test in production-like environment
4. **Have rollback plan** — Know how to revert each change
5. **Pair programming** — Two sets of eyes on complex changes

---

## 🚀 Quick Start

**Day 1:**
1. Read this document
2. Create folder structure (Step 1)
3. Extract formatters (Step 2, sub-task 1)
4. Test: `npm run dev`
5. Commit: `git commit -m "refactor: create folder structure and extract formatters"`

**Day 2-3:**
- Extract remaining utilities
- Create constants
- Build shared hooks
- Test each utility independently

**Day 4-7:**
- Extract Courses feature (hardest one)
- Follow [06-COURSES-FEATURE.md](./06-COURSES-FEATURE.md) step-by-step
- Test thoroughly

**Week 2:**
- Extract remaining features (one per day)
- Universities → Partners → Specializations → Auth

**Week 3:**
- Create thin pages
- Update App.jsx
- Verify all routes

**Week 4:**
- Optimize performance
- Clean up
- Final testing

---

**Next:** [03-SHARED-UTILITIES.md](./03-SHARED-UTILITIES.md) — Start with utility extraction
