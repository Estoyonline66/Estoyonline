"use client";
import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function ResultsPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Dil kontrolü
  const isTurkish = pathname.startsWith("/tr/");
  const t = (tr: string, en: string) => (isTurkish ? tr : en);

  const courseParam = searchParams.get("course");

  // "_" -> " " dönüştürüp ekranda gösterelim
 // const courseBase = courseParam ? courseParam.split("_")[0] : null;
  const courseReadable = courseParam ? courseParam.replace(/_/g, " ") : null;

  // Kurs linkleri (alt çizgili versiyon)
  const courseLinks: Record<string, string> = {
    "A1.1_başlangıç_kursu_Türkiye_ab1X": "https://buy.stripe.com/4gw28H6PG9Eq8ne8xi?prefilled_metadata[abx]=11",
    "A1.1_başlangıç_kursu_Yurtdışı_q9Z2": "https://buy.stripe.com/eVa5kTb5W7wi5b2bJq?prefilled_metadata[abx]=12",
    "A1.1_sabah_Türkiye_Xy7p": "https://buy.stripe.com/aFaeVc9kj7aDemH5fPdMI18?prefilled_metadata[abx]=4",
    "Üst_seviyeler_Türkiye_T6mQ": "https://buy.stripe.com/eVa4gPgqg4k6eLC00N?prefilled_metadata[abx]=10",
    "Üst_seviyeler_Yurtdışı_J8d4": "https://buy.stripe.com/dR614Db5W03Q46Y9Bh?prefilled_metadata[abx]=13",
    "Tamamlayıcı_kurs_Türkiye_w2Np": "https://buy.stripe.com/00gdRp2zqbMyeLC00Q?prefilled_metadata[abx]=9",
    "Tamamlayıcı_kurs_Yurtdışı_Lp5k": "https://buy.stripe.com/4gw7t13Du7wicDu5lb?prefilled_metadata[abx]=8",
    "Complementary_course_120_EUR_v7Qe": "https://buy.stripe.com/14AcN4aon2Un7YjaA9dMI1c?prefilled_metadata[abx]=2",
    "10_derslik_yetişkin_özel_ders_paketi_Az1R": "https://buy.stripe.com/14k7t11vmg2O5b28x8?prefilled_metadata[abx]=16",
    "5_derslik_yetişkin_özel_ders_paketi_Nm8t": "https://buy.stripe.com/14kcNlei84k6dHy14F?prefilled_metadata[abx]=15",
    "3_derslik_özel_ders_paketi_Gf4W": "https://buy.stripe.com/fZu6oG54352vbav8s1dMI1d?prefilled_metadata[abx]=1",
    "5_derslik_5_kişilik_özel_ders_paketi_Yr2P": "https://buy.stripe.com/7sY3cu0NN0MfguPdMldMI1a?prefilled_metadata[abx]=3",
    "5_derslik_2_kişilik_özel_ders_paketi_Zx9L": "https://buy.stripe.com/9AQdRp7TK9Eq1YQ9Bw?prefilled_metadata[abx]=6",
    "10_derslik_çocuk_özel_ders_paketi_Kd3U": "https://buy.stripe.com/6oE8x52zqeYKeLCeVU?prefilled_metadata[abx]=5",
    "5_derslik_çocuk_özel_ders_paketi_Hq7S": "https://buy.stripe.com/6oE14D2zq9Eqavm9Bs?prefilled_metadata[abx]=7",
    "Examen_Rt6B": "https://buy.stripe.com/9AQ9B9ca0eYKcDu00F?prefilled_metadata[abx]=14",
  };

  const isValidCourse = courseParam && courseLinks[courseParam];

  const handleContinue = () => {
    const trimmed = studentName.trim();
    const parts = trimmed.split(" ");

    if (parts.length < 2) {
      setError(t("Lütfen ad ve soyad giriniz.", "Please enter first and last name."));
      return;
    }

    const nameRegex = /^\p{L}+$/u; // Unicode harfler

    const firstName = parts[0];
    if (firstName.length < 3 || !nameRegex.test(firstName)) {
      setError(t("Ad en az 3 harften oluşmalı ve sayı içermemeli.", "First name must be at least 3 letters and contain no numbers."));
      return;
    }

    const lastName = parts.slice(1).join(" ");
    const lastWords = lastName.split(" ");
    for (const word of lastWords) {
      if (word.length < 3 || !nameRegex.test(word)) {
        setError(t("Soyad en az 3 harften oluşmalı ve sayı içermemeli.", "Last name must be at least 3 letters and contain no numbers."));
        return;
      }
    }

    setError("");

    if (isValidCourse) {
      const baseLink = courseLinks[courseParam!];
      const finalLink = baseLink.replace(
        /prefilled_metadata\[abx\]=[^&]+/,
        `prefilled_metadata[abx]=${encodeURIComponent(studentName)}`
      );
      window.location.href = finalLink;
    }
  };

  if (!isValidCourse) {
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
      {courseReadable && (
        <h2 className="text-lg font-semibold mb-2">{courseReadable}</h2>
      )}

 
	  <h1 className="text-xl font-bold mb-4"> {t("Lütfen öğrencinin adını yazın", "Please write student name")}</h1>

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
