// SEO Canonical URL Tester
// Paste this in browser console (F12) to test canonical URL generation

console.log('=== SEO Canonical URL Test ===\n');

// Test 1: Current Page URL
console.log('1. Current Page:');
console.log('   URL:', window.location.href);
console.log('   Pathname:', window.location.pathname);
console.log('   Search:', window.location.search);

// Test 2: Check Canonical Tag
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) {
  console.log('\n2. Canonical Tag Found ✅');
  console.log('   Canonical URL:', canonical.href);
  
  // Check for "undefined" in canonical
  if (canonical.href.includes('undefined')) {
    console.error('   ❌ ERROR: Canonical contains "undefined"!');
    console.log('   This means slug/pathname is not being passed correctly');
  } else {
    console.log('   ✅ Canonical looks good (no "undefined")');
  }
  
  // Check if canonical matches current URL (ignoring hash)
  const currentUrl = window.location.origin + window.location.pathname + window.location.search;
  if (canonical.href === currentUrl) {
    console.log('   ✅ Canonical matches current URL exactly!');
  } else {
    console.warn('   ⚠️ Canonical does NOT match current URL');
    console.log('   Expected:', currentUrl);
    console.log('   Got:', canonical.href);
  }
} else {
  console.error('\n2. ❌ NO Canonical Tag Found!');
  console.log('   SeoHead component might not be added to this page');
}

// Test 3: Check All Meta Tags
console.log('\n3. Meta Tags Count:');
console.log('   <title> tags:', document.querySelectorAll('title').length, '(should be 1)');
console.log('   description tags:', document.querySelectorAll('meta[name="description"]').length, '(should be 1)');
console.log('   canonical tags:', document.querySelectorAll('link[rel="canonical"]').length, '(should be 1)');
console.log('   og:title tags:', document.querySelectorAll('meta[property="og:title"]').length, '(should be 1)');

// Test 4: Title Content
console.log('\n4. Page Title:');
console.log('   Title:', document.title);
if (document.title.includes('undefined')) {
  console.error('   ❌ ERROR: Title contains "undefined"!');
} else {
  console.log('   ✅ Title looks good');
}

// Test 5: React Helmet Detection
const helmetTags = document.querySelectorAll('[data-react-helmet="true"]');
console.log('\n5. React Helmet Tags:', helmetTags.length);
if (helmetTags.length > 0) {
  console.log('   ✅ React Helmet is working');
  console.log('   Helmet-managed tags:');
  helmetTags.forEach(tag => {
    console.log('   -', tag.tagName, tag.getAttribute('name') || tag.getAttribute('property') || tag.getAttribute('rel'));
  });
} else {
  console.warn('   ⚠️ No React Helmet tags detected');
  console.log('   SeoHead component might not be properly integrated');
}

console.log('\n=== Test Complete ===\n');

// Summary
let errors = 0;
let warnings = 0;

if (!canonical) errors++;
if (canonical?.href.includes('undefined')) errors++;
if (document.title.includes('undefined')) errors++;
if (document.querySelectorAll('title').length !== 1) warnings++;
if (document.querySelectorAll('link[rel="canonical"]').length !== 1) errors++;

if (errors === 0 && warnings === 0) {
  console.log('%c✅ ALL TESTS PASSED! SEO is working perfectly!', 'color: green; font-weight: bold; font-size: 16px;');
} else if (errors > 0) {
  console.error(`❌ FAILED with ${errors} error(s) and ${warnings} warning(s)`);
  console.log('Check the errors above and fix SeoHead implementation');
} else {
  console.warn(`⚠️ PASSED with ${warnings} warning(s)`);
}
