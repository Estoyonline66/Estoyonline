"use client";
import React from "react";
//import { useTranslation } from "@/lib/i18n";
import { useTranslation } from "@/contexts/TranslationProvider";
import Image from "next/image";

const TestimonialCarousel = () => {
  const { t } = useTranslation();
  const testimonials = t("home.testimonialsList");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {testimonials.map((testimonial: any, index: number) => (
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