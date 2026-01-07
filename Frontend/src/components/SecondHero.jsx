import React from 'react';


function SecondHero({ promiseText, promiseImages }) {
  if (!promiseText) return null;
  return (
    <div className="relative max-w-6xl mx-auto h-[420px] mt-20">

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
        <p className="text-2xl md:text-4xl font-semibold text-gray-800 max-w-xl">
          {promiseText}
        </p>
      </div>
    </div>
  );
}
export default SecondHero;
