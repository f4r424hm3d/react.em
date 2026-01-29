import React from 'react'

const BlogCategories = () => {
  return (
    <>
    
     <div className="px-3">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h4 className="text-xl font-bold border-b pb-3 mb-5 text-gray-800">
          🔥 Trending Courses
        </h4>
        {courses.length === 0 ? (
          <p className="text-gray-500">No trending courses available.</p>
        ) : (
          <ul className="space-y-3">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  to={`/specialization/${course.slug}`}
                  className="flex items-center justify-between px-4 py-2 rounded-md text-gray-700 hover:bg-orange-100/70 hover:text-orange-700 transition group"
                >
                  <span className="font-medium group-hover:translate-x-1 transition">
                    {course.name}
                  </span>
                  <FaArrowRight className="text-orange-500 group-hover:translate-x-1 transition" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    
    </>
  )
}

export default BlogCategories