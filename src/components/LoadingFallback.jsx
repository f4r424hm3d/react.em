import React from "react";

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    {/* Navbar Skeleton */}
    <div className="h-16 bg-white shadow-lg animate-pulse">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="h-12 w-48 bg-gray-200 rounded" />
        <div className="hidden md:flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </main>

    {/* Footer Skeleton */}
    <div className="bg-gray-200 h-64 animate-pulse" />
  </div>
);

export default React.memo(LoadingFallback);
