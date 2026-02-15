# Courses Feature Refactoring

**Document:** 06-COURSES-FEATURE.md  
**Purpose:** Step-by-step guide to refactor Courses.jsx (2,766 lines → 12 files)  
**Phase:** 2 — Feature Extraction  
**Priority:** HIGH (Largest file)  
**Estimated Time:** 2-3 days

---

## 📊 Overview

### Current State
**File:** `src/pages/Courses.jsx`  
**Lines:** 2,766  
**Size:** 133 KB  
**Complexity:** Very High

### Target State
**12 new files across 3 directories:**
- `features/courses/services/` — 1 file (API calls)
- `features/courses/hooks/` — 4 files (stateful logic)
- `features/courses/components/` — 7 files (UI + skeletons)

### Files to Create

| # | File Path | Lines | Purpose |
|---|-----------|-------|---------|
| 1 | `features/courses/services/courseApi.js` | ~80 | API calls (fetch courses, filters, descriptions) |
| 2 | `features/courses/hooks/useCourseFilters.js` | ~150 | Filter state & logic |
| 3 | `features/courses/hooks/useCourseSearch.js` | ~50 | Search & placeholder logic |
| 4 | `features/courses/hooks/useCoursePagination.js` | ~60 | Pagination & data fetching |
| 5 | `features/courses/hooks/useCourseCompare.js` | ~50 | Compare functionality |
| 6 | ` features/courses/components/CourseCard.jsx` | ~120 | Single course card UI |
| 7 | `features/courses/components/CourseFilterPanel.jsx` | ~200 | Sidebar filter panel |
| 8 | `features/courses/components/CourseSearchBar.jsx` | ~50 | Search input |
| 9 | `features/courses/components/CourseSortDropdown.jsx` | ~60 | Sort dropdown |
| 10 | `features/courses/components/CourseCompareBar.jsx` | ~80 | Sticky compare bar |
| 11 | `features/courses/components/CourseCardSkeleton.jsx` | ~30 | Loading skeleton |
| 12 | `features/courses/components/CourseFilterSkeleton.jsx` | ~20 | Filter loading skeleton |

---

## 🔧 Step-by-Step Refactoring

### STEP 1: Extract API Service

**File to Create:** `src/features/courses/services/courseApi.js`

**What to Extract:**
- Lines 216-315: `fetchFilterOptions()`
- Lines 316-372: `fetchDynamicDescription()`
- Lines 373-430: `fetchCourses()`

**NEW FILE:**

```jsx
/**
 * Course API Service
 * Centralized API calls for course-related operations
 */

import api from '../../../services/api';

/**
 * Fetch courses with filters, search, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {Object} params.filters - Filter values
 * @param {string} params.search - Search term
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort direction (asc|desc)
 * @returns {Promise<Object>} Course data with pagination
 */
export async function fetchCourses({
  page = 1,
  filters = {},
  search = '',
  sortBy = '',
  sortOrder = 'asc',
}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page);

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value);
      }
    });

    // Add search
    if (search) {
      params.append('search', search);
    }

    // Add sorting
    if (sortBy) {
      params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);
    }

    const { data } = await api.get(`/courses?${params.toString()}`);
    
    return {
      courses: data.courses?.data || [],
      pagination: {
        currentPage: data.courses?.current_page || 1,
        lastPage: data.courses?.last_page || 1,
        total: data.courses?.total || 0,
        perPage: data.courses?.per_page || 12,
      },
      seo: data.seo || null,
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

/**
 * Fetch available filter options based on current filters
 * @param {Object} currentFilters - Currently applied filters
 * @returns {Promise<Object>} Available filter options
 */
export async function fetchFilterOptions(currentFilters = {}) {
  try {
    const params = new URLSearchParams();
    
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value);
      }
    });

    const { data } = await api.get(`/courses/filters?${params.toString()}`);
    
    return {
      universities: data.universities || [],
      specializations: data.specializations || [],
      levels: data.levels || [],
      states: data.states || [],
      modes: data.modes || [],
      intakes: data.intakes || [],
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      universities: [],
      specializations: [],
      levels: [],
      states: [],
      modes: [],
      intakes: [],
    };
  }
}

/**
 * Fetch dynamic description based on filter type
 * @param {string} filterType - Type of filter (university, specialization, etc.)
 * @param {string|number} filterId - ID of the filter value
 * @returns {Promise<Object>} Description data
 */
export async function fetchDynamicDescription(filterType, filterId) {
  try {
    const { data } = await api.get(`/courses/description/${filterType}/${filterId}`);
    
    return {
      title: data.title || '',
      description: data.description || '',
      metaDescription: data.meta_description || '',
    };
  } catch (error) {
    console.error('Error fetching dynamic description:', error);
    return {
      title: '',
      description: '',
      metaDescription: '',
    };
  }
}
```

