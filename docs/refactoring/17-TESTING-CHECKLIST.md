# Testing Checklist

**Document:** 17-TESTING-CHECKLIST.md  
**Purpose:** Comprehensive route-by-route verification  
**Phase:** 6 — Verification  
**Time Required:** 4-6 hours

---

## 🎯 Testing Philosophy

**Goal:** Verify that the refactored application works identically to the original

**Principles:**
1. Test every route manually
2. Verify visual appearance matches
3. Test all interactions
4. Check mobile responsiveness
5. Verify SEO tags
6. Test in multiple browsers

---

## 📋 Route Testing Checklist

### Home Page

**Route:** `/`

- [ ] Page loads without errors
- [ ] Hero section renders
- [ ] University slider works (swipe/arrows)
- [ ] Program selector functional
- [ ] Field of study cards display
- [ ] Country dashboard visible
- [ ] Trending courses section loads
- [ ] University ranking table displays  
- [ ] Counsellor support section shows
- [ ] Testimonials slider works
- [ ] All images load
- [ ] WhatsApp button visible
- [ ] Footer displays
- [ ] Mobile responsive

**Console Errors:** Should be 0  
**Lighthouse Score:** > 90

---

### Universities

#### Universities Main Page

**Route:** `/universities`

- [ ] Page loads
- [ ] University grid displays
- [ ] Filters work (state, type)
- [ ] Search functions
- [ ] Sort dropdown works
- [ ] Pagination functional
- [ ] Click university card → goes to detail
- [ ] Breadcrumb correct
- [ ] SEO tags present

#### Universities List (by Type)

**Routes:**
- `/universities/private-institutions`
- `/universities/public-universities`
- `/universities/online-universities`

For each route:
- [ ] Page loads with correct type filter
- [ ] URL matches type
- [ ] Breadcrumb shows type
- [ ] Filter panel shows
- [ ] Correct universities display

#### University Detail Page

**Route:** `/university/:slug` (e.g., `/university/help-university`)

- [ ] Page loads
- [ ] University name displays
- [ ] Hero image loads
- [ ] Info boxes show (Established, Accredited, etc.)
- [ ] Action buttons work:
  - [ ] Download Brochure modal opens
  - [ ] Fee Structure modal opens
  - [ ] Book Direct modal opens
  - [ ] Write Review navigates
- [ ] Tabs work:
  - [ ] Overview tab
  - [ ] Courses tab
  - [ ] Ranking tab
  - [ ] Gallery tab
  - [ ] Videos tab
  - [ ] Reviews tab
- [ ] Course cards display in Courses tab
- [ ] Gallery images work (modal/lightbox)
- [ ] Mobile responsive (4 buttons stack vertically)

**Test with multiple universities:**
- [ ] `/university/help-university`
- [ ] `/university/taylor-university`
- [ ] `/university/monash-malaysia`

---

### Courses

#### Courses Main Page

**Route:** `/courses-in-malaysia`

- [ ] Page loads
- [ ] Course grid displays
- [ ] Filter panel shows
- [ ] All filters work:
  - [ ] University filter
  - [ ] Specialization filter
  - [ ] Level filter
  - [ ] State filter
  - [ ] Mode filter
  - [ ] Intake filter
- [ ] Search bar functional
- [ ] Sort dropdown works
- [ ] Pagination works
- [ ] Compare feature:
  - [ ] Add course to compare
  - [ ] Compare bar appears
  - [ ] Remove from compare
  - [ ] Compare modal opens
- [ ] Apply Now button works
- [ ] View Details link works
- [ ] URL updates with filters
- [ ] Reset filters button works

#### Filter Routes

**Routes:**
- `/:filterSlug-courses` (e.g., `/business-courses`, `/engineering-courses`)
- `/:filterSlug-courses/:pageSlug`

Test sample routes:
- [ ] `/business-courses`
- [ ] `/engineering-courses`
- [ ] `/computer-science-courses`
- [ ] `/medicine-courses`

For each:
- [ ] Correct filter applied
- [ ] Correct courses display  
- [ ] Breadcrumb shows filter
- [ ] SEO tags correct

---

### Specializations

#### Specializations Page

**Route:** `/specialization`

- [ ] Page loads
- [ ] Category filter shows
- [ ] Specialization cards display
- [ ] Click category → filters specializations
- [ ] Click specialization → goes to detail
- [ ] Search works
- [ ] Icons display correctly

#### Specialization Detail

**Route:** `/specialization/:nameWithLevel` (e.g., `/specialization/business-management-bachelor`)

- [ ] Page loads
- [ ] Specialization name correct
- [ ] Level tabs work:
  - [ ] Bachelor tab
  - [ ] Master tab
  - [ ] PhD tab (if applicable)
