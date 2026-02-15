# File Renaming Guide

**Document:** 15-FILE-RENAMING.md  
**Purpose:** Fix file naming typos and standardize naming conventions  
**Phase:** 5 — Cleanup  
**Estimated Time:** 1-2 hours

---

## 🎯 Renaming Goals

1. Fix typos in file names
2. Standardize naming conventions
3. Update all imports
4. Maintain route functionality
5. No breaking changes

---

## 📝 Files to Rename

### 1. Graduate Pages (Typo: "Grdadute" → "Graduate")

#### File 1: Grdadute.jsx → GraduatePage.jsx

**Current:** `src/pages/Grdadute.jsx`  
**New:** `src/pages/resources/GraduatePassPage.jsx`

**Changes:**

```diff
# Rename file
- src/pages/Grdadute.jsx
+ src/pages/resources/GraduatePassPage.jsx
```

**Update App.jsx:**

```diff
// At top of App.jsx
- const Graduate = lazy(() => import("./pages/Grdadute"));
+ const GraduatePage = lazy(() => import("./pages/resources/GraduatePassPage"));

// In routes
- <Route path="/resources/Guidelines/graduate-pass" element={<Graduate />} />
+ <Route path="/resources/Guidelines/graduate-pass" element={<GraduatePassPage />} />
```

**Component rename:**

```diff
// Inside the file
- function Grdadute() {
+ export default function GraduatePassPage() {
  return (
    // ... content
  );
}

- export default Grdadute;
```

**Route:** `/resources/Guidelines/graduate-pass` (unchanged)

---

#### File 2: Graduatedetail.jsx → MQAPage.jsx

**Current:** `src/pages/Graduatedetail.jsx`  
**New:** `src/pages/resources/MQAPage.jsx`

**Changes:**

```diff
# Rename file
- src/pages/Graduatedetail.jsx
+ src/pages/resources/MQAPage.jsx
```

**Update App.jsx:**

```diff
- const Graduatedetail = lazy(() => import("./pages/Graduatedetail"));
+ const MQAPage = lazy(() => import("./pages/resources/MQAPage"));

// In routes
- <Route path="/resources/Guidelines/MQA" element={<Graduatedetail />} />
+ <Route path="/resources/Guidelines/MQA" element={<MQAPage />} />
```

**Component rename:**

```diff
- function Graduatedetail() {
+ export default function MQAPage() {
  return (
    // ... content
  );
}

- export default Graduatedetail;
```

**Route:** `/resources/Guidelines/MQA` (unchanged)

---

### 2. Registration Directory (Typo: "Regstation" → "Registration")

**Current:** `src/pages/Regstation/`  
**New:** `src/pages/student/`

**Reasoning:** 
- Fix typo ("Regstation" → "Registration")
- Use clearer name "student" since routes are `/student/*`

**Changes:**

```bash
# Rename entire directory
mv src/pages/Regstation src/pages/student
```

**Files affected (update imports):**

| Old Path | New Path |
|----------|----------|
| `Regstation/Profile.jsx` | `student/ProfilePage.jsx` |
| `Regstation/Overview.jsx` | `student/OverviewPage.jsx` |
| `Regstation/AppliedCollege.jsx` | `student/AppliedCollegesPage.jsx` |
| `Regstation/Conversation.jsx` | `student/ConversationPage.jsx` |
| `Regstation/ChangePassword.jsx` | `student/ChangePasswordPage.jsx` |
| `Regstation/AdditionalQualifications.jsx` | `student/AdditionalQualificationsPage.jsx` |
| `Regstation/BackgroundInformation.jsx` | `student/BackgroundInformationPage.jsx` |
| `Regstation/DocumentUpload.jsx` | `student/DocumentUploadPage.jsx` |
| `Regstation/EducationSummary.jsx` | `student/EducationSummaryPage.jsx` |
| `Regstation/TestScores.jsx` | `student/TestScoresPage.jsx` |
| `Regstation/SchoolAdd.jsx` | `student/SchoolAddPage.jsx` |
| `Regstation/ModelSignUpForm.jsx` | `student/ModelSignUpForm.jsx` |
| `Regstation/ProfileCard.jsx` | `student/ProfileCard.jsx` |

**Update App.jsx:**