**Changes to Courses.jsx:**

```diff
// At the top of Courses.jsx
+ import { fetchCourses, fetchFilterOptions, fetchDynamicDescription } from '../../features/courses/services/courseApi';

// Delete lines 216-430 (these functions are now in courseApi.js)
- const fetchFilterOptions = async (filtersToApply = {}) => {
-   // ... 100 lines
- };
- const fetchDynamicDescription = async (filterType, filterId) => {
-   // ... 56 lines
- };
- const fetchCourses = async (page = 1, filtersToApply = {}, searchTerm = "") => {
-   // ... 58 lines
- };

// Update usage (no changes needed, function calls remain the same)
```

**Testing STEP 1:**
```bash
npm run dev
# Navigate to /courses-in-malaysia
# Verify courses load
# Check browser console for errors
# Test pagination
```

**Verification Checklist:**
- [ ] Dev server starts without errors
- [ ] Courses page loads
- [ ] Courses data displays
- [ ] No console errors
- [ ] API calls visible in Network tab

---

### STEP 2: Extract Filter Hook

**File to Create:** `src/features/courses/hooks/useCourseFilters.js`

**What to Extract:**
- Lines 86-182: Filter state declarations
- Lines 801-991: `handleFilterChange()` function (190 lines!)
- Lines 993-1010: `toggleFilter()`, `handleReset()`
- Lines 1011-1018: `handleUniversityClick()`

**NEW FILE:**

```jsx
/**
 * Course Filters Hook
 * Manages filter state and URL synchronization
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchFilterOptions } from '../services/courseApi';

export function useCourseFilters() {
  // State
  const [filters, setFilters] = useState({
    university: '',
    specialization: '',
    level: '',
    state: '',
    mode: '',
    intake: '',
  });
  
  const [filterOptions, setFilterOptions] = useState({
    universities: [],
    specializations: [],
    levels: [],
    states: [],
    modes: [],
    intakes: [],
  });
  
  const [openSections, setOpenSections] = useState({
    university: true,
    specialization: false,
    level: false,
    state: false,
    mode: false,
    intake: false,
  });
  
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  /**
   * Parse URL params into filter state
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const parsedFilters = {};
    
    ['university', 'specialization', 'level', 'state', 'mode', 'intake'].forEach(key => {
      const value = urlParams.get(key);
      if (value) parsedFilters[key] = value;
    });
    
    setFilters(prev => ({ ...prev, ...parsedFilters }));
  }, [location.search]);

  /**
   * Fetch filter options when filters change
   */
  useEffect(() => {
    const loadFilters = async () => {
      const options = await fetchFilterOptions(filters);
      setFilterOptions(options);
    };
    
    loadFilters();
  }, [filters]);

  /**
   * Handle filter change and update URL
   */
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => {
      const updated = { ...prev, [filterType]: value };
      
      // Build new URL
      const params = new URLSearchParams();
      Object.entries(updated).forEach(([key, val]) => {
        if (val && val !== 'all') {
          params.append(key, val);
        }
      });
      
      // Navigate to new URL
      const queryString = params.toString();
      const newPath = queryString
        ? `/courses-in-malaysia?${queryString}`
        : '/courses-in-malaysia';
      
      navigate(newPath, { replace: true });
      
      return updated;
    });
  }, [navigate]);

  /**
   * Reset all filters
   */
  const handleReset = useCallback(() => {
    setFilters({
      university: '',
      specialization: '',
      level: '',
      state: '',
      mode: '',
      intake: '',
    });
    navigate('/courses-in-malaysia', { replace: true });
  }, [navigate]);

  /**
   * Toggle filter section open/closed
   */
  const toggleFilter = useCallback((key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  /**
   * Handle university click (convenience function)
   */
  const handleUniversityClick = useCallback((universitySlug) => {
    handleFilterChange('university', universitySlug);
  }, [handleFilterChange]);

  return {
    // State
    filters,
    filterOptions,
    openSections,
    
    // Actions
    handleFilterChange,
    handleReset,
    toggleFilter,
    handleUniversityClick,
  };
}
```

