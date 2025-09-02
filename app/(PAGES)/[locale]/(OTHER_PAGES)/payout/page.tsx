"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const courseMap: Record<
  string,
  { name: string; amount: number; currency: string; participants: number }
> = {
  "10_derslik_yetişkin_özel_ders_paketi_Az1R": {
    name: "Özel Ders (1 yetişkin, 10 ders)",
    amount: 22000,
    currency: "eur",
    participants: 1,
  },
  "10_derslik_2_kişilik_grup_A1b2": {
    name: "Özel Ders (2 yetişkin, 10 ders)",
    amount: 30000,
    currency: "eur",
    participants: 2,
  },
  "10_derslik_3_kişilik_grup_C3d4": {
    name: "Özel Ders (3 yetişkin, 10 ders)",
    amount: 36000,
    currency: "eur",
    participants: 3,
  },
  "10_derslik_çocuk_özel_ders_paketi_Kd3U": {
    name: "Özel Ders (1 çocuk, 10 ders)",
    amount: 17000,
    currency: "eur",
    participants: 1,
  },
  "10_derslik_2_çocuk_grup_Bb7N": {
    name: "Özel Ders (2 çocuk, 10 ders)",
    amount: 24000,
    currency: "eur",
    participants: 2,
  },
  // ... diğer kurslar
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const courseKey = searchParams.get("course") || "";
  const course = courseMap[courseKey];
  const participants = course?.participants || 1;

  const [studentNames, setStudentNames] = useState<string[]>([]);

  useEffect(() => {
    setStudentNames(Array(participants).fill("")); // öğrenci sayısı kadar boş input
  }, [participants]);

  const handleNameChange = (index: number, value: string) => {
    const updated = [...studentNames];
    updated[index] = value;
    setStudentNames(updated);
  };

  const placeholder =
    participants === 1
      ? "Lütfen öğrencinin adını yazın"
      : "Lütfen öğrencilerin adını yazın";

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentNames, courseKey }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div>
      <h1>{course?.name || "Geçersiz kurs"}</h1>
      {studentNames.map((name, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`${placeholder} (${idx + 1})`}
          value={name}
          onChange={(e) => handleNameChange(idx, e.target.value)}
        />
      ))}
      <button onClick={handleCheckout}>Stripe ile Öde</button>
    </div>
  );
}