```diff
// Imports
- const Profile = lazy(() => import("./pages/Regstation/Profile"));
- const Overview = lazy(() => import("./pages/Regstation/Overview"));
- const AppliedColleges = lazy(() => import("./pages/Regstation/AppliedCollege"));
- const Conversation = lazy(() => import("./pages/Regstation/Conversation"));
- const ChangePassword = lazy(() => import("./pages/Regstation/ChangePassword"));

+ const ProfilePage = lazy(() => import("./pages/student/ProfilePage"));
+ const OverviewPage = lazy(() => import("./pages/student/OverviewPage"));
+ const AppliedCollegesPage = lazy(() => import("./pages/student/AppliedCollegesPage"));
+ const ConversationPage = lazy(() => import("./pages/student/ConversationPage"));
+ const ChangePasswordPage = lazy(() => import("./pages/student/ChangePasswordPage"));

// Routes (no change to paths)
- <Route path="/student/profile" element={<Profile />} />
- <Route path="/student/overview" element={<Overview />} />
- <Route path="/student/applied-colleges" element={<AppliedColleges />} />
- <Route path="/student/Conversation" element={<Conversation />} />
- <Route path="/student/change-password" element={<ChangePassword />} />

+ <Route path="/student/profile" element={<ProfilePage />} />
+ <Route path="/student/overview" element={<OverviewPage />} />
+ <Route path="/student/applied-colleges" element={<AppliedCollegesPage />} />
 + <Route path="/student/Conversation" element={<ConversationPage />} />
+ <Route path="/student/change-password" element={<ChangePasswordPage />} />
```

---

### 3. GetInTouch Form Variants (Typo fixes)

#### File 1: GetinTouchUiversity.jsx → GetInTouchUniversity.jsx

**Current:** `src/components/GetinTouchUiversity.jsx`  
**New:** `src/components/forms/GetInTouchUniversity.jsx`

**Changes:**

```diff
- src/components/GetinTouchUiversity.jsx
+ src/components/forms/GetInTouchUniversity.jsx
```

**Update imports everywhere:**

```bash
# Find all imports
grep -r "GetinTouchUiversity" src/

# Update each file
```

```diff
- import GetinTouchUiversity from '../components/GetinTouchUiversity';
+ import GetInTouchUniversity from '../components/forms/GetInTouchUniversity';
```

---

#### File 2: GetinTouchinExam.jsx → GetInTouchExam.jsx

**Current:** `src/components/GetinTouchinExam.jsx`  
**New:** `src/components/forms/GetInTouchExam.jsx`

**Changes:**

```diff
- src/components/GetinTouchinExam.jsx
+ src/components/forms/GetInTouchExam.jsx
```

**Update imports:**

```diff
- import GetinTouchinExam from '../components/GetinTouchinExam';
+ import GetInTouchExam from '../components/forms/GetInTouchExam';
```

---

### 4. Other Typos

#### File: universitypopform.jsx → UniversityPopupForm.jsx

**Current:** `src/pages/universitysection/universitypopform.jsx`  
**New:** `src/features/universities/components/UniversityPopupForm.jsx`

**Changes:**

```diff
# Rename and move
- src/pages/universitysection/universitypopform.jsx
+ src/features/universities/components/UniversityPopupForm.jsx
```

**Update component name:**

```diff
- export default function universitypopform() {
+ export default function UniversityPopupForm() {
  // ...
}
```

**Update imports:**

```bash
# Find usages
grep -r "universitypopform" src/

# Update
```

---

## 📋 Complete Renaming Checklist

### Graduate Pages
- [ ] Rename `Grdadute.jsx` → `GraduatePassPage.jsx`
- [ ] Update App.jsx import
- [ ] Update component export name
- [ ] Test route `/resources/Guidelines/graduate-pass`

- [ ] Rename `Graduatedetail.jsx` → `MQAPage.jsx`
- [ ] Update App.jsx import
- [ ] Update component export name
- [ ] Test route `/resources/Guidelines/MQA`

### Student Directory (formerly Regstation)
- [ ] Rename directory `Regstation/` → `student/`
- [ ] Rename `Profile.jsx` → `ProfilePage.jsx`
- [ ] Rename `Overview.jsx` → `OverviewPage.jsx`
- [ ] Rename `AppliedCollege.jsx` → `AppliedCollegesPage.jsx`
- [ ] Rename `Conversation.jsx` → `ConversationPage.jsx`
- [ ] Rename `ChangePassword.jsx` → `ChangePasswordPage.jsx`
- [ ] Update all App.jsx imports
- [ ] Update all component names
- [ ] Test all `/student/*` routes

### GetInTouch Forms
- [ ] Rename `GetinTouchUiversity.jsx` → `GetInTouchUniversity.jsx`
- [ ] Move to `components/forms/`
- [ ] Update all imports
- [ ] Rename `GetinTouchinExam.jsx` → `GetInTouchExam.jsx`
- [ ] Move to `components/forms/`
- [ ] Update all imports

