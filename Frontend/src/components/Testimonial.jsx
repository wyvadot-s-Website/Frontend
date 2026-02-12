import React, { useEffect, useState } from "react";
import { fetchTestimonials } from "@/services/testimonialService";

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="py-16 px-4 bg-white">
      {/* Orange top bar */}
      <div className=""></div>

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
          What our satisfied clients
          <br />
          and partners are saying
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
          {testimonials.map((item, index) => (
            <div
              key={item._id}
              className={`bg-gray-50 p-8 rounded-lg ${
                // Make every 4th card span 2 columns on large screens
                (index + 1) % 4 === 0 ? 'lg:col-span-3' : ''
              }`}
            >
              {/* ⭐ RATING */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="text-lg"
                  >
                    {i < Math.floor(item.rating) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>

              {/* 💬 TESTIMONIAL TEXT */}
              <p className="text-gray-700 text-md leading-relaxed mb-6">
                {item.testimonial}
              </p>

              {/* 👤 CLIENT INFO */}
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {item.clientName}
                </p>
                {item.company && (
                  <p className="text-xs text-gray-600 mt-1">
                    {item.company}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}