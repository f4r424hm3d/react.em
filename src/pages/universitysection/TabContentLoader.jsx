import React from "react";

const TabContentLoader = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="flex flex-col gap-4">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`h-4 bg-gray-200 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-full'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TabContentLoader;