### Other
- [ ] Rename `universitypopform.jsx` → `UniversityPopupForm.jsx`
- [ ] Move to `features/universities/components/`
- [ ] Update imports
- [ ] Update component name

---

## 🔧 Automated Renaming Script

**Optional:** Use this bash script to automate some renaming:

```bash
#!/bin/bash

# Script: rename-files.sh
# Purpose: Rename all typo files

# Graduate pages
mv src/pages/Grdadute.jsx src/pages/resources/GraduatePassPage.jsx
mv src/pages/Graduatedetail.jsx src/pages/resources/MQAPage.jsx

# Student directory
mv src/pages/Regstation src/pages/student

# Within student directory
cd src/pages/student
mv Profile.jsx ProfilePage.jsx
mv Overview.jsx OverviewPage.jsx
mv AppliedCollege.jsx AppliedCollegesPage.jsx
mv Conversation.jsx ConversationPage.jsx
mv ChangePassword.jsx ChangePasswordPage.jsx
cd ../../..

# GetInTouch forms
mkdir -p src/components/forms
mv src/components/GetinTouchUiversity.jsx src/components/forms/GetInTouchUniversity.jsx
mv src/components/GetinTouchinExam.jsx src/components/forms/GetInTouchExam.jsx

# University popup
mv src/pages/universitysection/universitypopform.jsx src/features/universities/components/UniversityPopupForm.jsx

echo "Files renamed successfully!"
echo "Don't forget to update imports in App.jsx and other files!"
```

**Run:**
```bash
chmod +x rename-files.sh
./rename-files.sh
```

---

## 🧪 Testing After Renaming

### Build Test
```bash
npm run dev
# Check for import errors in console
```

### Route Test
Test each renamed file's route:
- [ ] `/resources/Guidelines/graduate-pass` → GraduatePassPage
- [ ] `/resources/Guidelines/MQA` → MQAPage
- [ ] `/student/profile` → ProfilePage
- [ ] `/student/overview` → OverviewPage
- [ ] `/student/applied-colleges` → AppliedCollegesPage
- [ ] `/student/Conversation` → ConversationPage
- [ ] `/student/change-password` → ChangePasswordPage

### Import Test
```bash
# Search for old imports
grep -r "Grdadute" src/
grep -r "Graduatedetail" src/
grep -r "Regstation" src/
grep -r "GetinTouch" src/  # Should only find new names
grep -r "universitypopform" src/

# Should return 0 results for old names
```

---

## 📊 Impact Summary

| Change | Files Affected | Routes Affected | Breaking Changes |
|--------|----------------|-----------------|------------------|
| Graduate → GraduatePage | 2 | 2 | No (routes same) |
| Regstation → student | 13 | 5 | No (routes same) |
| GetInTouch typos | 2 | 0 | No |
| universitypopform | 1 | 0 | No |

**Total:** 18 files renamed, 0 routes changed, 0 breaking changes

---

## ⚠️ Common Issues

### Issue 1: Import Not Found

**Error:**
```
Cannot find module './pages/Grdadute'
```

**Solution:**
```diff
- import Grdadute from './pages/Grdadute';
+ import GraduatePassPage from './pages/resources/GraduatePassPage';
```

### Issue 2: Component Not Defined

**Error:**
```
'Grdadute' is not defined
```

**Solution:**
Update the component usage in JSX

### Issue 3: Case Sensitivity

**On Linux/Mac:**
- File system is case-sensitive
- `GetinTouch` ≠ `GetInTouch`
- Use exact file name

**Solution:**  
Always use proper PascalCase

---

## ✅ Verification Checklist

- [ ] All files renamed successfully
- [ ] No old file names exist
- [ ] All imports updated
- [ ] All component names updated
- [ ] App.jsx has correct imports
- [ ] Build succeeds (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] All routes work
- [ ] No 404 errors in console
- [ ] Git committed changes

---

**Commit Message:**
```
refactor: fix file naming typos and standardize naming

- Renamed Grdadute → GraduatePassPage
- Renamed Graduatedetail → MQAPage
- Renamed Regstation/ → student/
- Fixed GetInTouch component names
- Standardized all page names to PascalCase
- Updated all imports accordingly

Routes unchanged, no breaking changes
```

---

**Time:** 1-2 hours  
**Complexity:** Low  
**Risk:** Low (no route changes)

---

**Next:** [16-FORM-CONSOLIDATION.md](./16-FORM-CONSOLIDATION.md) — Merge GetInTouch form variants
