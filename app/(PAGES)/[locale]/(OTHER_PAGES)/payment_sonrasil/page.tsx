"use client";
import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function PaymentPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Dil kontrolü
  const isTurkish = pathname.startsWith("/tr/");
  const t = (tr: string, en: string) => (isTurkish ? tr : en);

  const courseParam = searchParams.get("course");

  // Kurs adını gösterme (son 4 karakterli anahtar ve "_" kaldır)
  const courseReadable = courseParam
    ? courseParam.replace(/_[^_]{4}$/, "").replace(/_/g, " ")
    : null;

  // Kurs linkleri (base URL, içinde metadata olmayacak artık)
  const courseLinks: Record<string, string> = {
    "A1.1_başlangıç_kursu_Türkiye_ab1X": "https://buy.stripe.com/4gw28H6PG9Eq8ne8xi",
    "A1.1_başlangıç_kursu_Yurtdışı_q9Z2": "https://buy.stripe.com/eVa5kTb5W7wi5b2bJq",
    "A1.1_sabah_Türkiye_Xy7p": "https://buy.stripe.com/aFaeVc9kj7aDemH5fPdMI18",
    "Üst_seviyeler_Türkiye_T6mQ": "https://buy.stripe.com/bJe14meEDamP2DZgYxdMI1o",
    "Üst_seviyeler_Yurtdışı_J8d4": "https://buy.stripe.com/dR614Db5W03Q46Y9Bh",
    "Tamamlayıcı_kurs_Türkiye_w2Np": "https://buy.stripe.com/00w9AS8gf3YrbaveQpdMI1p",
    "Tamamlayıcı_kurs_Yurtdışı_Lp5k": "https://buy.stripe.com/5kQbJ07cbdz14M723DdMI1q",
    "Complementary_course_120_EUR_v7Qe": "https://buy.stripe.com/14AcN4aon2Un7YjaA9dMI1c",
    "10_derslik_yetişkin_özel_ders_paketi_Az1R": "https://buy.stripe.com/14k7t11vmg2O5b28x8",
    "5_derslik_yetişkin_özel_ders_paketi_Nm8t": "https://buy.stripe.com/14kcNlei84k6dHy14F",
    "3_derslik_özel_ders_paketi_Gf4W": "https://buy.stripe.com/fZu6oG54352vbav8s1dMI1d",
    "5_derslik_5_kişilik_özel_ders_paketi_Yr2P": "https://buy.stripe.com/7sY3cu0NN0MfguPdMldMI1a",
    "5_derslik_2_kişilik_özel_ders_paketi_Zx9L": "https://buy.stripe.com/9AQdRp7TK9Eq1YQ9Bw",
    "10_derslik_çocuk_özel_ders_paketi_Kd3U": "https://buy.stripe.com/6oE8x52zqeYKeLCeVU",
    "5_derslik_çocuk_özel_ders_paketi_Hq7S": "https://buy.stripe.com/6oE14D2zq9Eqavm9Bs",
    "Examen_Rt6B": "https://buy.stripe.com/fZu00i9kj1Qjcez37HdMI1n",
    "10_derslik_2_kişilik_grup_A1b2": "https://buy.stripe.com/3cI9AScwveD5fqLbEddMI1f",
    "10_derslik_3_kişilik_grup_C3d4": "https://buy.stripe.com/aFabJ0cwv1Qj4M70ZzdMI1g",
    "5_derslik_3_kişilik_grup_E5f6": "https://buy.stripe.com/bJe14m0NN52v3I36jTdMI1h",
    "10_derslik_4_kişilik_grup_G7h8": "https://buy.stripe.com/3cIbJ0gML8eH3I39w5dMI1i",
    "5_derslik_4_kişilik_grup_I9j0": "https://buy.stripe.com/3cI00i1RRgLdbaveQpdMI1j",
    "10_derslik_5_kişilik_grup_K1l2": "https://buy.stripe.com/bJe7sK7cbdz17YjbEddMI1k",
  };

  const isValidCourse = courseParam && courseLinks[courseParam];

  const handleContinue = () => {
    const trimmed = studentName.trim();
    const parts = trimmed.split(" ");

    if (parts.length < 2) {
      setError(t("Lütfen ad ve soyad giriniz.", "Please enter first and last name."));
      return;
    }

    const nameRegex = /^\p{L}+$/u;

    const firstName = parts[0];
    if (firstName.length < 2 || !nameRegex.test(firstName)) {
      setError(t("Ad en az 2 harften oluşmalı ve sayı içermemeli.", "First name must be at least 3 letters and contain no numbers."));
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
      // client_reference_id parametresini ekle
      const finalLink = `${baseLink}?client_reference_id=${encodeURIComponent(studentName)}`;
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
