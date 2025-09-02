"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function PaymentPage() {
  const [studentNames, setStudentNames] = useState<string[]>([]);
  const [requiredStudents, setRequiredStudents] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isTurkish = pathname.startsWith("/tr/");
  const t = (tr: string, en: string) => (isTurkish ? tr : en);

  const courseParam = searchParams.get("course");

  const courseReadable = courseParam
    ? courseParam.replace(/_[^_]{4}$/, "").replace(/_/g, " ")
    : null;

  // backend'den öğrenci sayısını çek
  useEffect(() => {
    const fetchCourseInfo = async () => {
      if (!courseParam) return;
      try {
        const res = await fetch(`/api/checkout/info?course=${courseParam}`);
        const data = await res.json();
        if (data.studentCount) {
          setRequiredStudents(data.studentCount);
          setStudentNames(Array(data.studentCount).fill(""));
        }
      } catch (err) {
        console.error("Course info fetch error:", err);
      }
    };
    fetchCourseInfo();
  }, [courseParam]);

  const handleNameChange = (index: number, value: string) => {
    const updated = [...studentNames];
    updated[index] = value;
    setStudentNames(updated);
  };

  const handleContinue = async () => {
    const nameRegex = /^\p{L}+$/u;

    // tüm isimler kontrol edilecek
    for (let i = 0; i < requiredStudents; i++) {
      const trimmed = (studentNames[i] || "").trim();
      const parts = trimmed.split(" ");

      if (parts.length < 2) {
        setError(
          t(
            `Öğrenci ${i + 1}: Lütfen ad ve soyad giriniz.`,
            `Student ${i + 1}: Please enter first and last name.`
          )
        );
        return;
      }

      const firstName = parts[0];
      if (firstName.length < 2 || !nameRegex.test(firstName)) {
        setError(
          t(
            `Öğrenci ${i + 1}: Ad en az 2 harf olmalı ve sayı içermemeli.`,
            `Student ${i + 1}: First name must be at least 2 letters and contain no numbers.`
          )
        );
        return;
      }

      const lastName = parts.slice(1).join(" ");
      const lastWords = lastName.split(" ");
      for (const word of lastWords) {
        if (word.length < 3 || !nameRegex.test(word)) {
          setError(
            t(
              `Öğrenci ${i + 1}: Soyad en az 3 harf olmalı ve sayı içermemeli.`,
              `Student ${i + 1}: Last name must be at least 3 letters and contain no numbers.`
            )
          );
          return;
        }
      }
    }

    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNames, courseKey: courseParam }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t("Payment link oluşturulamadı.", "Payment link could not be created."));
      }
    } catch (err) {
      console.error(err);
      setError(t("Bir hata oluştu.", "An error occurred."));
    }
  };

  if (!courseParam) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-600 font-semibold">
          {t("Geçersiz kurs linki", "Invalid course link")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {courseReadable && <h2 className="text-lg font-semibold mb-2">{courseReadable}</h2>}

      <h1 className="text-xl font-bold mb-4">
        {t("Lütfen öğrenci(ler)in adını yazın", "Please write student name(s)")}
      </h1>

      {/* kişi sayısı kadar input alanı */}
      {Array.from({ length: requiredStudents }, (_, i) => (
        <input
          key={i}
          type="text"
          value={studentNames[i] || ""}
          onChange={(e) => handleNameChange(i, e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder={t(`Öğrenci ${i + 1} Adı`, `Student ${i + 1} Name`)}
        />
      ))}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleContinue}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {t("Ödeme işlemine devam et", "Continue Payment")}
      </button>
    </div>
  );
}
