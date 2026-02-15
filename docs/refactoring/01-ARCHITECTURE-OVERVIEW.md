# Architecture Overview

**Document:** 01-ARCHITECTURE-OVERVIEW.md  
**Purpose:** Define the new production-grade folder structure and architectural principles  
**Status:** Phase 1 — Foundation

---

## 🏗️ Architectural Principles

### 1. Feature-Based Organization
- Group related components, hooks, and services by business domain
- Each feature is self-contained and independently testable
- Features can be developed and deployed independently

### 2. Separation of Concerns
- **Pages** — Thin orchestrators that compose features
- **Features** — Domain logic and feature-specific components
- **Components** — Reusable UI primitives
- **Hooks** — Reusable stateful logic
- **Services** — API calls and data fetching
- **Utils** — Pure utility functions

### 3. Single Responsibility Principle
- Each file has one clear purpose
- Files should be < 200 lines
- No "god components" with mixed concerns

### 4. DRY (Don't Repeat Yourself)
- Extract common patterns into reusable components
- Consolidate duplicate logic into shared hooks
- Centralize API calls in service layer

### 5. Dependency Direction
```
Components → Hooks → Services → API
     ↓
   Utils (can be used anywhere)
```

---

## 📁 Detailed Folder Structure

### `/app` — Application Shell

```
src/app/
├── App.jsx          # Root component with routing
├── routes.jsx       # Route definitions (optional extraction)
└── providers.jsx    # Context providers wrapper (optional)
```

**Purpose:**
- Entry point for the application
- Route configuration
- Global context providers

**Current State:** Already exists as `src/App.jsx`

**Target State:** May extract routes into `routes.jsx` for clarity

---

### `/layouts` — Page Layout Wrappers

```
src/layouts/
├── MainLayout.jsx       # Navbar + Footer + global UI elements
└── StudentLayout.jsx    # Protected layout for /student/* routes
```

**Purpose:**
- Wrap pages with common UI (header, footer, scrolling)
- Reduce duplication across pages
- Apply authentication guards

**Example: MainLayout.jsx**
```jsx
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ScrollToTop from '../components/navigation/ScrollToTop';
import WhatsAppButton from '../components/common/WhatsAppButton';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
```

---

### `/pages` — Thin Page Orchestrators

```
src/pages/
├── home/
│   └── HomePage.jsx
├── universities/
│   ├── UniversitiesPage.jsx
│   ├── UniversitiesListPage.jsx
│   └── UniversityDetailPage.jsx
├── courses/
│   └── CoursesPage.jsx
├── specializations/
│   ├── SpecializationPage.jsx
│   └── SpecializationDetailPage.jsx
├── scholarships/
│   ├── ScholarshipPage.jsx
│   └── ScholarshipDetailPage.jsx
├── resources/
│   ├── ExamPage.jsx
│   ├── ExamDetailPage.jsx
│   ├── ServicesPage.jsx
│   └── ...
├── about/
│   ├── WhoWeArePage.jsx
│   ├── WhatStudentsSayPage.jsx
│   └── ...
├── partners/
│   └── PartnersPage.jsx
├── blog/
│   ├── BlogPage.jsx
│   └── BlogDetailPage.jsx
├── student/           # ← Renamed from "Regstation"
│   ├── ProfilePage.jsx
│   ├── OverviewPage.jsx
│   └── ...
├── auth/
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   └── ...
├── legal/
│   ├── TermsPage.jsx
│   └── ...
└── NotFoundPage.jsx
```

**Purpose:**
- One page per route
- Pages only compose feature components
- Handle route params and pass to features
- No business logic in pages

**Page Responsibility:**
- Extract route params (`useParams`)
- Compose feature components
- Pass data down as props
- Handle layout structure

**Example: CoursesPage.jsx**
```jsx
import SeoHead from '../../components/seo/SeoHead';
import DynamicBreadcrumb from '../../components/seo/DynamicBreadcrumb';
import CourseFilterPanel from '../../features/courses/components/CourseFilterPanel';
import CourseGrid from '../../features/courses/components/CourseGrid';
import { useCourseFilters } from '../../features/courses/hooks/useCourseFilters';

export default function CoursesPage() {
  const { filters, handleFilterChange } = useCourseFilters();
  
  return (
    <>
      <SeoHead page="courses" />
      <DynamicBreadcrumb />
      <div className="courses-layout">
        <CourseFilterPanel filters={filters} onChange={handleFilterChange} />
        <CourseGrid filters={filters} />
      </div>
    </>
  );
}
```

