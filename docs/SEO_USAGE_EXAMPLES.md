# SEO System - Usage Examples

## Quick Start

### 1. Import Components

```javascript
import SeoHead from '../components/SeoHead';
import DynamicBreadcrumb from '../components/DynamicBreadcrumb';
```

### 2. Basic Usage (Auto-Detection)

The simplest way - just add `SeoHead` and it auto-detects everything:

```javascript
function UniversitiesPage() {
  return (
    <>
      <SeoHead />
      <DynamicBreadcrumb />
      
      {/* Your page content */}
    </>
  );
}
```

**What happens:**
- ✅ URL is parsed automatically
- ✅ Page type is detected from URL pattern
- ✅ Title & description are generated
- ✅ Canonical URL is created
- ✅ Breadcrumbs are built from URL
- ✅ Pagination is handled (if `?page=X` exists)

---

## Advanced Usage Examples

### Example 1: University Detail Page

```javascript
function UniversityDetail() {
  const { slug } = useParams();
  const [university, setUniversity] = useState(null);
  
  useEffect(() => {
    // Fetch university data
    fetchUniversity(slug).then(setUniversity);
  }, [slug]);
  
  return (
    <>
      <SeoHead 
        pageType="university-detail"
        data={{
          name: university?.name,
          slug: slug,
          description: university?.description,
          image: university?.logo_url,
        }}
      />
      
      <DynamicBreadcrumb 
        pageType="university-detail"
        data={{ name: university?.name }}
      />
      
      {/* University content */}
    </>
  );
}
```

**Result:**
- Title: `{University Name} | Courses, Fees & Admission 2026 | Education Malaysia`
- Description: Customized with university info
- Canonical: `https://www.educationmalaysia.in/university/{slug}`
- Breadcrumb: `Home > Universities > {University Name}`

---

### Example 2: Courses Listing with Category

```javascript
function CoursesListing() {
  const { category } = useParams();
  const [courses, setCourses] = useState([]);
  
  return (
    <>
      <SeoHead 
        data={{
          category: category,
        }}
      />
      
      <DynamicBreadcrumb 
        data={{ category }}
      />
      
      {/* Courses grid */}
    </>
  );
}
```

**URL:** `/courses/engineering`

**Result:**
- Title: `Engineering Courses in Malaysia | Education Malaysia`
- Breadcrumb: `Home > Courses > Engineering`

**URL:** `/courses/engineering?page=3`

**Result:**
- Title: `Engineering Courses in Malaysia – Page 3 | Education Malaysia`
- Breadcrumb: `Home > Courses > Engineering > Page 3`
- Canonical: `https://www.educationmalaysia.in/courses/engineering?page=3`
- Includes `rel="prev"` and `rel="next"` links

---

### Example 3: Blog Detail Page

```javascript
function BlogDetail() {
  const { slug, id } = useParams();
  const [blog, setBlog] = useState(null);
  
  return (
    <>
      <SeoHead 
        data={{
          name: blog?.headline,
          category: blog?.get_category?.category_slug,
          description: blog?.meta_description,
          image: blog?.og_image_url,
          keywords: blog?.meta_keywords,
        }}
      />
      
      <DynamicBreadcrumb 
        data={{
          name: blog?.headline,
          category: blog?.get_category?.category_slug,
        }}
      />
      
      {/* Blog content */}
    </>
  );
}
```

**Result:**
- Title: Exact blog headline
- Description: Custom meta description
- OG Image: Blog's featured image
- Breadcrumb: `Home > Blog > {Category} > {Blog Title}`

---

### Example 4: Manual Overrides

If you need to override auto-generated values:

```javascript
function CustomPage() {
  return (
    <>
      <SeoHead 
        overrides={{
          title: "Custom Title Here | Education Malaysia",
          description: "Custom description that overrides auto-generation",
          canonical: "https://www.educationmalaysia.in/custom-url"
        }}
      />
      
      {/* Page content */}
    </>
  );
}
```

---

### Example 5: Noindex for Private Pages