- [ ] Content tabs work:
  - [ ] About Course
  - [ ] Duration
  - [ ] Cost
  - [ ] Career
  - [ ] Entry Requirement
- [ ] Related courses display
- [ ] Breadcrumb correct

**Test multiple:**
- [ ] `/specialization/business-management-bachelor`
- [ ] `/specialization/computer-science-master`
- [ ] `/specialization/engineering-bachelor`

---

### Scholarships

**Routes:**
- `/scholarships`
- `/scholarships/:slug`

#### Scholarships Page
- [ ] List of scholarships displays
- [ ] Filters work
- [ ] Search functional
- [ ] Click scholarship → detail page

#### Scholarship Detail
- [ ] Scholarship details show
- [ ] Eligibility requirements display
- [ ] Apply button works
- [ ] Related scholarships show

---

### Resources

#### Exams

**Routes:**
- `/resources/exams`
- `/resources/exams/:slug`

- [ ] Exam list displays
- [ ] Click exam → detail page
- [ ] Exam detail shows information
- [ ] Get in touch form works

#### Services

**Routes:**
- `/resources/services`
- `/resources/services/:slug`
- `/resources/services/visa-guidance`
- `/resources/services/admission-guidance`
- `/resources/services/discover-malaysia`

For each:
- [ ] Page loads
- [ ] Content displays
- [ ] Contact forms work
- [ ] Images load

#### Guidelines

**Routes:**
- `/resources/Guidelines/graduate-pass`
- `/resources/Guidelines/MQA`
- `/resources/Guidelines/team-education-malaysia`

For each:
- [ ] Content loads
- [ ] Images display
- [ ] Links work
- [ ] Tables format correctly (if any)

---

### About

**Routes:**
- `/who-we-are`
- `/students-say` (or `/what-people-say`)
- `/why-study`

For each:
- [ ] Page loads
- [ ] Content displays
- [ ] Images load
- [ ] Sections render correctly
- [ ] Review cards show (students-say)
- [ ] Forms work

---

### Partners

**Route:** `/view-our-partners`

- [ ] Page loads
- [ ] Partner grid displays
- [ ] Country filter works
- [ ] State filter works (after selecting country)
- [ ] City filter works (after selecting state)
- [ ] Search functional
- [ ] Contact Now button opens modal
- [ ] Partner application form:
  - [ ] All fields display
  - [ ] Validation works
  - [ ] Submit functional
- [ ] Contact team section shows

---

### Blog

**Routes:**
- `/blog`
- `/blog/:category_slug`
- `/blog/:category/:slugWithId`

- [ ] Blog listing page loads
- [ ] Category filter works
- [ ] Click category → filters blogs
- [ ] Click blog → detail page
- [ ] Blog detail displays:
  - [ ] Title
  - [ ] Content
  - [ ] Images
  - [ ] Author
  - [ ] Date
  - [ ] Categories
- [ ] Related blogs show

---

### Student Dashboard (Protected Routes)

**Routes:**
- `/student/profile`
- `/student/overview`
- `/student/applied-colleges`
- `/student/Conversation`
- `/student/change-password`

#### Prerequisites
- [ ] User must be logged in

#### Profile
- [ ] Form loads with user data
- [ ] Edit fields works
- [ ] Save changes functional
- [ ] Validation works
- [ ] Photo upload works

#### Overview
- [ ] Dashboard data displays
- [ ] Stats show correctly
- [ ] Recent activity displays

#### Applied Colleges
- [ ] List of applications shows
- [ ] Application status visible
- [ ] Click application → detail

#### Conversation
- [ ] Messages display
- [ ] Reply functional
- [ ] Real-time updates work (if implemented)

#### Change Password
- [ ] Form displays
- [ ] Current password validation
- [ ] New password validation
- [ ] Confirm password validation
- [ ] Submit changes password

---

### Authentication

**Routes:**
- `/login`
- `/signup`
- `/account/password/reset`
- `/password/reset`
- `/confirmed-email`

#### Login
- [ ] Form displays
- [ ] Email validation
- [ ] Password validation
- [ ] Submit logs in user
- [ ] Errors display correctly
- [ ] Redirect to dashboard after login
- [ ] "Forgot password" link works

#### Signup
- [ ] Form displays (possibly modal)
- [ ] All fields validate
- [ ] Phone number validation
- [ ] OTP modal opens
- [ ] OTP verification works
- [ ] Creates user account
- [ ] Redirects to onboarding/dashboard

#### Password Reset
- [ ] Email input shows
- [ ] Submit sends reset email
- [ ] Success message displays

#### Confirmed Email
- [ ] Confirmation message shows
- [ ] Redirect to login/dashboard