**Changes to Courses.jsx:**

```diff
// At the top
+ import { useCourseFilters } from '../../features/courses/hooks/useCourseFilters';

// In Courses component
function Courses() {
+  const {
+    filters,
+    filterOptions,
+    openSections,
+    handleFilterChange,
+    handleReset,
+    toggleFilter,
+    handleUniversityClick,
+  } = useCourseFilters();

  // Delete lines 86-182 (filter state declarations)
-  const [filters, setFilters] = useState({});
-  const [filterOptions, setFilterOptions] = useState({});
-  const [openSections, setOpenSections] = useState({});

  // Delete lines 801-1018 (filter functions)
-  const handleFilterChange = (filterType, value) => {
-    // ... 190 lines
-  };
-  const toggleFilter = (key) => { ... };
-  const handleReset = () => { ... };
-  const handleUniversityClick = (universityName) => { ... };
}
```

**Testing STEP 2:**
```bash
npm run dev
# Test filter interactions:
# 1. Click a filter option
# 2. Verify URL updates
# 3. Verify courses update
# 4. Click Reset button
# 5. Verify filters clear
```

**Verification Checklist:**
- [ ] Filters render correctly
- [ ] Clicking filter updates URL
- [ ] Clicking filter fetches new courses
- [ ] Reset button clears all filters
- [ ] URL stays in sync with filters

---

### STEP 3: Extract Search Hook

**File to Create:** `src/features/courses/hooks/useCourseSearch.js`

**What to Extract:**
- Lines 183-215: `getSearchPlaceholder()`
- Lines 1020-1032: `handleSearch()`
- Search state management

**NEW FILE:**

```jsx
/**
 * Course Search Hook
 * Manages search state and dynamic placeholder
 */

import { useState, useMemo } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

export function useCourseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * Generate dynamic placeholder based on time and filters
   */
  const placeholder = useMemo(() => {
    const placeholders = [
      'Search for MBA, Engineering, Medicine...',
      'Try "Computer Science" or "Business"',
      'Find courses like "Data Science", "AI"...',
      'Search by course name or keyword',
    ];
    
    // Rotate placeholder based on current minute
    const index = new Date().getMinutes() % placeholders.length;
    return placeholders[index];
  }, []);

  /**
   * Handle search input change
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    placeholder,
    handleSearch,
    setSearchTerm,
  };
}
```

**Changes to Courses.jsx:**

```diff
+ import { useCourseSearch } from '../../features/courses/hooks/useCourseSearch';

function Courses() {
+  const { searchTerm, debouncedSearchTerm, placeholder, handleSearch } = useCourseSearch();

  // Delete search-related state
-  const [searchTerm, setSearchTerm] = useState('');

  // Delete lines 183-215, 1020-1032
-  const getSearchPlaceholder = () => { ... };
-  const handleSearch = (value) => { ... };
}
```

---

### STEP 4: Extract Pagination Hook

**File to Create:** `src/features/courses/hooks/useCoursePagination.js`

**What to Extract:**
- Pagination state
- `fetchCourses()` calls
- Page navigation logic

**NEW FILE:**

```jsx
/**
 * Course Pagination Hook
 * Manages course data fetching and pagination
 */

import { useState, useEffect } from 'react';
import { fetchCourses } from '../services/courseApi';

export function useCoursePagination(filters, searchTerm) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  /**
   * Fetch courses when filters, search, or page changes
   */
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      
      try {
        const data = await fetchCourses({
          page: currentPage,
          filters,
          search: searchTerm,
        });
        
        setCourses(data.courses);
        setTotalPages(data.pagination.lastPage);
        setTotalCourses(data.pagination.total);
      } catch (error) {
        console.error('Error loading courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, [filters, searchTerm, currentPage]);

  /**
   * Go to specific page
   */
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Next page
   */
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  /**
   * Previous page
   */
  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    courses,
    loading,
    currentPage,
    totalPages,
    totalCourses,
    goToPage,
    nextPage,
    previousPage,
  };
}
```

---

### STEP 5: Extract Compare Hook

**File to Create:** `src/features/courses/hooks/useCourseCompare.js`

