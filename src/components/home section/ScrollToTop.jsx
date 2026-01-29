

// import { useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';

// function ScrollToTop() {
//   const location = useLocation();
//   const prevPathRef = useRef(location.pathname);

//   useEffect(() => {
//     const prevPath = prevPathRef.current;
//     const currentPath = location.pathname;

//     // Update previous path
//     prevPathRef.current = currentPath;

//     // ✅ Check if preventScroll flag is set
//     if (location.state?.preventScroll) {
//       console.log("🚫 Scroll prevented for this navigation");
//       window.history.replaceState({}, document.title);
//       return;
//     }

//     // ✅ CHECK: Specialization pages
//     const isSpecializationPage = currentPath.includes('/specialization/');
//     const wasPreviouslySpecializationPage = prevPath.includes('/specialization/');

//     // ✅ Specialization detail page ke TABS change pe scroll mat karo
//     const isSpecializationTabChange = 
//       currentPath.match(/^\/specialization\/[^/]+-(pre-university|certificates|diploma|under-graduate|post-graduate-diploma|post-graduate|phd)$/) &&
//       wasPreviouslySpecializationPage;

//     // ✅ Agar same specialization ke tabs change ho rahe hain
//     if (isSpecializationTabChange) {
//       const prevBase = prevPath.split('-').slice(0, -1).join('-');
//       const currentBase = currentPath.split('-').slice(0, -1).join('-');

//       // Agar same specialization hai to scroll mat karo
//       if (prevBase === currentBase) {
//         return;
//       }
//     }

//     // ✅ Agar specialization se specialization page pe ja rahe ho, to TOP pe scroll karo
//     if (isSpecializationPage && wasPreviouslySpecializationPage && prevPath !== currentPath) {
//       window.scrollTo({
//         top: 0,
//         left: 0,
//         behavior: 'instant'
//       });
//       return;
//     }

//     // ✅ University detail page (with or without tab) pe scroll mat karo
//     const isUniversityDetailPage = currentPath.match(/^\/university\/[^/]+(\/(overview|courses|gallery|videos|reviews|ranking))?$/);

//     // ✅ Featured University se Programme button click
//     if (location.state?.scrollToCenter) {
//       setTimeout(() => {
//         const scrollAmount = window.innerHeight * 0.25;
//         window.scrollTo({
//           top: scrollAmount,
//           behavior: 'smooth'
//         });
//       }, 100);
//       window.history.replaceState({}, document.title);
//     } 
//     // ✅ University detail page NAHI hai to top pe scroll karo
//     else if (!isUniversityDetailPage) {
//       window.scrollTo({
//         top: 0,
//         left: 0,
//         behavior: 'instant'
//       });
//     }

//   }, [location.pathname, location.state]);

//   return null;
// }

// export default ScrollToTop;
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    // Update previous path
    prevPathRef.current = currentPath;

    // ✅ Check if preventScroll flag is set
    if (location.state?.preventScroll) {
      console.log("🚫 Scroll prevented for this navigation");
      window.history.replaceState({}, document.title);
      return;
    }

    // ✅✅ NEW CODE - YE WALA BLOCK ADD KARO (Line 22-31) ✅✅
    if (location.state?.scrollToTop) {
      console.log("✅ Forcing scroll to top from View Details");
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      window.history.replaceState({}, document.title);
      return;
    }
    // ✅✅ NEW CODE END ✅✅

    // ✅ CHECK: Specialization pages
    const isSpecializationPage = currentPath.includes('/specialization/');
    const wasPreviouslySpecializationPage = prevPath.includes('/specialization/');

    // ✅ Specialization detail page ke TABS change pe scroll mat karo
    const isSpecializationTabChange =
      currentPath.match(/^\/specialization\/[^/]+-(pre-university|certificates|diploma|under-graduate|post-graduate-diploma|post-graduate|phd)$/) &&
      wasPreviouslySpecializationPage;

    // ✅ Agar same specialization ke tabs change ho rahe hain
    if (isSpecializationTabChange) {
      const prevBase = prevPath.split('-').slice(0, -1).join('-');
      const currentBase = currentPath.split('-').slice(0, -1).join('-');

      // Agar same specialization hai to scroll mat karo
      if (prevBase === currentBase) {
        return;
      }
    }

    // ✅ Agar specialization se specialization page pe ja rahe ho, to TOP pe scroll karo
    if (isSpecializationPage && wasPreviouslySpecializationPage && prevPath !== currentPath) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      return;
    }

    // ✅ University detail page detection
    const isUniversityDetailPage = currentPath.match(/^\/university\/[^/]+(\/(overview|courses|gallery|videos|reviews|ranking))?$/);

    // ✅ Check if we are switching tabs within the SAME university
    let isSameUniversityTabChange = false;
    if (isUniversityDetailPage && prevPath.includes('/university/')) {
      const prevSlug = prevPath.split('/')[2];
      const currentSlug = currentPath.split('/')[2];
      if (prevSlug === currentSlug) {
        isSameUniversityTabChange = true;
      }
    }

    // ✅ Featured University se Programme button click
    if (location.state?.scrollToCenter) {
      setTimeout(() => {
        const scrollAmount = window.innerHeight * 0.25;
        window.scrollTo({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }, 100);
      window.history.replaceState({}, document.title);
    }
    // ✅ Scroll to top logic:
    // 1. If NOT a university page -> Scroll Top
    // 2. If IS a university page BUT distinct from previous (different slug or coming from outside) -> Scroll Top
    else if (!isUniversityDetailPage || (isUniversityDetailPage && !isSameUniversityTabChange)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

  }, [location.pathname, location.state]);

  return null;
}

export default ScrollToTop;