---

### Legal

**Routes:**
- `/terms-and-conditions`
- `/privacy-policy`
- `/faqs`
- `/contact-us`

For each:
- [ ] Page loads
- [ ] Content displays
- [ ] Tables format correctly (if any)
- [ ] Accordion works (FAQs)
- [ ] Contact form works (Contact Us)

---

### Qualification Levels

**Routes:**
- `/select-level` (or `/courses`)
- `/course/:slug`
- `/courses/:slug`

- [ ] Level selection page shows
- [ ] Click level → detail page
- [ ] Course cards display
- [ ] Trending courses show
- [ ] Apply button works

---

### Accreditation Bodies

**Route:** `/bodies/:slug`

- [ ] Body information displays
- [ ] Logo shows
- [ ] Description renders
- [ ] Related universities list

---

### Not Found

**Route:** `*` (any non-existent route)

- [ ] 404 page displays
- [ ] Error message clear
- [ ] Back to home button works
- [ ] No console errors
- [ ] Navbar/Footer still show

**Test routes:**
- `/this-does-not-exist`
- `/universities/invalid-type`
- `/university/fake-university`

---

## 🌐 Browser Testing

Test the ENTIRE flow in:

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)

### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 📱 Mobile-Specific Checks

For each major page:
- [ ] Layout not broken
- [ ] Text readable (not too small)
- [ ] Buttons clickable (not too small)
- [ ] No horizontal scroll
- [ ] Images fit screen
- [ ] Modals work on mobile  
- [ ] Forms usable
- [ ] Navigation menu works

---

## 🔍 SEO Verification

For each major page type, check:

```bash
# View page source
Right-click → View Page Source
```

Verify presence of:
- [ ] `<title>` tag (unique per page)
- [ ] Meta description
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Canonical URL
- [ ] Structured data (JSON-LD) if applicable

**Test pages:**
- Home
- Courses
- University detail
- Course detail
- Blog post

---

## ⚡ Performance Verification

### Lighthouse Audit

Run on:
- [ ] Home page
- [ ] Courses page
- [ ] University detail page
- [ ] Blog page

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: 100

### Network Analysis

Check in DevTools → Network:
- [ ] No 404 errors
- [ ] No 500 errors
- [ ] API calls succeed
- [ ] Images load (status 200)
- [ ] Assets gzipped
- [ ] Total page size < 2MB

---

## 🐛 Console Error Check

For EVERY route:
- [ ] 0 console errors
- [ ] 0 console warnings (or only minor warnings)
- [ ] No "Failed to fetch" errors
- [ ] No "Cannot read property of undefined" errors

---

## 📊 Regression Testing

After completing refactoring:

### Functional Regression
- [ ] All filters still work
- [ ] All forms submit
- [ ] All modals open/close
- [ ] All links navigate
- [ ] All images load
- [ ] All animations play

### Visual Regression
- [ ] Layout matches original
- [ ] Colors match
- [ ] Fonts match
- [ ] Spacing matches
- [ ] Responsive behavior same

###Data Regression
- [ ] Same courses display
- [ ] Same universities display
- [ ] Same scholarships display
- [ ] Counts match (total results)

---

## ✅ Final Checklist

Before declaring refactoring complete:

### Code Quality
- [ ] No unused files
- [ ] No unused imports
- [ ] No console.logs in production
- [ ] All components documented
- [ ] No commented-out code blocks

### Build
- [ ] `npm run build` succeeds
- [ ] No build warnings
- [ ] Bundle size acceptable (< 500KB main chunk)
- [ ] Chunks split correctly

### Deployment
- [ ] Deployed to staging
- [ ] Tested on staging
- [ ] All environment variables set
- [ ] API URLs correct

### Documentation
- [ ] README updated
- [ ] Architecture docs updated
- [ ] Change log created
- [ ] Team briefed

---

## 📝 Bug Tracking Template

If issues found during testing:

```markdown
## Bug: [Title]

**Route:** /path/to/page
**Browser:** Chrome 120
**Device:** Desktop

**Steps to Reproduce:**
1. Go to /path
2. Click X
3. See error

**Expected:** Should do Y
**Actual:** Does Z

**Console Error:** [paste error message]
**Screenshot:** [attach if needed]

**Priority:** High/Medium/Low
**Status:** Open/In Progress/Fixed
```

---

**Time Estimate:** 4-6 hours for complete testing  
**Team Size:** 1-2 testers recommended  
**Tools Needed:** Chrome DevTools, multiple browsers, mobile devices

---

**Next:** [18-BUILD-VERIFICATION.md](./18-BUILD-VERIFICATION.md) — Production build final check
