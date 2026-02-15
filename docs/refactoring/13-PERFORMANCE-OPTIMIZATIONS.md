# Performance Optimizations

**Document:** 13-PERFORMANCE-OPTIMIZATIONS.md  
**Purpose:** Apply React and Vite optimizations for better performance  
**Phase:** 4 — Optimization  
**Estimated Impact:** ~40% faster page loads, -350KB bundle size

---

## 🎯 Optimization Goals

| Metric | Before | Target | Strategy |
|--------|---------|--------|----------|
| **LCP (Largest Contentful Paint)** | ~4.5s | < 2.5s | Lazy images, code splitting |
| **FID (First Input Delay)** | ~200ms | < 100ms | Memoization, debouncing |
| **CLS (Cumulative Layout Shift)** | ~0.15 | < 0.1 | Skeleton placeholders |
| **Bundle Size** | ~600KB | < 400KB | Tree-shaking, imports |
| **Time to Interactive** | ~6s | < 4s | Code splitting, prefetch |

---

## 🚀 Optimization Strategies

### 1. React.memo for List Items

**Problem:** List item components re-render even when props don't change

**Solution:** Wrap all list components with `React.memo`

#### Files to Modify

**`features/courses/components/CourseCard.jsx`**

```diff
- export default function CourseCard({ course, onApply, onCompare, isCompared }) {
+ const CourseCard = React.memo(({ course, onApply, onCompare, isCompared }) => {
  return (
    <div className="course-card">
      {/* ... */}
    </div>
  );
- }
+ });
+
+ CourseCard.displayName = 'CourseCard';
+ export default CourseCard;
```

**Why?** Prevents re-rendering when parent updates but course data hasn't changed

**Impact:** ~200ms faster rendering for 50-item lists

#### Apply to All List Components

| File | Component | Change |
|------|-----------|--------|
| `features/courses/components/CourseCard.jsx` | `CourseCard` | Wrap with `React.memo` |
| `features/universities/components/UniversityCard.jsx` | `UniversityCard` | Wrap with `React.memo` |
| `features/partners/components/PartnerCard.jsx` | `PartnerCard` | Wrap with `React.memo` |
| `features/specializations/components/SpecializationCard.jsx` | `SpecializationCard` | Wrap with `React.memo` |

**Testing:**
```jsx
// In browser console
// 1. Open React DevTools
// 2. Enable "Highlight updates when components render"
// 3. Change page (e.g. go to page 2)
// 4. Verify only new items render, not all items
```

---

### 2. useMemo for Filtered/Sorted Data

**Problem:** Expensive computations run on every render

**Solution:** Memoize computed values with `useMemo`

#### Example: Filter Hook

**`features/courses/hooks/useCourseFilters.js`**

```diff
export function useCourseFilters() {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

+  // Memoize active filter count
+  const activeFilterCount = useMemo(() => {
+    return Object.values(filters).filter(v => v && v !== 'all').length;
+  }, [filters]);

+  // Memoize whether filters are active
+  const hasActiveFilters = useMemo(() => {
+    return activeFilterCount > 0;
+  }, [activeFilterCount]);

  return {
    filters,
    filterOptions,
+    activeFilterCount,
+    hasActiveFilters,
    // ...
  };
}
```

**Why?** Prevents recalculation on every render

**Impact:** ~50ms saved per render

---

### 3. useCallback for Event Handlers

**Problem:** New function instances created on every render

**Solution:** Stabilize callbacks with `useCallback`

**Already applied in hooks during refactoring ✅**

Example from `useCourseFilters.js`:

```jsx
const handleFilterChange = useCallback((filterType, value) => {
  setFilters(prev => {
    const updated = { ...prev, [filterType]: value };
    // ... logic
    return updated;
  });
}, [navigate]);  // ← Dependencies
```

**Why?** Prevents child components from re-rendering due to new function refs

**Impact:** Works together with `React.memo` for maximum benefit

---

### 4. Lazy Image Loading

**Problem:** All images load immediately, blocking page load

**Solution:** Lazy load images with IntersectionObserver

#### Create Shared Hook

**NEW FILE: `src/hooks/useIntersectionObserver.js`**

```jsx
import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect when element enters viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {[Function, boolean]} - [ref setter, isVisible]
 */
export function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [node, setNode] = useState(null);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, options]);

  return [setNode, isVisible];
}
```

#### Create LazyImage Component

**NEW FILE: `src/components/ui/LazyImage.jsx`**

```jsx
import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import Skeleton from './Skeleton';

const LazyImage = React.memo(({ src, alt, className = '', ...props }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={className}
          {...props}
        />
      ) : (
        <Skeleton className={className} />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
```

#### Use in Components

**`features/courses/components/CourseCard.jsx`**

```diff
+ import LazyImage from '../../../components/ui/LazyImage';

function CourseCard({ course }) {
  return (
    <div className="course-card">
-      <img src={course.image} alt={course.name} />
+      <LazyImage src={course.image} alt={course.name} />
      {/* ... */}
    </div>
  );
}
```

**Impact:** -500ms LCP, -2MB initial page weight

**Apply to:**
- Course cards
- University cards
- Partner logos
- Gallery images
- Featured sections

---

### 5. Debounced Search

**Problem:** API call on every keystroke

**Solution:** Debounce search input

**Already implemented in `useCourseSearch` ✅**

```jsx
export function useCourseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);  // ← 300ms delay
  
  return { searchTerm, debouncedSearchTerm };
}
```

**Why?** Reduces API calls from 10+ to 1-2 per search

**Impact:** -90% search API calls, better UX

---

### 6. Icon Import Optimization

**Problem:** Importing entire icon library adds 400KB

**Solution:** Use direct imports

#### WRONG ❌

