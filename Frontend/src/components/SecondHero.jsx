import React from 'react';

function SecondHero({ promiseText, promiseImages }) {
  if (!promiseText) return null;
  
  return (
    <div className="w-full mt-20 px-4 sm:px-6 lg:px-8">
      {/* Mobile View - Stacked */}
      <div className="block lg:hidden space-y-6">
        {/* Text First on Mobile */}
        <div className="text-center px-4 py-8 bg-gray-50 rounded-lg">
          <p className="text-xl sm:text-2xl font-medium text-gray-800">
            {promiseText}
          </p>
        </div>
        
        {/* Images Grid on Mobile */}
        <div className="grid grid-cols-2 gap-4">
          {promiseImages?.map((img, index) => (
            img?.url && (
              <img
                key={index}
                src={img.url}
                className="w-full h-40 object-cover rounded-lg"
                alt={`Promise ${index + 1}`}
              />
            )
          ))}
        </div>
      </div>

      {/* Desktop View - Original Layout */}
      <div className="hidden lg:block relative max-w-6xl mx-auto h-[420px]">
        {/* TOP LEFT */}
        {promiseImages?.[0]?.url && (
          <img
            src={promiseImages[0].url}
            className="absolute top-0 left-0 w-60 h-45 object-cover rounded-lg"
            alt="Promise 1"
          />
        )}
        
        {/* TOP RIGHT */}
        {promiseImages?.[1]?.url && (
          <img
            src={promiseImages[1].url}
            className="absolute top-0 right-0 w-60 h-45 object-cover rounded-lg"
            alt="Promise 2"
          />
        )}
        
        {/* BOTTOM LEFT */}
        {promiseImages?.[2]?.url && (
          <img
            src={promiseImages[2].url}
            className="absolute bottom-0 left-0 w-60 h-45 object-cover rounded-lg"
            alt="Promise 3"
          />
        )}
        
        {/* BOTTOM RIGHT */}
        {promiseImages?.[3]?.url && (
          <img
            src={promiseImages[3].url}
            className="absolute bottom-0 right-0 w-60 h-45 object-cover rounded-lg"
            alt="Promise 4"
          />
        )}
        
        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <p className="text-2xl md:text-5xl font-medium text-gray-800 max-w-2xl">
            {promiseText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecondHero;