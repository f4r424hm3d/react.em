import React, { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import SeoHead from "../../components/SeoHead";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";

const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="flex items-center text-gray-600 text-sm">
          <div className="w-4 h-4 mr-2 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

const NewsCardGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [seo, setSeo] = useState({});
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { category_slug } = useParams();
  const navigate = useNavigate();

  // Fetch categories from blogs
  useEffect(() => {
    const fetchAllBlogsForCategories = async () => {
      try {
        // Step 1: Fetch the latest blogs to get a valid slug
        const res = await api.get("/blog");
        const blogData = res.data.blogs;

        if (blogData?.data && blogData.data.length > 0) {
          const firstBlog = blogData.data[0];

          if (firstBlog.slug && firstBlog.get_category) {
            // Step 2: Fetch details of the first blog to get ALL categories
            // Format: /blog-details/{category}/{slug}-{id}
            const detailUrl = `/blog-details/${firstBlog.get_category.category_slug}/${firstBlog.slug}-${firstBlog.id}`;

            try {
              const detailRes = await api.get(detailUrl);
              if (
                detailRes.data.categories &&
                detailRes.data.categories.length > 0
              ) {
                // Success! We have the full list
                setCategories(detailRes.data.categories);
                return;
              }
            } catch (detailErr) {
              console.warn(
                "Failed to fetch blog details for categories, falling back to basic extraction",
                detailErr,
              );
            }
          }

          // Fallback: Extract unique categories from visible blogs (if detail fetch fails)
          const uniqueCategories = [];
          const categoryMap = new Map();

          blogData.data.forEach((blog) => {
            if (blog.get_category && !categoryMap.has(blog.get_category.id)) {
              categoryMap.set(blog.get_category.id, {
                id: blog.get_category.id,
                category_name: blog.get_category.category_name,
                category_slug: blog.get_category.category_slug,
              });
            }
          });

          setCategories(Array.from(categoryMap.values()));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchAllBlogsForCategories();
  }, []);

  // Fetch blogs
  const fetchBlogs = async (page = 1, category = "all") => {
    setLoading(true);
    try {
      let res;
      if (category === "all") {
        res = await api.get(`/blog?page=${page}&per_page=100`);
        setSeo(res.data.seo);
      } else {
        res = await api.get(
          `/blog-by-category/${category}?page=${page}&per_page=100`,
        );
        setSeo(res.data.seo);
      }

      const blogData = res.data.blogs;
      if (blogData?.data) {
        setBlogs(blogData.data);
        setFilteredBlogs(blogData.data);
        setCurrentPage(blogData.current_page);
        setLastPage(blogData.last_page);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const category = category_slug || "all";
    setSelectedCategory(category);
    fetchBlogs(currentPage, category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category_slug, currentPage]);

  // Apply filters
  useEffect(() => {
    let filtered = [...blogs];

    // Filter by search query
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.headline.toLowerCase().includes(query) ||
          blog.get_category?.category_name?.toLowerCase().includes(query),
      );
    }

    // Filter by category (only if not already filtered by route)
    if (selectedCategory !== "all" && !category_slug) {
      filtered = filtered.filter(
        (blog) => blog.get_category?.category_slug === selectedCategory,
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, selectedCategory, blogs, category_slug]);

  const handleCategoryChange = (slug) => {
    setCurrentPage(1);
    setSelectedCategory(slug);
    setSearchQuery("");

    if (slug === "all") {
      navigate("/blog");
    } else {
      navigate(`/blog/${slug}`);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setCurrentPage(1);
    navigate("/blog");
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* ✅ NEW: Dynamic SEO - Auto-generates unique meta tags based on URL, category, and pagination */}
      <SeoHead
        data={{
          category: category_slug,
          keywords: seo?.meta_keyword,
          image: seo?.og_image_path,
        }}
      />

      {/* ✅ NEW: Dynamic Breadcrumb - Auto-updates based on URL and pagination */}
      <DynamicBreadcrumb
        data={{
          category: category_slug,
        }}
      />

      <div className="p-6 lg:p-10">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search blog by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category_slug}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Reset
            </button>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Active Filters: </span>
              {searchQuery && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Category:{" "}
                  {
                    categories.find((c) => c.category_slug === selectedCategory)
                      ?.category_name
                  }
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count - Shown only when filtered */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="mb-4 text-gray-700 font-semibold">
            Found <span className="text-blue-600">{filteredBlogs.length}</span>{" "}
            blog{filteredBlogs.length !== 1 ? "s" : ""} matching your criteria.
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((item) => {
              const imageUrl = item.imgpath?.startsWith("http")
                ? item.imgpath
                : `https://admin.educationmalaysia.in/storage/${item.thumbnail_path || "default.jpg"}`;
              const catSlug = item.get_category?.category_slug;

              return (
                <Link
                  to={`/blog/${catSlug}/${item.slug}-${item.id}`}
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={item.headline}
                      className="w-full h-48 object-cover"
                    />
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange(catSlug);
                      }}
                      className={`absolute top-4 left-4 font-semibold text-sm px-3 py-1 rounded shadow-md cursor-pointer transition ${
                        selectedCategory === catSlug
                          ? "bg-blue-600 text-white"
                          : "bg-white text-black hover:bg-blue-100"
                      }`}
                    >
                      {item.get_category?.category_name || "General"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.headline}
                    </h3>
                  </div>
                  <div className="px-4 pb-4 flex items-center text-gray-600 text-sm">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(item.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No blogs found matching your search criteria.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {lastPage > 1 && !searchQuery && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-full ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-100"
              } border`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className={`px-3 py-2 rounded-full ${
                currentPage === lastPage
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-100"
              } border`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsCardGrid;
