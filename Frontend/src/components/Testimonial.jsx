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
    <section className="space-y-8">
      {testimonials.map((item) => (
        <div
          key={item._id}
          className="p-6 border rounded-lg space-y-3"
        >
          {/* ⭐ RATING FIRST */}
          <div className="flex">
            {Array.from({ length: Math.floor(item.rating) }).map((_, i) => (
              <span key={i}>⭐</span>
            ))}
            {item.rating % 1 !== 0 && <span>⭐½</span>}
          </div>

          {/* 💬 TESTIMONIAL TEXT */}
          <p className="text-gray-700 italic">
            “{item.testimonial}”
          </p>

          {/* 👤 CLIENT NAME + COMPANY */}
          <p className="font-semibold">
            {item.clientName}
            {item.company && (
              <span className="text-gray-500">
                {" "}
                ({item.company})
              </span>
            )}
          </p>
        </div>
      ))}
    </section>
  );
}
