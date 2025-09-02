"use client";

import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function PaymentPage() {
  const [studentName, setStudentName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isTurkish = pathname.startsWith("/tr/");
  const t = (tr: string, en: string) => (isTurkish ? tr : en);

  const courseParam = searchParams.get("course");

  const courseReadable = courseParam
    ? courseParam.replace(/_[^_]{4}$/, "").replace(/_/g, " ")
    : null;

  const handleContinue = async () => {
    const trimmed = studentName.trim();
    const parts = trimmed.split(" ");

    // Ad ve soyad doğrulaması
    if (parts.length < 2) {
      setError(t("Lütfen ad ve soyad giriniz.", "Please enter first and last name."));
      return;
    }

    const nameRegex = /^\p{L}+$/u;
    const firstName = parts[0];
    if (firstName.length < 2 || !nameRegex.test(firstName)) {
      setError(
        t(
          "Ad en az 2 harften oluşmalı ve sayı içermemeli.",
          "First name must be at least 2 letters and contain no numbers."
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
            "Soyad en az 3 harften oluşmalı ve sayı içermemeli.",
            "Last name must be at least 3 letters and contain no numbers."
          )
        );
        return;
      }
    }

    setError("");

    // API çağrısı
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, courseKey: courseParam }),
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
        {t("Lütfen öğrencinin adını yazın", "Please write student name")}
      </h1>

      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="border p-2 w-full rounded mb-2"
        placeholder={t("Öğrenci Adı", "Student Name")}
      />

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
