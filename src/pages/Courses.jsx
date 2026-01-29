


import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Home, Layers } from "lucide-react";
import api from "../api"; // Adjust the import based on your project structure
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Helmet } from "react-helmet";
import { Filter, X } from "lucide-react";


import {
  MapPin,

  Building,
  Star,
  BookOpen,
  Globe,
  Search,
  ArrowUpDown,
  List,
  LayoutGrid,
  ChevronUp,
  ChevronDown,

  Heart,

  ArrowRight,
  Clock,
  Calendar,
  DollarSign,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import PopupForm from "./universitysection/PopupForm";

const CourseCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4 sm:p-6 animate-pulse">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-3"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
          <div className="h-4 bg-gray-200 rounded-md w-16"></div>
          <div className="h-4 bg-gray-200 rounded-md w-24"></div>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-100 mt-4 pt-4">
      <div className="h-5 bg-gray-200 rounded-md w-2/3 mb-4"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
      </div>
    </div>
  </div>
);

const FilterPanelSkeleton = () => (
  <div className="hidden lg:block w-[280px] min-w-[280px] flex-shrink-0 bg-white border border-gray-200 p-5 rounded-xl shadow-md space-y-6 text-base animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
        <div className="mt-3 pl-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);


const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  const [sortBy, setSortBy] = useState('relevance');

  const infoText = `Find a list of Courses in Malaysia to study at top private & Public universities in Malaysia. Learn about the course duration, intake, tuition fee, and discover information about leading private universities offering diploma, bachelor degree, master programs, and phd courses. Apply directly for your desired courses today.`;

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [comparisonCourses, setComparisonCourses] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  // ✅ Apply popup state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedCourseForApply, setSelectedCourseForApply] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [seo, setSeo] = useState({});
  const [totalCourses, setTotalCourses] = useState(0);
  const [dynamicDescription, setDynamicDescription] = useState("");
  console.log("🔥 Inside Component - dynamicDescription:", dynamicDescription);


  // Add selected filters state
  const [selectedFilters, setSelectedFilters] = useState({
    levels: [],        // ✅ Array
    categories: [],
    specializations: [],
    intakes: [],
    study_modes: [],
  });

  // ✅ YE NAYA STATE ADD KARO (selectedFilters ke NEECHE)
  const [lastSelectedFilter, setLastSelectedFilter] = useState({
    key: "", // filter type (levels, categories, etc.)
    value: "" // filter value
  });
  // Active filter count
  const activeFilterCount = Object.values(selectedFilters)
    .filter(arr => Array.isArray(arr) && arr.length > 0)
    .reduce((total, arr) => total + arr.length, 0);

  const [filters, setFilters] = useState({
    levels: [],      // ✅ Objects store honge {value, label}
    categories: [],
    specializations: [],
    study_modes: [],
    intakes: [],
  });
  const [openFilters, setOpenFilters] = useState(
    Object.keys(filters).reduce((acc, key) => {
      acc[key] = true; // Initially all filters are open
      return acc;
    }, {})
  );;

  const [coursesData, setCoursesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [appliedCourses, setAppliedCourses] = useState(new Set());


  // ✅ Dynamic placeholder generate karne ke liye
  const getSearchPlaceholder = () => {
    const activeFilters = [];

    // ✅ Array check karo
    if (selectedFilters.levels?.length > 0) {
      activeFilters.push(...selectedFilters.levels.map(l => l.replace(/-/g, ' ').toUpperCase()));
    }
    if (selectedFilters.categories?.length > 0) {
      activeFilters.push(...selectedFilters.categories.map(c => c.replace(/-/g, ' ').toUpperCase()));
    }
    if (selectedFilters.specializations?.length > 0) {
      activeFilters.push(...selectedFilters.specializations.map(s => s.replace(/-/g, ' ').toUpperCase()));
    }

    if (activeFilters.length > 0) {
      return `Search in ${activeFilters.join(', ')} courses...`;
    }

    return "Search courses...";
  };
  const fetchFilterOptions = async (filtersToApply = {}) => {
    try {
      const keyMapping = {
        levels: 'level',
        categories: 'category',
        specializations: 'specialization',
        study_modes: 'study_mode',
        intakes: 'intake'
      };

      const queryParams = new URLSearchParams();
      for (const [key, val] of Object.entries(filtersToApply)) {
        if (val) {
          const paramKey = keyMapping[key];
          if (paramKey) {
            const slugValue = String(val).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            queryParams.set(paramKey, slugValue);
          }
        }
      }

      const endpoint = `/courses-in-malaysia?${queryParams.toString()}`;
      const res = await api.get(endpoint);
      const fetchedFilters = res.data.filters || {};

      // ✅✅✅ NORMALIZE KARO - STEP 1 WALA FIX ✅✅✅
      const transformedFilters = {
        levels: fetchedFilters.levels?.map(item => ({
          value: String(item.level || item.slug || item.name).toLowerCase().trim().replace(/\s+/g, '-'),
          label: item.name || item.level || item.slug,
          id: item.id
        })) || [],

        categories: fetchedFilters.categories?.map(item => ({
          value: String(item.slug || item.name).toLowerCase().trim().replace(/\s+/g, '-'),
          label: item.name || item.slug,
          id: item.id
        })) || [],

        specializations: fetchedFilters.specializations?.map(item => ({
          value: String(item.slug || item.name || item.specialization_name).toLowerCase().trim().replace(/\s+/g, '-'),
          label: item.name || item.specialization_name || item.slug,
          id: item.id
        })) || [],

        study_modes: fetchedFilters.study_modes?.map(item => ({
          value: String(item.study_mode || item.slug || item.name).toLowerCase().trim().replace(/\s+/g, '-'),
          label: item.study_mode || item.name || item.slug,
          id: item.id
        })) || [],

        intakes: fetchedFilters.intakes?.map(item => ({
          value: String(item.month || item.slug || item.name).toLowerCase().trim().replace(/\s+/g, '-'),
          label: item.month || item.name || item.slug,
          id: item.id
        })) || [],
      };

      console.log("🔥 Transformed Filters:", transformedFilters);
      setFilters(transformedFilters);

      if (Object.keys(openFilters).length === 0 && Object.keys(transformedFilters).length > 0) {
        setOpenFilters(
          Object.keys(transformedFilters).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {})
        );
      }
    } catch (e) {
      console.error("Error fetching filters:", e);
    }
  };
  const fetchDynamicDescription = async (filterType, filterId) => {
    if (!filterId) {
      setDynamicDescription("");
      return;
    }

    try {
      let endpoint = '';

      if (filterType === 'levels') {
        endpoint = `/courses-in-malaysia/level-content/${filterId}`;
      } else if (filterType === 'categories') {
        endpoint = `/courses-in-malaysia/category-content/${filterId}`;
      } else if (filterType === 'specializations') { //
        endpoint = `/courses-in-malaysia/specialization-content/${filterId}`;
      }

      if (endpoint) {
        console.log("🔍 Fetching description from:", endpoint);
        const res = await api.get(endpoint);

        console.log("📦 Full API Response:", res);
        console.log("📦 Response Data:", res.data);

        // ✅✅✅ FIX: coursesDescription CHECK KARO ✅✅✅
        const description = res?.data?.coursesDescription; // Sirf ye check karo

        if (description) {
          console.log("✅ Description found:", description);
          setDynamicDescription(description);
        } else {
          console.error("❌ coursesDescription NOT found in response!");
          console.log("📋 Available keys:", Object.keys(res?.data || {}));
          setDynamicDescription("");
        }

        console.log("📝 Extracted Description:", description);

        if (description) {
          setDynamicDescription(description);
          console.log("✅ Description SET successfully!");
        } else {
          console.warn("⚠️ No description found in response");
          console.log("🔍 Available keys in response:", Object.keys(res?.data || {}));
          setDynamicDescription("");
        }
      }
    } catch (error) {
      console.error("❌ Error fetching description:", error);
      console.error("❌ Error details:", error.response?.data);
      setDynamicDescription("");
    }
  };
  const fetchCourses = async (page = 1, filtersToApply = {}, searchTerm = "") => {
    setLoading(true);
    try {
      const keyMapping = {
        levels: 'level',
        categories: 'category',
        specializations: 'specialization',
        study_modes: 'study_mode',
        intakes: 'intake'
      };

      const queryParams = new URLSearchParams({ page });

      if (searchTerm) {
        queryParams.set("search", searchTerm);
      }

      // ✅✅✅ YAHAN FIX HAI ✅✅✅
      for (const [key, values] of Object.entries(filtersToApply)) {
        if (Array.isArray(values) && values.length > 0) {
          const paramKey = keyMapping[key];
          if (paramKey) {
            values.forEach(val => {
              // ✅ LOWERCASE + DASHES format mein bhejo
              const cleanValue = String(val).toLowerCase().replace(/\s+/g, '-');
              queryParams.append(paramKey, cleanValue);
            });
          }
        }
      }

      const endpoint = `/courses-in-malaysia?${queryParams.toString()}`;
      console.log("🔍 API Request URL:", endpoint);

      const res = await api.get(endpoint);
      const rows = res?.data?.rows;

      setCoursesData(rows?.data || []);
      setTotalCourses(rows?.total || 0);
      setPaginationLinks(rows?.links || []);
      setCurrentPage(rows?.current_page || 1);
      setLastPage(rows?.last_page || 1);
      setSeo(res.data.seo || {});

    } catch (e) {
      console.error("Error fetching courses:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/student/applied-college", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          const appliedList = res.data.applied_programs || [];
          const appliedIds = new Set(appliedList.map(item => item.prog_id));
          setAppliedCourses(appliedIds);
        })
        .catch((err) => {
          console.error("Error fetching applied programs:", err);
        });
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const path = location.pathname;

    const keyMapping = {
      level: 'levels',
      category: 'categories',
      specialization: 'specializations',
      study_mode: 'study_modes',
      intake: 'intakes'
    };

    // ✅ ARRAYS initialize karo
    const filtersFromURL = {
      levels: [],
      categories: [],
      specializations: [],
      intakes: [],
      study_modes: [],
    };

    // ✅ PATH se filter nikalo - DYNAMICALLY
    if (path.includes('-courses')) {
      const pathFilter = path
        .replace('/', '')
        .replace('-courses', '')
        .toLowerCase()
        .replace(/\s+/g, '-');

      // ✅ DYNAMIC DETECTION: Check against actual filter data
      let filterTypeDetected = null;

      // ✅ If filters are loaded, use them for detection
      const hasFiltersLoaded = Object.values(filters).some(arr => arr.length > 0);

      if (hasFiltersLoaded) {
        // Check in each filter type
        if (filters.levels?.some(item => item.value === pathFilter)) {
          filtersFromURL.levels = [pathFilter];
          filterTypeDetected = 'levels';
        } else if (filters.categories?.some(item => item.value === pathFilter)) {
          filtersFromURL.categories = [pathFilter];
          filterTypeDetected = 'categories';
        } else if (filters.specializations?.some(item => item.value === pathFilter)) {
          filtersFromURL.specializations = [pathFilter];
          filterTypeDetected = 'specializations';
        } else if (filters.intakes?.some(item => item.value === pathFilter)) {
          filtersFromURL.intakes = [pathFilter];
          filterTypeDetected = 'intakes';
        } else if (filters.study_modes?.some(item => item.value === pathFilter)) {
          filtersFromURL.study_modes = [pathFilter];
          filterTypeDetected = 'study_modes';
        }
      } else {
        // ✅ FALLBACK: Use common hardcoded filters for initial load
        const commonLevels = ['pre-university', 'diploma', 'under-graduate', 'post-graduate', 'post-graduate-diploma', 'phd'];
        const commonCategories = ['a-levels', 'certificate', 'business-and-management', 'creative-arts-and-design', 'education-and-training'];
        const commonIntakes = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const commonStudyModes = ['full-time', 'part-time', 'online', 'by-course-work'];

        if (commonLevels.includes(pathFilter)) {
          filtersFromURL.levels = [pathFilter];
          filterTypeDetected = 'levels';
        } else if (commonCategories.includes(pathFilter)) {
          filtersFromURL.categories = [pathFilter];
          filterTypeDetected = 'categories';
        } else if (commonIntakes.includes(pathFilter)) {
          filtersFromURL.intakes = [pathFilter];
          filterTypeDetected = 'intakes';
        } else if (commonStudyModes.includes(pathFilter)) {
          filtersFromURL.study_modes = [pathFilter];
          filterTypeDetected = 'study_modes';
        } else {
          // ✅ Assume it's a specialization if not found in common filters
          filtersFromURL.specializations = [pathFilter];
          filterTypeDetected = 'specializations';
        }
      }

      console.log("🔍 Path filter detected:", pathFilter, "Type:", filterTypeDetected);
    }

    // ✅ Query params se baki filters nikalo
    const pathFilterType = Object.keys(filtersFromURL).find(key => filtersFromURL[key].length > 0);

    params.forEach((value, key) => {
      const stateKey = keyMapping[key];

      if (stateKey && stateKey !== pathFilterType) {
        const cleanValue = value.toLowerCase().trim().replace(/\s+/g, "-"); // ✅ Consistent format

        if (!filtersFromURL[stateKey].includes(cleanValue)) {
          filtersFromURL[stateKey].push(cleanValue);
        }
      }
    });

    console.log("🔥 Filters from URL:", filtersFromURL);

    // ✅ Only update if filters actually changed (prevent infinite loop)
    const filtersChanged = JSON.stringify(selectedFilters) !== JSON.stringify(filtersFromURL);

    if (filtersChanged) {
      console.log("📝 Updating selectedFilters from URL");
      setSelectedFilters(filtersFromURL);
    } else {
      console.log("⏭️ Skipping update - filters unchanged");
    }

    // ✅ Last filter set karo
    const activeFilters = Object.entries(filtersFromURL).filter(([_, vals]) => vals.length > 0);
    if (activeFilters.length > 0) {
      const [lastKey, lastValues] = activeFilters[activeFilters.length - 1];
      setLastSelectedFilter({ key: lastKey, value: lastValues[lastValues.length - 1] });
      console.log("✅ Last filter set:", lastKey, "->", lastValues[lastValues.length - 1]);
    }
  }, [location.search, location.pathname]); // ✅ Removed 'filters' dependency

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    setSearch(searchQuery || "");
  }, [location.search]);

  // ✅ URL se sirf page number load karo, filters mat override karo
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Sirf page number update karo
    const pageFromURL = params.get('page');
    if (pageFromURL) {
      setCurrentPage(parseInt(pageFromURL));
    }
  }, [location.search]);



  // ✅ Auto-apply after sign-up redirect
  // ✅ Auto-apply after sign-up redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const programId = params.get('program_id');
    const redirect = params.get('redirect');
    const token = localStorage.getItem("token");

    if (programId && redirect === 'courses' && token) {
      console.log("🔥 Auto-applying for program:", programId);

      api.get(`/student/apply-program/${programId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Program applied successfully!");

          // ✅ YAHAN FIX HAI - parseInt() use karo
          setAppliedCourses(prev => new Set([...prev, parseInt(programId)]));

          // URL clean karo
          const newParams = new URLSearchParams(location.search);
          newParams.delete('program_id');
          newParams.delete('redirect');
          navigate({ search: newParams.toString() }, { replace: true });
        })
        .catch((error) => {
          if (error.response?.status === 409) {
            toast.warn("You have already applied for this program.");

            // ✅ YAHAN BHI parseInt() use karo
            setAppliedCourses(prev => new Set([...prev, parseInt(programId)]));
          } else {
            console.error("Auto-apply failed:", error);
            toast.error("Failed to apply. Please try again.");
          }

          // URL clean karo
          const newParams = new URLSearchParams(location.search);
          newParams.delete('program_id');
          newParams.delete('redirect');
          navigate({ search: newParams.toString() }, { replace: true });
        });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    // Lock scroll for any open modal or drawer
    const shouldLockScroll = showComparisonModal || showMobileFilter;
    
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showComparisonModal, showMobileFilter]);


  // ✅ Add ref to prevent race conditions
  const isUpdatingFilters = useRef(false);
  const fetchTimeoutRef = useRef(null);

  useEffect(() => {
    // ✅ Clear previous timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // ✅ Prevent multiple simultaneous updates
    if (isUpdatingFilters.current) return;

    // ✅ Debounce API calls - wait 300ms after last filter change
    fetchTimeoutRef.current = setTimeout(() => {
      const fetchData = async () => {
        isUpdatingFilters.current = true;
        console.log("🔄 Fetching courses with filters:", selectedFilters);

        await Promise.all([
          fetchCourses(currentPage, selectedFilters, search),
          fetchFilterOptions(selectedFilters)
        ]);

        isUpdatingFilters.current = false;
        console.log("✅ Fetch complete");
      };

      fetchData();
    }, 300); // 300ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [currentPage, selectedFilters, search]);

  useEffect(() => {
    let isMounted = true;

    // ✅ Ye useEffect ab SIRF URL se initial load ke liye hai
    // Description fetching handleFilterChange mein ho rahi hai

    const hasActiveFilters =
      selectedFilters.levels?.length > 0 ||
      selectedFilters.categories?.length > 0 ||
      selectedFilters.specializations?.length > 0;

    // ✅ SIRF tab chalo jab URL se page load ho (pehli baar)
    if (hasActiveFilters && lastSelectedFilter.value && filters[lastSelectedFilter.key]?.length > 0) {
      const filterType = lastSelectedFilter.key;
      const filterValue = lastSelectedFilter.value;

      const filterItem = filters[filterType]?.find(item => {
        const itemValue = String(item.value || item.label).toLowerCase().trim();
        return itemValue === filterValue;
      });

      if (filterItem?.id && isMounted) {
        console.log(`🔥 [useEffect] Initial load - Calling API for ${filterType} with ID:`, filterItem.id);
        fetchDynamicDescription(filterType, filterItem.id);
      }
    } else if (isMounted && !hasActiveFilters) {
      setDynamicDescription("");
    }

    return () => {
      isMounted = false;
    };
  }, [filters]);
  const handleFilterChange = (filterType, value) => {
    const normalizedValue = String(value).toLowerCase().trim();

    const currentValues = selectedFilters[filterType];
    const isSelected = currentValues.includes(normalizedValue);

    console.log(`📝 handleFilterChange called:`, {
      filterType,
      normalizedValue,
      currentValues,
      isSelected,
      willBe: isSelected ? 'removed' : 'added'
    });

    let newValues;
    if (isSelected) {
      newValues = currentValues.filter(v => v !== normalizedValue);
    } else {
      newValues = [...currentValues, normalizedValue];
    }

    const updatedFilters = {
      ...selectedFilters,
      [filterType]: newValues,
    };

    console.log(`✅ Updated filters:`, updatedFilters);

    // ✅ IMMEDIATELY update state for instant UI feedback
    setSelectedFilters(updatedFilters);

    // ✅ Defer heavy operations using startTransition
    React.startTransition(() => {
      // ✅✅✅ DESCRIPTION FETCH ✅✅✅
      if (newValues.length > 0) {
        const lastValue = newValues[newValues.length - 1];

        setLastSelectedFilter({
          key: filterType,
          value: lastValue
        });

        // ✅ TURANT DESCRIPTION FETCH - WAIT MAT KARO
        if (filterType === 'levels' || filterType === 'categories' || filterType === 'specializations') {
          // ✅ CURRENT filters state se directly ID dhundo
          const filterItem = filters[filterType]?.find(item => {
            const itemValue = String(item.value || item.label).toLowerCase().trim();
            return itemValue === lastValue;
          });

          if (filterItem?.id) {
            console.log(`🔥 [handleFilterChange] Fetching description for ${filterType} ID:`, filterItem.id);
            fetchDynamicDescription(filterType, filterItem.id);
          } else {
            console.warn(`⚠️ [handleFilterChange] Filter item NOT found for value:`, lastValue);
            console.log("📦 Available filters:", filters[filterType]);
          }
        }
      } else {
        // ✅ Agar sab filters remove ho gaye
        const remainingFilters = Object.entries(updatedFilters).find(([_, vals]) => vals.length > 0);

        if (remainingFilters) {
          const [remainingKey, remainingVals] = remainingFilters;
          const lastRemainingValue = remainingVals[remainingVals.length - 1];

          setLastSelectedFilter({
            key: remainingKey,
            value: lastRemainingValue
          });

          if (remainingKey === 'levels' || remainingKey === 'categories' || remainingKey === 'specializations') {
            const filterItem = filters[remainingKey]?.find(item => {
              const itemValue = String(item.value || item.label).toLowerCase().trim();
              return itemValue === lastRemainingValue;
            });

            if (filterItem?.id) {
              fetchDynamicDescription(remainingKey, filterItem.id);
            }
          }
        } else {
          setLastSelectedFilter({ key: "", value: "" });
          setDynamicDescription("");
        }
      }

      // ✅✅✅ URL Navigation ✅✅✅
      const params = new URLSearchParams();
      const keyMapping = {
        levels: 'level',
        categories: 'category',
        specializations: 'specialization',
        study_modes: 'study_mode',
        intakes: 'intake'
      };

      let pathFilter = filterType;
      let pathFilterValue = newValues.length > 0 ? newValues[newValues.length - 1] : null;

      if (!pathFilterValue) {
        const priorityOrder = ['levels', 'categories', 'specializations', 'intakes', 'study_modes'];
        for (const key of priorityOrder) {
          if (updatedFilters[key]?.length > 0) {
            pathFilter = key;
            pathFilterValue = updatedFilters[key][updatedFilters[key].length - 1];
            break;
          }
        }
      }

      Object.entries(updatedFilters).forEach(([key, vals]) => {
        if (vals.length > 0) {
          const paramKey = keyMapping[key];
          if (paramKey) {
            vals.forEach(val => {
              if (key !== pathFilter || val !== pathFilterValue) {
                const cleanValue = String(val).toLowerCase().replace(/\s+/g, '-');
                params.append(paramKey, cleanValue);
              }
            });
          }
        }
      });

      if (pathFilterValue) {
        const cleanSlug = String(pathFilterValue).toLowerCase().replace(/\s+/g, "-");
        const cleanPath = `/${cleanSlug}-courses`;
        const finalURL = params.toString() ? `${cleanPath}?${params.toString()}` : cleanPath;
        console.log("🔥 Navigating to:", finalURL);
        navigate(finalURL, { replace: true }); // ✅ Don't add to history
      } else {
        navigate('/courses-in-malaysia', { replace: true }); // ✅ Don't add to history
      }

      setCurrentPage(1);
    });
  };

  const toggleFilter = (key) => {
    setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleReset = () => {
    navigate('/courses-in-malaysia');

    setSearch("");
    setSelectedFilters({
      levels: [],        // ✅ Empty arrays
      categories: [],
      specializations: [],
      intakes: [],
      study_modes: [],
    });

    setLastSelectedFilter({ key: "", value: "" });
    setCurrentPage(1);
  };
  const handleUniversityClick = (universityName) => {
    if (!universityName || typeof universityName !== "string") return;
    const slug = universityName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, ""); // special characters remove
    navigate(`/university/${slug}`);
  };


  const handleSearch = (value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    navigate({ search: params.toString() });
    setCurrentPage(1);
  };
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);

    let sortedCourses = [...coursesData];

    switch (sortValue) {
      case 'rating':
        sortedCourses.sort((a, b) => (b.university?.rating || 0) - (a.university?.rating || 0));
        break;
      case 'fee-low':
        sortedCourses.sort((a, b) => {
          const feeA = parseFloat((a.fee || "0").replace(/[^0-9.]/g, ''));
          const feeB = parseFloat((b.fee || "0").replace(/[^0-9.]/g, ''));
          return feeA - feeB;
        });
        break;
      case 'fee-high':
        sortedCourses.sort((a, b) => {
          const feeA = parseFloat((a.fee || "0").replace(/[^0-9.]/g, ''));
          const feeB = parseFloat((b.fee || "0").replace(/[^0-9.]/g, ''));
          return feeB - feeA;
        });
        break;
      case 'duration':
        sortedCourses.sort((a, b) => {
          const durA = parseFloat((a.duration || "0").replace(/[^0-9.]/g, ''));
          const durB = parseFloat((b.duration || "0").replace(/[^0-9.]/g, ''));
          return durA - durB;
        });
        break;
      default: // relevance
        break;
    }

    setCoursesData(sortedCourses);
  };

  const handleViewDetail = (course) => {
    if (!course || !course.university?.name) return;

    const universitySlug = course.university.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const courseSlug = course.slug ||
      (course.course_name ?
        course.course_name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[()&]/g, "")
          .replace(/--+/g, "-")
          .trim()
        : null);

    if (!courseSlug) {
      console.error("Course slug missing");
      return;
    }

    // ✅ DIRECTLY COURSE DETAIL PAGE PE BHEJO
    navigate(`/university/${universitySlug}/courses/${courseSlug}`, {
      state: {
        fromCoursesList: true,
        courseData: course
      }
    });
  };
  // ✅ Open apply popup instead of redirecting
  const handleApplyNow = (courseOrId) => {
    const course = typeof courseOrId === "object"
      ? courseOrId
      : coursesData.find((c) => c.id === courseOrId);
    setSelectedCourseForApply(course || null);
    setIsApplyOpen(true);
  };
  const handleAddToCompare = (course) => {
    if (comparisonCourses.length >= 3) {
      toast.warn("You can compare maximum 3 courses");
      return;
    }
    if (comparisonCourses.find(c => c.id === course.id)) {
      toast.info("Course already added to comparison");
      return;
    }
    setComparisonCourses([...comparisonCourses, course]);
    toast.success("Course added to comparison");
  };

  const handleRemoveFromCompare = (courseId) => {
    setComparisonCourses(comparisonCourses.filter(c => c.id !== courseId));
  };

  const handleClearAll = () => {
    setComparisonCourses([]);
  };

  const handleCompare = () => {
    if (comparisonCourses.length < 2) {
      toast.warn("Please add at least 2 courses to compare");
      return;
    }
    setShowComparisonModal(true);
  };
  const toggleShowMore = () => setShowMore(!showMore);
  return (
    <>
      <Helmet>
        {/* 🔹 Basic SEO */}
        <title>{seo?.meta_title}</title>
        <meta name="title" content={seo?.meta_title} />
        <meta name="description" content={seo?.meta_description} />
        <meta name="keywords" content={seo?.meta_keyword} />

        {/* 🔹 Robots */}
        <meta name="robots" content={seo?.robots || "index, follow"} />

        {/* 🔹 Canonical */}
        {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}

        {/* 🔹 Open Graph (Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content={seo?.meta_title} />
        <meta property="og:description" content={seo?.meta_description} />
        <meta property="og:image" content={seo?.og_image_path} />
        <meta property="og:url" content={seo?.page_url} />
        <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
        <meta property="og:type" content={seo?.og_type || "website"} />
        <meta property="og:locale" content={seo?.og_locale || "en_US"} />
        {/* 🔹 SEO Rating (as meta) */}
        {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}

        {/* 🔹 JSON-LD Schema (Structured Data) */}
        {seo?.seo_rating_schema && (
          <script type="application/ld+json">
            {JSON.stringify(seo.seo_rating_schema)}
          </script>
        )}

      </Helmet>

      <div className="w-full bg-blue-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto scrollbar-hide">
            <Link to="/" className="flex items-center gap-1 hover:underline hover:text-blue-500 flex-shrink-0">
              <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/courses-in-malaysia" className="flex items-center gap-1 hover:underline hover:text-blue-500 flex-shrink-0">
              <Layers size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Courses in Malaysia</span>
              <span className="sm:hidden">Courses</span>
            </Link>

            {(() => {
              const path = location.pathname;
              if (path.includes('-courses')) {
                const filterName = path
                  .replace('/', '')
                  .replace('-courses', '')
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-blue-600 truncate max-w-[120px] sm:max-w-none">
                      {filterName}
                    </span>
                  </>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex backdrop-blur-[5px]">
          <div className="w-4/5 max-w-xs bg-white p-5 rounded-r-xl shadow-xl h-full overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                className="text-2xl font-bold text-gray-600 hover:text-gray-900"
                onClick={() => setShowMobileFilter(false)}
              >
                ×
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  handleReset();
                  setShowMobileFilter(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Clear All Filters
              </button>
            )}

            {/* Mobile Filters */}
            <div className="space-y-2">
              {Object.entries(filters).map(([key, items]) => (
                <div key={key} className="border-b border-gray-100 last:border-0 pb-2">
                  <button
                    onClick={() => toggleFilter(key)}
                    className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded-lg px-2"
                  >
                    <span className="font-semibold text-gray-900 capitalize flex items-center gap-2">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      {selectedFilters[key].length > 0 && ( // ✅ Array length check
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {selectedFilters[key].length} {/* ✅ Total count */}
                        </span>
                      )}
                    </span>
                    {openFilters[key] ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {openFilters[key] && (
                    <div className="mt-2 space-y-2 pl-2 max-h-56 overflow-y-auto">
                      {items.map((item) => {
                        const value = item.value || item.slug || item.name || item.month || item.study_mode || item;
                        const display = item.label || item.name || item.slug || item.month || item.study_mode || item;
                        return (
                          <label
                            key={item.id || value}
                            className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-blue-50 rounded-lg pl-0 pr-2 transition-all group"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                              checked={selectedFilters[key].includes(String(value).toLowerCase().trim())}
                              onChange={() => {
                                const normalizedValue = String(value).toLowerCase().trim();
                                handleFilterChange(key, normalizedValue);
                              }}
                            />
                            <span className="text-gray-700 text-sm font-medium group-hover:text-blue-700 text-left">
                              {display}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowMobileFilter(false)}></div>
        </div>
      )}

      {/* Course List Section */}
      {/* New Modern Header */}
      <div className="bg-gradient-to-br from-blue-50 to-white p-2 sm:p-4 min-h-screen">
        <div className="bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-2">

            {/* ✅ FILTER & COURSES - NEECHE */}

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
              {/* Mobile Filter Button */}

              <div className="lg:hidden w-full flex justify-between items-center mb-3 bg-gradient-to-r from-white to-blue-50/50 rounded-xl p-3 shadow-lg border border-blue-100">
                <span className="text-sm font-bold text-gray-800">
                  <span className="text-blue-600">{totalCourses}</span> Courses Found
                </span>
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 text-sm font-bold hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => setShowMobileFilter(true)}
                >
                  <Filter className="w-4 h-4" />
                  Filters {activeFilterCount > 0 && <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{activeFilterCount}</span>}
                </button>
              </div>

              {/* Filter Panel */}
              <>
                {loading ? <FilterPanelSkeleton /> : (
                  // <div className="hidden lg:block w-[280px] min-w-[280px] flex-shrink-0 bg-white border border-gray-200 p-5 rounded-xl shadow-md space-y-6 text-base">
                  <div className="hidden lg:block w-[280px] min-w-[280px] flex-shrink-0 bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 p-6 rounded-2xl shadow-xl space-y-5 text-base sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
                    <div className="pb-4 border-b-2 border-blue-100">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 rounded-lg shadow-sm">
                          <Filter className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Filters
                        </h2>
                        {activeFilterCount > 0 && (
                          <span className="flex items-center justify-center w-5 h-5 text-[11px] font-semibold bg-blue-600 text-white rounded-full">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                      {activeFilterCount > 0 && (
                        <div className="flex justify-end">
                          <button
                            onClick={handleReset}
                            className="text-md text-red-600 hover:text-red-700 font-bold transition-all hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Filter Options */}
                    <div className="space-y-3">
                      {Object.entries(filters).map(([key, items]) => (
                        <div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                          <button
                            onClick={() => toggleFilter(key)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all"
                          >
                            <span className="font-bold text-gray-900 capitalize flex items-center gap-2">
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                              {selectedFilters[key]?.length > 0 && (
                                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                  {selectedFilters[key].length}
                                </span>
                              )}
                            </span>
                            <div className={`transition-transform duration-200 ${openFilters[key] ? 'rotate-180' : ''}`}>
                              <ChevronDown className="w-5 h-5 text-blue-600" />
                            </div>
                          </button>

                          {openFilters[key] && (
                            <div className="px-3 pb-3 space-y-1.5 max-h-56 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                              {items.map((item) => {
                                // ✅ Extract value from item object (already normalized in fetchFilterOptions)
                                const value = item.value || item.slug || item.name || item.month || item.study_mode || item;
                                const display = item.label || item.name || item.slug || item.month || item.study_mode || item;

                                // ✅ Normalize value to match selectedFilters format (lowercase with dashes)
                                const normalizedValue = String(value).toLowerCase().trim().replace(/\s+/g, '-');

                                // ✅ Check if this filter is selected
                                const isChecked = selectedFilters[key]?.includes(normalizedValue) || false;

                                return (
                                  <label
                                    key={item.id || value}
                                    className={`flex items-center gap-3 py-2 px-3 cursor-pointer rounded-lg transition-all group ${isChecked
                                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 shadow-sm'
                                      : 'hover:bg-blue-50/50 border border-transparent'
                                      }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0 cursor-pointer"
                                      checked={isChecked}
                                      onChange={() => {
                                        console.log(`🔘 Checkbox clicked - Type: ${key}, Value: ${normalizedValue}, Currently: ${isChecked ? 'checked' : 'unchecked'}`);
                                        handleFilterChange(key, normalizedValue);
                                      }}
                                    />
                                    <span className={`text-sm font-medium text-left transition-colors ${isChecked ? 'text-blue-900 font-semibold' : 'text-gray-700 group-hover:text-blue-700'
                                      }`}>
                                      {display}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>

              {/* Course List */}

              {/* <div className="flex-1 min-w-0 max-w-full space-y-6"> */}

              {/* <div className="flex-1 min-w-0 max-w-full space-y-6"> */}
              {/* Course List */}
              <div className="flex-1 min-w-0 max-w-full space-y-6 courses-content-wrapper">

                {/* ✅✅✅ YAHAN PASTE KARO - HEADER SECTION ✅✅✅ */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex flex-col gap-3">
                    {/* Top Row - Title */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Your Perfect Course</h1>
                        <p className="text-sm text-gray-600">
                          Showing <span className="font-semibold text-blue-600">{totalCourses}</span>
                          {' '}
                          {lastSelectedFilter.value && (
                            <>
                              {' '}
                              <span className="font-semibold text-blue-600 uppercase">
                                {lastSelectedFilter.value.replace(/-/g, ' ')}
                              </span>
                              {' '}
                            </>
                          )}
                          courses available in Malaysia
                        </p>
                      </div>
                    </div>

                    {/* Description Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-2 shadow-sm">

                      {(() => {
                        const CHAR_LIMIT = 450;

                        // ✅ CHECK: Filter applied hai ya nahi
                        const hasFilters =
                          selectedFilters.levels?.length > 0 ||
                          selectedFilters.categories?.length > 0 ||
                          selectedFilters.specializations?.length > 0 ||
                          selectedFilters.intakes?.length > 0 ||
                          selectedFilters.study_modes?.length > 0;

                        const getSmartContent = (text) => {
                          if (!text) return null;

                          // ✅ Agar NO filters, to button NAHI chahiye
                          if (!hasFilters) {
                            return {
                              text: text, // Full text
                              showButton: false
                            };
                          }

                          // ✅ Filters applied hain, to smart logic
                          const needsButton = text.length > CHAR_LIMIT;
                          return {
                            text: needsButton ? (showMore ? text : text.slice(0, CHAR_LIMIT) + "...") : text,
                            showButton: needsButton
                          };
                        };

                        if (dynamicDescription) {
                          const content = getSmartContent(dynamicDescription);
                          return (
                            <>
                              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                {content.text}
                              </p>
                              {content.showButton && (
                                <button
                                  onClick={toggleShowMore}
                                  className="mt-3 text-blue-600 text-sm font-semibold hover:underline focus:outline-none flex items-center gap-1"
                                >
                                  {showMore ? (
                                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                                  ) : (
                                    <>Show More <ChevronDown className="w-4 h-4" /></>
                                  )}
                                </button>
                              )}
                            </>
                          );
                        }

                        const path = location.pathname;
                        let pathDescription = '';

                        if (path.includes('pre-university')) {
                          pathDescription = `Discover a list of ${totalCourses} PRE-UNIVERSITY courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering PRE-UNIVERSITY degree programs. Enroll directly in PRE-UNIVERSITY courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('diploma')) {
                          pathDescription = `Discover a list of ${totalCourses} DIPLOMA courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering DIPLOMA degree programs. Enroll directly in DIPLOMA courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('under-graduate')) {
                          pathDescription = `Discover a list of ${totalCourses} UNDER-GRADUATE courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering UNDER-GRADUATE degree programs. Enroll directly in UNDER-GRADUATE courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('post-graduate-diploma')) {
                          pathDescription = `Discover a list of ${totalCourses} POST-GRADUATE-DIPLOMA courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering POST-GRADUATE-DIPLOMA degree programs. Enroll directly in POST-GRADUATE-DIPLOMA courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('post-graduate')) {
                          pathDescription = `Discover a list of ${totalCourses} POST-GRADUATE courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering POST-GRADUATE degree programs. Enroll directly in POST-GRADUATE courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('a-levels')) {
                          pathDescription = `Discover a list of ${totalCourses} A-LEVELS courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering A-LEVELS degree programs. Enroll directly in A-LEVELS courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('certificate')) {
                          pathDescription = `Discover a list of ${totalCourses} CERTIFICATE courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering CERTIFICATE degree programs. Enroll directly in CERTIFICATE courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('business-and-management')) {
                          pathDescription = `Discover a list of ${totalCourses} BUSINESS AND MANAGEMENT courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering BUSINESS AND MANAGEMENT degree programs. Enroll directly in BUSINESS AND MANAGEMENT courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('creative-arts-and-design')) {
                          pathDescription = `Discover a list of ${totalCourses} CREATIVE ARTS AND DESIGN courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering CREATIVE ARTS AND DESIGN degree programs. Enroll directly in CREATIVE ARTS AND DESIGN courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('education-and-training')) {
                          pathDescription = `Discover a list of ${totalCourses} EDUCATION AND TRAINING courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering EDUCATION AND TRAINING degree programs. Enroll directly in EDUCATION AND TRAINING courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('engineering-and-technology')) {
                          pathDescription = `Discover a list of ${totalCourses} ENGINEERING AND TECHNOLOGY courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering ENGINEERING AND TECHNOLOGY degree programs. Enroll directly in ENGINEERING AND TECHNOLOGY courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('computer-science')) {
                          pathDescription = `Discover a list of ${totalCourses} COMPUTER SCIENCE courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering COMPUTER SCIENCE degree programs. Enroll directly in COMPUTER SCIENCE courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('medicine-and-health')) {
                          pathDescription = `Discover a list of ${totalCourses} MEDICINE AND HEALTH courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering MEDICINE AND HEALTH degree programs. Enroll directly in MEDICINE AND HEALTH courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('full-time')) {
                          pathDescription = `Discover a list of ${totalCourses} FULL-TIME courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering FULL-TIME degree programs. Enroll directly in FULL-TIME courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('part-time')) {
                          pathDescription = `Discover a list of ${totalCourses} PART-TIME courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering PART-TIME degree programs. Enroll directly in PART-TIME courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('online')) {
                          pathDescription = `Discover a list of ${totalCourses} ONLINE courses offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering ONLINE degree programs. Enroll directly in ONLINE courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('january')) {
                          pathDescription = `Discover a list of ${totalCourses} courses with JANUARY intake offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering courses with JANUARY intake. Enroll directly in courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('february')) {
                          pathDescription = `Discover a list of ${totalCourses} courses with FEBRUARY intake offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering courses with FEBRUARY intake. Enroll directly in courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('march')) {
                          pathDescription = `Discover a list of ${totalCourses} courses with MARCH intake offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering courses with MARCH intake. Enroll directly in courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('april')) {
                          pathDescription = `Discover a list of ${totalCourses} courses with APRIL intake offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering courses with APRIL intake. Enroll directly in courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('may')) {
                          pathDescription = `Discover a list of ${totalCourses} courses with MAY intake offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering courses with MAY intake. Enroll directly in courses through EducationMalaysia.in.`;
                        }
                        else if (path.includes('september')) {
                          pathDescription = `Discover a list of ${totalCourses} courses with SEPTEMBER intake offered by the Top universities and colleges in Malaysia. Gather valuable information such as entry requirements, fee structures, intake schedules for 2025, study modes, and recommendations for the best universities and colleges offering courses with SEPTEMBER intake. Enroll directly in courses through EducationMalaysia.in.`;
                        }
                        else {
                          pathDescription = infoText;
                        }

                        const content = getSmartContent(pathDescription);
                        return (
                          <>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                              {content.text}
                            </p>
                            {content.showButton && (
                              <button
                                onClick={toggleShowMore}
                                className="mt-3 text-blue-600 text-sm font-semibold hover:underline focus:outline-none flex items-center gap-1"
                              >
                                {showMore ? (
                                  <>Show Less <ChevronUp className="w-4 h-4" /></>
                                ) : (
                                  <>Show More <ChevronDown className="w-4 h-4" /></>
                                )}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Sort + Search + View Toggle */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-gray-200">

                      {/* Left: Sort by */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <ArrowUpDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Sort by:</span>
                        <select
                          value={sortBy}
                          onChange={handleSortChange}
                          className="flex-1 sm:flex-none px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors font-medium text-sm bg-white cursor-pointer hover:border-gray-300"
                        >
                          <option value="rating">Highest Rated</option>
                          <option value="duration">Duration</option>
                        </select>
                      </div>

                      {/* Right: Search + Toggle */}
                      <div className="flex items-center gap-2">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                          <input
                            type="text"
                            placeholder={getSearchPlaceholder()}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSearch(search);
                              }
                            }}
                            className="w-full pl-9 sm:pl-12 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors font-medium text-sm"
                          />
                        </div>

                        {/* List/Grid Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-shrink-0">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                              }`}
                            title="List View"
                          >
                            <List className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                              }`}
                            title="Grid View"
                          >
                            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>




                {/* ✅ Active Filters Display */}
                {Object.values(selectedFilters).some((filter) => filter.length > 0) && (
                  <div className="bg-white border border-gray-200 rounded-xl  mb-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-blue-600" />
                        Active Filters
                      </h3>
                      <button
                        onClick={handleReset}
                        className="text-md text-red-600 hover:text-red-700 font-bold transition-all hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedFilters).map(([key, values]) => {
                        if (!values || values.length === 0) return null; // ✅ Array check

                        return values.map((value) => { // ✅ Map over array
                          const displayName = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          const filterLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

                          return (
                            <div
                              key={`${key}-${value}`} // ✅ Unique key
                              className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-lg px-3 py-1.5 text-sm"
                            >
                              <span className="font-semibold text-gray-700">{filterLabel}:</span>
                              <span className="text-blue-700">{displayName}</span>
                              <button
                                onClick={() => handleFilterChange(key, value)}
                                className="text-gray-500 hover:text-red-600 transition-colors ml-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        });
                      })}
                    </div>
                  </div>
                )}

                {/* Course Cards */}
                {/* Course Cards with Grid/List Toggle */}
                {loading ? (

                  <div className={`${viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"} courses-grid-wrapper ${comparisonCourses.length > 0 ? 'with-compare' : ''}`}>
                    {[...Array(5)].map((_, i) => <CourseCardSkeleton key={i} />)}
                  </div>
                ) : (

                  <div className={`${viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"} courses-grid-wrapper ${comparisonCourses.length > 0 ? 'with-compare' : ''}`}>
                    {coursesData.map((course, i) => (
                      <div
                        key={i}
                        className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 group relative ${viewMode === 'grid' ? 'flex flex-col h-full' : 'mb-4 w-full'
                          }`}
                      >
                        <div className="px-4 py-1.5">
                          {/* University Header */}
                          {/* <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'items-start justify-between'} gap-3 mb-4`}> */}
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3 w-full">
                              {/* Logo */}
                              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm overflow-hidden">
                                <img
                                  src={`https://www.educationmalaysia.in/storage/${course.university?.logo_path}`}
                                  alt={course.university?.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>

                              {/* University Info */}
                              <div className="flex-1 min-w-0">
                                <h3
                                  onClick={() => handleUniversityClick(course.university?.name)}
                                  className="text-sm sm:text-base font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors truncate leading-tight"
                                >
                                  {course.university?.name}
                                </h3>

                                <div className="flex items-center text-gray-600 text-xs mt-0.5">
                                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {course.university?.city}, {course.university?.state}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                                  <div className="flex items-center">
                                    <Building className="w-3 h-3 mr-0.5" />
                                    <span>{course.university?.inst_type || "Private"}</span>
                                  </div>

                                  <div className="flex items-center">
                                    <BookOpen className="w-3 h-3 mr-0.5" />
                                    <span>{course.university?.programs_count} Courses</span>
                                  </div>
                                </div>
                              </div>
                            </div>


                            {/* Rating & Heart */}
                            {/* <div className={`flex items-center gap-3 flex-shrink-0 ${viewMode === 'grid' ? 'w-full justify-between mt-2' : ''}`}> */}
                            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto sm:flex-shrink-0">

                              <div className="flex gap-1.5">
                                {course.is_local === 1 && (
                                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                    <Home className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-700">Local</span>
                                  </div>
                                )}
                                {course.is_international === 1 && (
                                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200">
                                    <Globe className="w-3 h-3 text-green-600" />
                                    <span className="text-xs font-semibold text-green-700">Int'l</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-0.5 bg-gradient-to-br from-amber-50 to-yellow-50 px-2 py-1 rounded border border-amber-200">
                                <span className="text-sm font-bold text-gray-900">{course.university?.rating || "N/A"}</span>
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              </div>


                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-2 mb-2">
                            {/* Course Title */}


                            <h4
                              onClick={() => handleViewDetail(course)}  // ✅ 
                              className="text-sm font-bold text-blue-600 mb-2 hover:text-blue-700 cursor-pointer transition-colors line-clamp-2 leading-tight"
                            >
                              {course.course_name}
                            </h4>



                            {/* Course Specs Grid */}
                            {/* <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-4'} gap-2 mb-3`}> */}
                            <div className={`grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-2`}>
                              <div className="bg-gray-50 rounded p-2 border border-gray-200 flex flex-col justify-center min-h-[60px]">
                                <p className="text-xs text-gray-500 mb-0.5 font-semibold uppercase">Mode</p>
                                <p className="text-xs font-bold text-gray-900 line-clamp-1">{course.study_mode || "N/A"}</p>
                              </div>
                              <div className="bg-gray-50 rounded p-2 border border-gray-200 flex flex-col justify-center min-h-[60px]">
                                <p className="text-xs text-gray-500 mb-0.5 font-semibold uppercase">Duration</p>
                                <p className="text-xs font-bold text-gray-900 break-words leading-tight">{course.duration || "N/A"}</p>
                              </div>
                              <div className="bg-gray-50 rounded p-2 border border-gray-200 flex flex-col justify-center min-h-[60px]">
                                <p className="text-xs text-gray-500 mb-0.5 font-semibold uppercase">Intakes</p>
                                <p className="text-xs font-bold text-gray-900 break-words leading-tight">
                                  {course.intake || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded p-2 border border-gray-200 flex flex-col justify-center min-h-[60px]">
                                <p className="text-xs text-gray-500 mb-0.5 font-semibold uppercase">Tuition Fee</p>
                                <p className="text-xs font-bold text-gray-900 line-clamp-1">{course.fee || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                          {/* Accreditation Badges - Dynamic */}
                          {(() => {
                            const accreditations = Array.isArray(course.accreditations)
                              ? course.accreditations
                              : typeof course.accreditations === "string"
                                ? course.accreditations
                                  .split(",")
                                  .map((item) => item.replace(/\\/g, "").replace(/"/g, "").replace(/[\[\]]/g, "").trim())
                                  .filter(Boolean)
                                : [];

                            return accreditations.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {accreditations.map((accreditation, index) => (
                                  <span
                                    key={`${accreditation}-${index}`}
                                    className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-300 whitespace-nowrap"
                                  >
                                    {accreditation}
                                  </span>
                                ))}
                              </div>
                            ) : null;
                          })()}

                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-1.5 w-full">
                            {/* Apply Now Button */}
                            <button
                              onClick={() => !appliedCourses.has(course.id) && handleApplyNow(course)}
                              className={`font-bold py-2 px-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs ${appliedCourses.has(course.id)
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                                }`}
                              disabled={appliedCourses.has(course.id)}
                            >
                              {appliedCourses.has(course.id) ? "Applied" : "Apply Now"}
                            </button>

                            {/* View Details Button */}
                            <button
                              onClick={() => handleViewDetail(course)}
                              className="cursor-pointer bg-white text-gray-800 font-bold py-2.5 px-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                            >
                              View Details
                            </button>

                            {/* Compare Button */}
                            <button
                              onClick={() => handleAddToCompare(course)}
                              className="cursor-pointer font-bold py-2.5 px-2 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md bg-white text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-xs sm:text-sm"
                            >
                              Compare
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {comparisonCourses.length > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp bg-white shadow-[0_-4px_30px_rgba(0,0,0,0.1)] border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 py-2 lg:py-4">

                      <div className="flex flex-col lg:flex-row items-center gap-4">
                        {/* 🏷️ Compact Header (Mobile Only) */}
                        <div className="flex justify-between items-center w-full lg:w-auto lg:hidden">
                          <div className="flex items-center gap-3">
                            <LayoutGrid className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-gray-900 text-sm">Compare</span>
                            {/* Compact count badges */}
                            <div className="flex gap-1">
                              {[1, 2, 3].map((num) => (
                                <div
                                  key={num}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    num <= comparisonCourses.length
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button onClick={handleClearAll} className="text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors">Clear</button>
                        </div>

                        {/* 📦 3 Slots Grid (Desktop Only) */}
                        <div className="hidden lg:grid grid-cols-3 gap-3 w-full lg:flex-1">
                          {[0, 1, 2].map((i) => {
                            const course = comparisonCourses[i];
                            return (
                              <div
                                key={i}
                                className={`relative rounded-xl border p-3 flex items-center h-auto sm:h-28 lg:h-24 transition-all duration-300 group ${course
                                  ? 'bg-gradient-to-br from-blue-50/50 to-white border-blue-200 shadow-sm'
                                  : 'bg-gray-50/50 border-dashed border-gray-300 justify-center hover:bg-gray-100/50'}`}
                              >
                                {course ? (
                                  <div className="min-w-0 pr-6 w-full">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider line-clamp-1 w-fit">
                                        {course.university?.inst_type || 'Course'}
                                      </span>
                                    </div>
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-0.5" title={course.course_name}>
                                      {course.course_name}
                                    </h4>
                                    <p className="text-[10px] sm:text-xs text-gray-500 truncate flex items-center gap-1">
                                      <Building className="w-3 h-3" /> {course.university?.name}
                                    </p>
                                    <button
                                      onClick={() => handleRemoveFromCompare(course.id)}
                                      className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-full transition-all shadow-sm opacity-100 lg:opacity-0 group-hover:opacity-100"
                                      title="Remove Course"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-center flex flex-col items-center py-2">
                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center mb-1 text-gray-400 font-bold shadow-sm">
                                      {i + 1}
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Add Course</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* 🚀 Actions (Desktop) */}
                        <div className="hidden lg:flex flex-col gap-2 w-48 shrink-0">
                          <button
                            onClick={handleCompare}
                            disabled={comparisonCourses.length < 2}
                            className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all text-white flex items-center justify-center gap-2 ${comparisonCourses.length >= 2
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02] active:scale-95'
                              : 'bg-gray-300 cursor-not-allowed'}`}
                          >
                            Compare Now <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleClearAll}
                            className="text-xs text-gray-500 hover:text-red-600 font-semibold flex items-center justify-center gap-1 transition-colors hover:bg-gray-50 py-1.5 rounded-lg"
                          >
                            <X className="w-3 h-3" /> Clear All & Close
                          </button>
                        </div>

                        {/* 🚀 Actions (Mobile) */}
                        <button
                          onClick={handleCompare}
                          disabled={comparisonCourses.length < 2}
                          className={`lg:hidden w-full py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${comparisonCourses.length >= 2
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                            : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                          Compare Selected <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {/* ✅ MOBILE RESPONSIVE Pagination */}
                <div className="flex justify-center items-center gap-2 mt-6 px-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex items-center gap-2 min-w-max">
                    {paginationLinks.map((link, idx) => {
                      const isDisabled = link.url === null;
                      const isActive = !!link.active;

                      // Label cleanup
                      const label = link.label
                        .replace("&laquo;", "«")
                        .replace("&raquo;", "»");

                      // ✅ MOBILE PE SIRF IMPORTANT PAGES DIKHAO
                      const pageNumber = parseInt(label);
                      const showOnMobile =
                        label.includes("Previous") ||
                        label.includes("Next") ||
                        label === "..." ||
                        isActive || // Current page
                        pageNumber === 1 || // First page
                        pageNumber === lastPage || // Last page
                        Math.abs(pageNumber - currentPage) <= 1; // Adjacent pages

                      // Icon check
                      let content = label;
                      if (label.includes("Previous")) {
                        content = <HiChevronLeft size={20} />;
                      } else if (label.includes("Next")) {
                        content = <HiChevronRight size={20} />;
                      }

                      return (
                        <button
                          key={`${label}-${idx}`}
                          onClick={() => {
                            if (!isDisabled && link.url) {
                              const url = new URL(link.url);
                              const page = url.searchParams.get('page');
                              if (page) {
                                setCurrentPage(parseInt(page, 10));
                              }
                            }
                          }}
                          disabled={isDisabled}
                          className={`
            min-w-[40px] h-10 rounded-full flex items-center justify-center border text-sm font-semibold transition-all duration-200
            ${isActive ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"}
            ${isDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200" : "cursor-pointer"}
            ${!showOnMobile ? "hidden sm:flex" : "flex"}
          `}
                        >
                          {content}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-fadeInScale">

            {/* Modal Title Bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                Comparison Result
              </h3>
              <button onClick={() => setShowComparisonModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto flex-1 p-6 bg-gray-50/50">
              {/* Mobile Comparison View */}
              <div className="sm:hidden">
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
                  {/* Course Headers */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-xl">
                    <div className="grid grid-cols-3 gap-2">
                      {comparisonCourses.map((course, index) => (
                        <div key={course.id} className="text-center">
                          <div className="bg-white/20 backdrop-blur rounded-lg p-2">
                            <div className="text-[9px] uppercase font-bold text-blue-100 mb-1">
                              {course.university?.inst_type || 'University'}
                            </div>
                            <div className="text-xs font-bold leading-tight mb-1 line-clamp-2">
                              {course.course_name}
                            </div>
                            <div className="text-[9px] text-blue-100 opacity-90">
                              {course.university?.name?.length > 12 ? course.university?.name.substring(0, 12) + '...' : course.university?.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Comparison Content */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 space-y-2">
                      {/* Study Mode */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Study Mode</div>
                        <div className="grid grid-cols-3 gap-2">
                          {comparisonCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded p-2 text-center border border-gray-100">
                              <div className="text-xs text-gray-800">
                                {course.study_mode || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Duration</div>
                        <div className="grid grid-cols-3 gap-2">
                          {comparisonCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded p-2 text-center border border-blue-100">
                              <div className="text-xs text-gray-800">
                                {course.duration || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tuition Fee */}
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Tuition Fee</div>
                        <div className="grid grid-cols-3 gap-2">
                          {comparisonCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded p-2 text-center border border-green-100">
                              <div className="text-xs font-bold text-green-700">
                                {course.fee || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Intake */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Intake</div>
                        <div className="grid grid-cols-3 gap-2">
                          {comparisonCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded p-2 text-center border border-purple-100">
                              <div className="text-xs text-gray-800">
                                {course.intake ? course.intake.replace(/,/g, ", ") : 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Location</div>
                        <div className="grid grid-cols-3 gap-2">
                          {comparisonCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded p-2 text-center border border-red-100">
                              <div className="text-xs text-gray-800">
                                {course.university?.city || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Rating</div>
                        <div className="grid grid-cols-3 gap-2">
                          {comparisonCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded p-2 text-center border border-yellow-100">
                              <div className="text-xs font-bold text-yellow-700 flex items-center justify-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                {course.university?.rating || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Buttons */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-b-xl border-t border-blue-700">
                    <div className="grid grid-cols-3 gap-2">
                      {comparisonCourses.map((course) => (
                        <div key={course.id} className="text-center">
                          <button
                            onClick={() => { handleApplyNow(course); }}
                            disabled={appliedCourses.has(course.id)}
                            className={`w-full py-2 px-2 text-xs rounded-lg font-bold transition-all ${appliedCourses.has(course.id)
                              ? "bg-white/20 text-white cursor-not-allowed"
                              : "bg-white text-blue-700 hover:bg-blue-50"}`}
                          >
                            {appliedCourses.has(course.id) ? "Applied ✓" : "Apply Now"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop/Table View */}
              <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white hidden sm:block">
                <div className="overflow-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    {/* PRIMARY HEADER - BLUE */}
                    <tr className="bg-blue-700 text-white">
                      <th className="p-5 font-semibold text-sm uppercase tracking-wider w-1/4 sticky left-0 bg-blue-700 z-10 border-r border-blue-600 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                        Criteria
                      </th>
                      {comparisonCourses.map((course) => (
                        <th key={course.id} className="p-5 min-w-[280px] align-top border-r border-blue-600 last:border-0">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-blue-100 bg-blue-800/60 rounded px-2 py-0.5 w-fit backdrop-blur-sm border border-blue-600">
                              {course.university?.inst_type || 'University'}
                            </span>
                            <div className="text-lg font-bold leading-tight line-clamp-2" title={course.course_name}>
                              {course.course_name}
                            </div>
                            <div className="text-xs font-medium text-blue-200 flex items-center gap-1">
                              <Building className="w-3 h-3 opacity-70" /> {course.university?.name}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {/* Study Mode */}
                    <tr className="hover:bg-blue-50/30 transition-colors bg-white group">
                      <td className="p-4 font-medium text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-blue-50/30">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-500" /> Study Mode
                        </div>
                      </td>
                      {comparisonCourses.map(c => (
                        <td key={c.id} className="p-4 text-gray-700 border-r border-gray-100 last:border-0 font-medium">
                          {c.study_mode || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Duration */}
                    <tr className="hover:bg-blue-50/30 transition-colors bg-gray-50/40 group">
                      <td className="p-4 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-r border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-blue-50/30">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" /> Duration
                        </div>
                      </td>
                      {comparisonCourses.map(c => (
                        <td key={c.id} className="p-4 text-gray-700 border-r border-gray-100 last:border-0">
                          {c.duration || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Fee */}
                    <tr className="hover:bg-blue-50/30 transition-colors bg-white group">
                      <td className="p-4 font-medium text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-blue-50/30">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" /> Tuition Fee
                        </div>
                      </td>
                      {comparisonCourses.map(c => (
                        <td key={c.id} className="p-4 text-gray-900 font-bold border-r border-gray-100 last:border-0">
                          {c.fee || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Intake */}
                    <tr className="hover:bg-blue-50/30 transition-colors bg-gray-50/40 group">
                      <td className="p-4 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-r border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-blue-50/30">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" /> Intake
                        </div>
                      </td>
                      {comparisonCourses.map(c => (
                        <td key={c.id} className="p-4 text-gray-700 border-r border-gray-100 last:border-0 text-sm">
                          {c.intake ? c.intake.replace(/,/g, ', ') : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Location */}
                    <tr className="hover:bg-blue-50/30 transition-colors bg-white group">
                      <td className="p-4 font-medium text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-blue-50/30">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" /> Location
                        </div>
                      </td>
                      {comparisonCourses.map(c => (
                        <td key={c.id} className="p-4 text-gray-700 border-r border-gray-100 last:border-0 text-sm">
                          {c.university?.city}, {c.university?.state}
                        </td>
                      ))}
                    </tr>

                    {/* Actions */}
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td className="p-4 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        Actions
                      </td>
                      {comparisonCourses.map(c => (
                        <td key={c.id} className="p-4 border-r border-gray-200 last:border-0">
                          <button
                            onClick={() => { handleApplyNow(c); }}
                            disabled={appliedCourses.has(c.id)}
                            className={`w-full py-2.5 px-4 text-white text-sm rounded-lg font-bold shadow-md transition-all active:scale-95 ${appliedCourses.has(c.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'}`}
                          >
                            {appliedCourses.has(c.id) ? "Applied" : "Apply Now"}
                          </button>
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-8 py-2.5 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors shadow-lg"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ✅ Apply Popup */}
      <PopupForm
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        universityData={{
          name: selectedCourseForApply?.university?.name || "University",
          course_name: selectedCourseForApply?.course_name,
          id: selectedCourseForApply?.university?.id,
          logo_path: selectedCourseForApply?.university?.logo_path
        }}
        formType="apply"
      />

    </>

  );
};

export default Courses;
