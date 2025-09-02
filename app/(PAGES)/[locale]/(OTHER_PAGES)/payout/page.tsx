"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { courseMap } from "../api/checkout/text";  // doğru yola dikkat

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const courseKey = searchParams.get("course") || "";

  const course = courseMap[courseKey];
  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-600 font-semibold">
          Geçersiz kurs
        </p>
      </div>
    );
  }

  const [studentNames, setStudentNames] = useState<string[]>([]);

  useEffect(() => {
    setStudentNames(Array(course.participantCount).fill(""));
  }, [course.participantCount]);

  const handleChange = (i: number, val: string) => {
    const arr = [...studentNames];
    arr[i] = val;
    setStudentNames(arr);
  };

  const placeholder = course.participantCount > 1
    ? "Lütfen öğrencilerin adını yazın"
    : "Lütfen öğrencinin adını yazın";

  const handleContinue = async () => {
    // validation & API çağrısı
    // ...
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-lg font-semibold mb-2">{course.name}</h2>
      {studentNames.map((v, i) => (
        <input
          key={i}
          type="text"
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder={`${placeholder}${course.participantCount > 1 ? ` (${i + 1})` : ""}`}
        />
      ))}
      <button onClick={handleContinue} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Ödeme işlemini başlat
      </button>
    </div>
  );
}