```jsx
import { FaStar, FaHeart, FaShare } from 'react-icons/fa';  // Imports ENTIRE library
```

#### CORRECT ✅

```jsx
import { FaStar } from 'react-icons/fa6';  // Tree-shakeable
// OR
import FaStar from 'react-icons/fa6/FaStar';  // Direct import
```

#### Files to Fix

Search for all icon imports:

```bash
# Find all react-icons imports
grep -r "from 'react-icons" src/

# Fix each file
```

**Example fixes:**

```diff
- import { FaStar, FaHeart } from 'react-icons/fa';
+ import { FaStar } from 'react-icons/fa6';
+ import { FaHeart } from 'react-icons/fa6';
```

**Impact:** -200KB bundle size

---

### 7. MUI Direct Imports

**Problem:** Importing from `@mui/material` includes entire library

**Solution:** Use direct package paths

#### WRONG ❌

```jsx
import { LinearProgress, TextField } from '@mui/material';
```

#### CORRECT ✅

```jsx
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
```

#### Files to Fix

**`components/LinearDeterminate.jsx`**

```diff
- import { LinearProgress } from '@mui/material';
+ import LinearProgress from '@mui/material/LinearProgress';
```

**Impact:** -150KB bundle size

---

### 8. Enhanced Vite Config

**File:** `vite.config.js`

```diff
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'swiper'],
          'icons': ['lucide-react', 'react-icons'],
          'forms': ['react-toastify', 'react-hot-toast'],
+          // NEW: Feature-based chunking
+          'feature-courses': [
+            './src/features/courses/components/CourseCard',
+            './src/features/courses/components/CourseFilterPanel',
+          ],
+          'feature-universities': [
+            './src/features/universities/components/UniversityCard',
+          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
+    // NEW: Source maps for production debugging (optional)
+    sourcemap: false,  // Set to true if you need debugging in prod
  },
});
```

**Why?** Features load on-demand, not upfront

**Impact:** -30% initial bundle size

---

### 9. Route Preloading

**Problem:** Navigation feels slow

**Solution:** Preload routes on hover

**File:** `components/navigation/Navbar.jsx`

```jsx
import { lazy } from 'react';

// Preload functions
const preloadCourses = () => import('../../pages/courses/CoursesPage');
const preloadUniversities = () => import('../../pages/universities/UniversitiesPage');

function Navbar() {
  return (
    <nav>
      <Link 
        to="/courses-in-malaysia"
        onMouseEnter={preloadCourses}  // ← Prefetch on hover
      >
        Courses
      </Link>
      <Link
        to="/universities"
        onMouseEnter={preloadUniversities}
      >
        Universities
      </Link>
    </nav>
  );
}
```

**Why?** Page is already loaded when user clicks

**Impact:** -300ms perceived navigation time

---

### 10. Remove Console Logs

**Problem:** `console.log` in production slows down app

**Solution:** Remove in build

**Add to `vite.config.js`:**

```diff
export default defineConfig({
  build: {
+    terserOptions: {
+      compress: {
+        drop_console: true,  // Remove console.* in production
+        drop_debugger: true,
+      },
+    },
  },
});
```

**Impact:** Cleaner production code, slightly smaller bundle

---

## 📊 Measurement & Testing

### Before Optimization

```bash
npm run build
npm run preview

# Open Chrome DevTools → Lighthouse
# Run Desktop audit
# Record metrics
```

**Expected before:**
- Performance: 70-80
- LCP: 4-5s
- FID: 200-300ms
- Bundle size: ~600KB

### After Optimization

```bash
# Apply all optimizations
# Rebuild
npm run build
npm run preview

# Run Lighthouse again
# Compare metrics
```

**Target after:**
- Performance: 90-95
- LCP: < 2.5s
- FID: < 100ms
- Bundle size: < 400KB

---

## ✅ Optimization Checklist

### React Optimizations
- [ ] Add `React.memo` to all list item components
- [ ] Add `useMemo` for computed values
- [ ] Verify `useCallback` in all event handlers
- [ ] Test re-render behavior in React DevTools

### Image Optimizations
- [ ] Create `useIntersectionObserver` hook
- [ ] Create `LazyImage` component
- [ ] Replace all `<img>` with `<LazyImage>`
- [ ] Test images load on scroll

### Import Optimizations
- [ ] Fix all react-icons imports
- [ ] Fix all @mui/material imports
- [ ] Verify bundle size reduction

### Vite Optimizations
- [ ] Add feature-based chunking
- [ ] Configure terser options
- [ ] Test production build

### UX Optimizations
- [ ] Debounce all search inputs
- [ ] Add route preloading
- [ ] Test navigation speed

---

## 🧪 Verification

### Performance Testing

```bash
# 1. Build
npm run build

# 2. Analyze bundle
npx vite-bundle-visualizer

# 3. Preview
npm run preview

# 4. Lighthouse audit (all pages)
# - Home page
# - Courses page
# - University detail page
# - Partners page
```

### Load Testing

```bash
# Test with slow 3G
# Chrome DevTools → Network → Slow 3G
# Verify:
# - Skeletons show immediately
# - Content loads progressively
# - No layout shift
```

---

## 📈 Expected Results

| Optimization | Performance Gain | Effort |
|--------------|------------------|--------|
| React.memo | +5-10 points | Low |
| Lazy images | +10-15 points | Low |
| Icon optimization | +3-5 points | Low |
| MUI optimization | +2-3 points | Low |
| Feature chunking | +5-8 points | Medium |
| Route preloading | +3-5 points | Low |

**Total Impact:** +28-46 Lighthouse points

---

**Next:** [14-IMAGE-OPTIMIZATION.md](./14-IMAGE-OPTIMIZATION.md) — Advanced image techniques