```javascript
function StudentDashboard() {
  return (
    <>
      <SeoHead 
        noindex={true}
        overrides={{
          title: "Student Dashboard",
        }}
      />
      
      {/* Dashboard content */}
    </>
  );
}
```

**Result:**
- Adds `<meta name="robots" content="noindex, nofollow" />`

---

## Pagination Handling

The system **automatically** handles pagination from URL params:

### URL: `/universities`
- Title: `Top Universities in Malaysia | Complete List 2026`
- Canonical: `https://www.educationmalaysia.in/universities`

### URL: `/universities?page=2`
- Title: `Top Universities in Malaysia – Page 2`
- Description: Adds `(Page 2)` at the end
- Canonical: `https://www.educationmalaysia.in/universities?page=2`
- Includes `<link rel="prev" href="/universities" />`
- Includes `<link rel="next" href="/universities?page=3" />`

### URL: `/universities?page=3`
- Includes `<link rel="prev" href="/universities?page=2" />`
- Includes `<link rel="next" href="/universities?page=4" />`

---

## Custom Structured Data

You can add custom structured data (JSON-LD):

```javascript
function UniversityDetail({ university }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": university.name,
    "url": `https://www.educationmalaysia.in/university/${university.slug}`,
    "logo": university.logo_url,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MY"
    }
  };
  
  return (
    <>
      <SeoHead 
        data={{
          name: university.name,
          structuredData: structuredData
        }}
      />
      
      {/* Content */}
    </>
  );
}
```

---

## Component Props Reference

### SeoHead Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `pageType` | string | No | Override auto-detected page type |
| `data` | object | No | Page-specific data (name, category, description, etc.) |
| `data.name` | string | No | Page/item name (for titles) |
| `data.category` | string | No | Category slug |
| `data.slug` | string | No | URL slug |
| `data.description` | string | No | Custom description |
| `data.keywords` | string | No | Meta keywords |
| `data.image` | string | No | Open Graph image URL |
| `data.structuredData` | object | No | Custom JSON-LD structured data |
| `image` | string | No | Custom OG image (shorthand) |
| `noindex` | boolean | No | Prevent search engine indexing |
| `overrides` | object | No | Manual overrides for title/description/canonical |

### DynamicBreadcrumb Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `pageType` | string | No | Override auto-detected page type |
| `data` | object | No | Page-specific data (name, category) |
| `className` | string | No | Additional CSS classes |

---

## Migration Guide

### Before (Static Helmet)

```javascript
function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Blog | Education Malaysia</title>
        <meta name="description" content="Read our blog" />
        <link rel="canonical" href="https://www.educationmalaysia.in/blog" />
      </Helmet>
      
      {/* Content */}
    </>
  );
}
```

### After (Dynamic SeoHead)

```javascript
function BlogPage() {
  return (
    <>
      <SeoHead />
      <DynamicBreadcrumb />
      
      {/* Content */}
    </>
  );
}
```

**Benefits:**
- ✅ Handles pagination automatically
- ✅ Generates unique titles for each page
- ✅ Creates proper canonical URLs
- ✅ Adds Open Graph tags
- ✅ Includes Twitter Cards
- ✅ Adds structured data
- ✅ Updates breadcrumbs dynamically

---

## Testing Checklist

- [ ] Test listing page without category
- [ ] Test listing page with category
- [ ] Test detail pages
- [ ] Test pagination (page 1, 2, 3)
- [ ] Verify canonical URLs in page source
- [ ] Check breadcrumbs update correctly
- [ ] Validate Open Graph tags (Facebook Debugger)
- [ ] Validate Twitter Card tags (Twitter Card Validator)
- [ ] Test with Google Rich Results Test
- [ ] Submit to Google Search Console

---

## SEO Validation Tools

Use these tools to validate your implementation:

1. **Google Rich Results Test**
   https://search.google.com/test/rich-results

2. **Facebook Sharing Debugger**
   https://developers.facebook.com/tools/debug/

3. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator

4. **Google Search Console**
   https://search.google.com/search-console