**What to Extract:**
- Lines 1073-1170: Compare functionality

**NEW FILE:**

```jsx
/**
 * Course Compare Hook
 * Manages course comparison state
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const MAX_COMPARE = 3;

export function useCourseCompare() {
  const [comparedCourses, setComparedCourses] = useState([]);

  /**
   * Add course to comparison
   */
  const addToCompare = useCallback((course) => {
    if (comparedCourses.length >= MAX_COMPARE) {
      toast.warn(`You can only compare up to ${MAX_COMPARE} courses`);
      return;
    }
    
    if (comparedCourses.some(c => c.id === course.id)) {
      toast.info('Course already in comparison');
      return;
    }
    
    setComparedCourses(prev => [...prev, course]);
    toast.success('Course added to comparison');
  }, [comparedCourses]);

  /**
   * Remove course from comparison
   */
  const removeFromCompare = useCallback((courseId) => {
    setComparedCourses(prev => prev.filter(c => c.id !== courseId));
    toast.info('Course removed from comparison');
  }, []);

  /**
   * Clear all compared courses
   */
  const clearAll = useCallback(() => {
    setComparedCourses([]);
  }, []);

  /**
   * Check if course is in comparison
   */
  const isCompared = useCallback((courseId) => {
    return comparedCourses.some(c => c.id === courseId);
  }, [comparedCourses]);

  return {
    comparedCourses,
    addToCompare,
    removeFromCompare,
    clearAll,
    isCompared,
  };
}
```

---

### STEP 6-12: Extract Components

*Detailed component extraction in separate sections below*

---

## 📦 Component Extraction Details

### CourseCard Component

**File:** `src/features/courses/components/CourseCard.jsx`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, MapPin, Award } from 'lucide-react';