**Size Target:** 50-100 lines max

---

### `/features` — Feature Modules

```
src/features/
├── courses/
│   ├── components/
│   │   ├── CourseCard.jsx
│   │   ├── CourseFilterPanel.jsx
│   │   ├── CourseSearchBar.jsx
│   │   ├── CourseSortDropdown.jsx
│   │   ├── CourseCompareBar.jsx
│   │   ├── CourseGrid.jsx
│   │   └── skeletons/
│   │       ├── CourseCardSkeleton.jsx
│   │       └── CourseFilterSkeleton.jsx
│   ├── hooks/
│   │   ├── useCourseFilters.js
│   │   ├── useCourseSearch.js
│   │   ├── useCoursePagination.js
│   │   └── useCourseCompare.js
│   └── services/
│       └── courseApi.js
│
├── universities/
│   ├── components/
│   ├── hooks/
│   └── services/
│
├── partners/
│   ├── components/
│   ├── hooks/
│   └── services/
│
├── specializations/
│   ├── components/
│   ├── hooks/
│   └── services/
│
└── auth/
    ├── components/
    ├── hooks/
    └── services/
```

**Purpose:**
- Encapsulate all logic for a specific business domain
- Self-contained, independently testable
- Can be published as separate package if needed

**Feature Module Contents:**
1. **components/** — UI components specific to this feature
2. **hooks/** — Custom hooks for this feature's logic
3. **services/** — API calls for this feature
4. **(optional) types/** — TypeScript types
5. **(optional) utils/** — Feature-specific utilities

**Example Structure:**
```
features/courses/
  components/
    CourseCard.jsx          ← Presentational component
    CourseFilterPanel.jsx   ← Complex UI component
    CourseGrid.jsx         ← Container component
  hooks/
    useCourseFilters.js    ← Stateful filter logic
    useCourseData.js       ← Data fetching logic
  services/
    courseApi.js           ← API functions
```

---

### `/components` — Shared Components

```
src/components/
├── ui/                      # Atomic UI primitives
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Modal.jsx
│   ├── Skeleton.jsx
│   ├── Badge.jsx
│   ├── Card.jsx
│   ├── Pagination.jsx
│   └── Spinner.jsx
│
├── forms/                   # Reusable form components
│   ├── GetInTouchForm.jsx   # Consolidated form
│   ├── ContactFormPopup.jsx
│   ├── ApplicationModal.jsx
│   └── PopupForm.jsx
│
├── seo/                     # SEO components
│   ├── SeoHead.jsx
│   └── DynamicBreadcrumb.jsx
│
├── navigation/              # Navigation components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ScrollToTop.jsx
│   └── ScrollToTopButton.jsx
│
└── common/                  # Shared display components
    ├── FeaturedUniversities.jsx
    ├── TrendingCourses.jsx
    ├── WhatsAppButton.jsx
    ├── LoadingFallback.jsx
    └── ExpandableCard.jsx
```

**Purpose:**
- Reusable across multiple features
- No feature-specific logic
- Generic and configurable

**Component Categories:**

1. **ui/** — Atomic design system primitives
   - Buttons, inputs, modals, skeletons
   - Styled with Tailwind
   - Highly reusable

2. **forms/** — Form patterns
   - Generic form components
   - Shared across features
   - Validation logic abstracted

3. **seo/** — SEO and meta tags
   - `SeoHead` for dynamic meta tags
   - `DynamicBreadcrumb` for navigation

4. **navigation/** — Site-wide navigation
   - Navbar, Footer
   - Scroll behavior components

5. **common/** — Shared display components
   - Components used across multiple pages
   - Not feature-specific

---

### `/hooks` — Shared Custom Hooks

```
src/hooks/
├── useDebounce.js               # Debounce input values
├── usePagination.js             # Pagination logic
├── useIntersectionObserver.js   # Lazy loading trigger
├── useMediaQuery.js             # Responsive breakpoints
└── useScrollLock.js             # Disable body scroll
```

**Purpose:**
- Reusable stateful logic
- Not tied to any specific feature
- Cross-cutting concerns

**Examples:**

```jsx
// useDebounce.js
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

```jsx
// useIntersectionObserver.js
export function useIntersectionObserver(options = {}) {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);
  
  return [setRef, isVisible];
}
```

---

### `/services` — API Layer

```
src/services/
├── api.js           # Axios instance + interceptors
├── endpoints.js     # API URL constants
└── seoService.js    # SEO-specific API calls
```

**Purpose:**
- Centralized API configuration
- Shared Axios instance
- Request/response interceptors

**api.js Example:**
```jsx
import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor (auth token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor (error handling)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**endpoints.js Example:**
```jsx
export const ENDPOINTS = {
  COURSES: '/courses',
  UNIVERSITIES: '/universities',
  SCHOLARSHIPS: '/scholarships',
  // ...
};
```

---

### `/utils` — Pure Utilities

```
src/utils/
├── formatters.js     # Date, number, URL formatting
├── validators.js     # Form validation
├── htmlHelpers.js    # HTML parsing/sanitizing
└── slugHelpers.js    # URL slug generation
```

**Purpose:**
- Pure functions (no side effects)
- No dependencies on React or app state
- Easily testable

**Examples:**

```jsx
// formatters.js
export function formatCurrency(amount, currency = 'MYR') {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date, format = 'short') {
  return new Intl.DateTimeFormat('en-MY', {
    dateStyle: format,
  }).format(new Date(date));
}
```

```jsx
// validators.js
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
}
```

---

### `/constants` — App Constants

```
src/constants/
├── routes.js         # Route path constants
├── filterOptions.js  # Static filter/sort options
└── config.js         # Environment config
```

**Purpose:**
- Centralize magic strings
- Type-safe route references
- Environment-specific config

**routes.js Example:**
```jsx
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses-in-malaysia',
  UNIVERSITIES: '/universities',
  UNIVERSITY_DETAIL: (slug) => `/university/${slug}`,
  LOGIN: '/login',
  // ...
};
```

**config.js Example:**
```jsx
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.educationmalaysia.in/api';
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;
```

---

### `/context` — React Context

```
src/context/
├── AuthContext.jsx   # Authentication state
└── AppContext.jsx    # Global app state
```

**Purpose:**
- Global state management
- Avoid prop drilling
- Share state across app

**Example: AuthContext.jsx**
```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load user from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data
    }
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    // API call
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## 🔄 Data Flow

### Request Flow

```
User Action
    ↓
Page Component (extract params, compose features)
    ↓
Feature Component (UI + local state)
    ↓
Custom Hook (business logic)
    ↓
Service Function (API call)
    ↓
Axios Instance (HTTP request)
    ↓
Backend API
```

### Response Flow

```
Backend API
    ↓
Axios Interceptor (error handling)
    ↓
Service Function (transform data)
    ↓
Custom Hook (update state)
    ↓
Feature Component (render UI)
    ↓
Page Component (layout)
    ↓
User sees result
```

---

## 📐 Component Hierarchy

```
App.jsx
  ├── MainLayout
  │     ├── Navbar
  │     ├── Page (thin orchestrator)
  │     │     ├── SEO components
  │     │     ├── Feature components
  │     │     │     └── UI components
  │     │     └── Common components
  │     ├── Footer
  │     └── WhatsAppButton
  └── Context Providers
```

---

## 🎯 Design Decisions

### Why Feature-Based?
- **Scalability:** Easy to add new domains
- **Team collaboration:** Teams can own features
- **Code splitting:** Features can be lazy-loaded
- **Testing:** Each feature is independently testable

### Why Thin Pages?
- **Simplicity:** Pages are easy to understand
- **Reusability:** Features can be used in multiple pages
- **Maintenance:** Business logic changes don't affect pages
- **Testing:** Test features independently, not pages

### Why Service Layer?
- **Centralization:** All API calls in one place
- **Consistency:** Request/response handling is uniform
- **Mocking:** Easy to mock for testing
- **Caching:** Can add caching layer easily

### Why Custom Hooks?
- **Reusability:** Logic shared across components
- **Testability:** Test hooks independently
- **Separation:** Keep components presentational
- **Composability:** Combine multiple hooks

---

## ✅ Benefits of New Architecture

1. **Developer Experience**
   - Easy to find code
   - Clear ownership
   - Less cognitive load

2. **Maintainability**
   - Small files, single responsibility
   - Easy to refactor
   - Less merge conflicts

3. **Performance**
   - Code splitting by feature
   - Lazy loading
   - Tree-shaking friendly

4. **Testing**
   - Unit test pure functions
   - Integration test features
   - E2E test pages

5. **Scalability**
   - Easy to add features
   - Team can work in parallel
   - Extract features to packages

---

**Next:** [02-MIGRATION-STRATEGY.md](./02-MIGRATION-STRATEGY.md) — Learn the step-by-step migration approach
