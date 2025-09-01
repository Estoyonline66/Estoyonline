"use client";
import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function PaymentPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

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

    if (parts.length < 2) {
      setError(t("Lütfen ad ve soyad giriniz.", "Please enter first and last name."));
      return;
    }

    setError("");

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
        setError("Payment link oluşturulamadı.");
      }
    } catch (err) {
	console.error(err); // hatayı logla
      setError("Bir hata oluştu.");
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