const CourseCard = React.memo(({ 
  course, 
  onApply, 
  onCompare, 
  isCompared 
}) => {
  return (
    <div className="rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      {/* Course Name */}
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
        {course.name}
      </h3>

      {/* University */}
      <Link 
        to={`/university/${course.university_slug}`}
        className="text-sm text-blue-600 hover:underline mb-3 block"
      >
        {course.university_name}
      </Link>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
        {course.duration && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
        )}
        
        {course.fee && (
          <div className="flex items-center gap-1">
            <DollarSign size={14} />
            <span>{course.fee}</span>
          </div>
        )}
        
        {course.state && (
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{course.state}</span>
          </div>
        )}
        
        {course.level && (
          <div className="flex items-center gap-1">
            <Award size={14} />
            <span>{course.level}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link 
          to={course.detail_url}
          className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>
        
        <button
          onClick={() => onApply(course)}
          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Apply Now
        </button>
        
        <button
          onClick={() => onCompare(course)}
          className={`px-4 py-2 rounded-lg border transition ${
            isCompared
              ? 'bg-orange-100 border-orange-500 text-orange-700'
              : 'border-gray-300 hover:border-orange-500'
          }`}
        >
          {isCompared ? 'Remove' : 'Compare'}
        </button>
      </div>
    </div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;
```

**Why React.memo?** Prevents re-rendering when parent updates but props haven't changed. Significant performance boost for lists.

---

### CourseFilterPanel Component

**File:** `src/features/courses/components/CourseFilterPanel.jsx`

*Extract lines 1171-1639 from Courses.jsx*

```jsx
import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function CourseFilterPanel({
  filters,
  filterOptions,
  openSections,
  onFilterChange,
  onToggle,
  onReset,
}) {
  const renderFilterSection = (key, label, options) => (
    <div key={key} className="border-b border-gray-200 py-4">
      <button
        onClick={() => onToggle(key)}
        className="w-full flex items-center justify-between font-semibold"
      >
        <span>{label}</span>
        <FiChevronDown
          className={`transform transition-transform ${
            openSections[key] ? 'rotate-180' : ''
          }`}
        />
      </button>

      {openSections[key] && (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {options.map(option => (
            <label
              key={option.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="radio"
                name={key}
                value={option.slug || option.id}
                checked={filters[key] === (option.slug || option.id)}
                onChange={(e) => onFilterChange(key, e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm">
                {option.name}
                {option.count !== undefined && (
                  <span className="text-gray-500 ml-1">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:underline"
        >
          Reset All
        </button>
      </div>

      {renderFilterSection('university', 'University', filterOptions.universities)}
      {renderFilterSection('specialization', 'Specialization', filterOptions.specializations)}
      {renderFilterSection('level', 'Level', filterOptions.levels)}
      {renderFilterSection('state', 'State', filterOptions.states)}
      {renderFilterSection('mode', 'Mode', filterOptions.modes)}
      {renderFilterSection('intake', 'Intake', filterOptions.intakes)}
    </div>
  );
}
```

---

## ✅ Final Integration

**After all extractions, the NEW Courses.jsx should look like:**

```jsx
// NEW: src/pages/courses/CoursesPage.jsx (~100 lines)

import React from 'react';
import SeoHead from '../../components/seo/SeoHead';
import DynamicBreadcrumb from '../../components/seo/DynamicBreadcrumb';
import CourseFilterPanel from '../../features/courses/components/CourseFilterPanel';
import CourseSearchBar from '../../features/courses/components/CourseSearchBar';
import CourseSortDropdown from '../../features/courses/components/CourseSortDropdown';
import CourseCard from '../../features/courses/components/CourseCard';
import CourseCompareBar from '../../features/courses/components/CourseCompareBar';
import CourseCardSkeleton from '../../features/courses/components/CourseCardSkeleton';
import { useCourseFilters } from '../../features/courses/hooks/useCourseFilters';
import { useCourseSearch } from '../../features/courses/hooks/useCourseSearch';
import { useCoursePagination } from '../../features/courses/hooks/useCoursePagination';
import { useCourseCompare } from '../../features/courses/hooks/useCourseCompare';

export default function CoursesPage() {
  const { 
    filters, 
    filterOptions, 
    openSections,
    handleFilterChange, 
    handleReset, 
    toggleFilter 
  } = useCourseFilters();
  
  const { 
    searchTerm, 
    debouncedSearchTerm, 
    placeholder, 
    handleSearch 
  } = useCourseSearch();
  
  const { 
    courses, 
    loading, 
    currentPage, 
    totalPages,
    goToPage 
  } = useCoursePagination(filters, debouncedSearchTerm);
  
  const { 
    comparedCourses, 
    addToCompare, 
    removeFromCompare,
    isCompared,
    clearAll 
  } = useCourseCompare();

  return (
    <>
      <SeoHead page="courses" />
      <DynamicBreadcrumb />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <CourseFilterPanel
              filters={filters}
              filterOptions={filterOptions}
              openSections={openSections}
              onFilterChange={handleFilterChange}
              onToggle={toggleFilter}
              onReset={handleReset}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="flex gap-4 mb-6">
              <CourseSearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder={placeholder}
              />
              <CourseSortDropdown />
            </div>

            {/* Course Grid */}
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No courses found</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {courses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onApply={handleApply}
                    onCompare={isCompared(course.id) ? removeFromCompare : addToCompare}
                    isCompared={isCompared(course.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && courses.length > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Compare Bar */}
      {comparedCourses.length > 0 && (
        <CourseCompareBar
          courses={comparedCourses}
          onRemove={removeFromCompare}
          onClear={clearAll}
        />
      )}
    </>
  );
}
```

**Result:** 2,766 lines → 100 lines

---

## 🧪 Testing

### Functional Testing

```bash
# Start dev server
npm run dev

# Test each Feature:
1. Navigate to /courses-in-malaysia
2. Verify courses load
3. Test filters (click each filter option)
4. Test search (type "computer")
5. Test sorting
6. Test pagination (go to page 2)
7. Test compare (add 3 courses)
8. Test compare bar (remove courses)
9. Test apply button
10. Test view details link
```

### Performance Testing

```bash
# Production build
npm run build

# Preview
npm run preview

# Open Lighthouse
# Audit the courses page
# Target: Performance > 90
```

---

## 📝 Review Checklist

- [ ] All 12 files created
- [ ] No syntax errors
- [ ] Imports resolve correctly
- [ ] Courses page renders
- [ ] Filters work
- [ ] Search works
- [ ] Pagination works
- [ ] Compare works
- [ ] No console errors
- [ ] Performance improved
- [ ] Code is readable
- [ ] Functions are documented

---

**Next:** [07-UNIVERSITIES-FEATURE.md](./07-UNIVERSITIES-FEATURE.md) — Refactor UniversityDetail.jsx
