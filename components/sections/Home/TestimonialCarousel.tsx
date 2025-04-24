"use client";
import React from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import Image from "next/image";

type Testimonial = {
  image: string;
  firstComment: string;
  lastComment: string;
  personName: string;
  timeAgo: string;
};

const TestimonialCarousel = () => {
  const { t } = useTranslation();
  // Eğer JSON’da home.testimonialsList yoksa bile [], map’i kırmaz
  const testimonials: Testimonial[] =
    t<Testimonial[]>("home.testimonialsList") || [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center mb-4">
            <Image
              src={testimonial.image}
              alt={testimonial.personName}
              width={60}
              height={60}
              className="rounded-full object-cover mr-4"
            />
            <div>
              <p className="font-semibold">{testimonial.personName}</p>
              <p className="text-sm text-gray-500">{testimonial.timeAgo}</p>
            </div>
          </div>
          <p className="text-gray-700">{testimonial.firstComment}</p>
        </div>
      ))}
    </div>
  );
};

export default TestimonialCarousel;
