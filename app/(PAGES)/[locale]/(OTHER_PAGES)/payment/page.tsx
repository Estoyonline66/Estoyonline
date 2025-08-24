"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course"); // ?course=...
  const courseBase = courseParam ? courseParam.split("_")[0] : null;

  // Anahtar içeren kurs listesi
  const courseLinks: Record<string, string> = {
    "A1.1 başlangıç kursu Türkiye_ab1X":
      "https://buy.stripe.com/4gw28H6PG9Eq8ne8xi?prefilled_metadata[abx]=11",
    "A1.1 başlangıç kursu Yurtdışı_q9Z2":
      "https://buy.stripe.com/eVa5kTb5W7wi5b2bJq?prefilled_metadata[abx]=12",
    "A1.1 sabah Türkiye_Xy7p":
      "https://buy.stripe.com/aFaeVc9kj7aDemH5fPdMI18?prefilled_metadata[abx]=4",
    "Üst seviyeler Türkiye_T6mQ":
      "https://buy.stripe.com/eVa4gPgqg4k6eLC00N?prefilled_metadata[abx]=10",
    "Üst seviyeler Yurtdışı_J8d4":
      "https://buy.stripe.com/dR614Db5W03Q46Y9Bh?prefilled_metadata[abx]=13",
    "Tamamlayıcı kurs Türkiye_w2Np":
      "https://buy.stripe.com/00gdRp2zqbMyeLC00Q?prefilled_metadata[abx]=9",
    "Tamamlayıcı kurs Yurtdışı_Lp5k":
      "https://buy.stripe.com/4gw7t13Du7wicDu5lb?prefilled_metadata[abx]=8",
    "Complementary course 120 EUR_v7Qe":
      "https://buy.stripe.com/14AcN4aon2Un7YjaA9dMI1c?prefilled_metadata[abx]=2",
    "10 derslik yetişkin özel ders paketi_Az1R":
      "https://buy.stripe.com/14k7t11vmg2O5b28x8?prefilled_metadata[abx]=16",
    "5 derslik yetişkin özel ders paketi_Nm8t":
      "https://buy.stripe.com/14kcNlei84k6dHy14F?prefilled_metadata[abx]=15",
    "3 derslik özel ders paketi_Gf4W":
      "https://buy.stripe.com/fZu6oG54352vbav8s1dMI1d?prefilled_metadata[abx]=1",
    "5 derslik 5 kişilik özel ders paketi_Yr2P":
      "https://buy.stripe.com/7sY3cu0NN0MfguPdMldMI1a?prefilled_metadata[abx]=3",
    "5 derslik 2 kişilik özel ders paketi_Zx9L":
      "https://buy.stripe.com/9AQdRp7TK9Eq1YQ9Bw?prefilled_metadata[abx]=6",
    "10 derslik çocuk özel ders paketi_Kd3U":
      "https://buy.stripe.com/6oE8x52zqeYKeLCeVU?prefilled_metadata[abx]=5",
    "5 derslik çocuk özel ders paketi_Hq7S":
      "https://buy.stripe.com/6oE14D2zq9Eqavm9Bs?prefilled_metadata[abx]=7",
    "Examen_Rt6B":
      "https://buy.stripe.com/9AQ9B9ca0eYKcDu00F?prefilled_metadata[abx]=14",
  };

  const isValidCourse = courseParam && courseLinks[courseParam];

  const handleContinue = () => {
    const trimmed = studentName.trim();
    const parts = trimmed.split(" ");

    if (parts.length < 2) {
      setError("Lütfen ad ve soyad giriniz.");
      return;
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    const nameRegex = /^[A-Za-zÇçĞğİıÖöŞşÜü]+$/u;

    if (firstName.length < 3 || !nameRegex.test(firstName)) {
      setError("Ad en az 3 harften oluşmalı ve sayı içermemeli.");
      return;
    }

    if (lastName.length < 3 || !nameRegex.test(lastName)) {
      setError("Soyad en az 3 harften oluşmalı ve sayı içermemeli.");
      return;
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
        <p className="text-red-600 font-semibold">Geçersiz kurs linki</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {courseBase && (
        <h2 className="text-lg font-semibold mb-2">{courseBase}</h2>
      )}

      <h1 className="text-xl font-bold mb-4">
        Lütfen öğrencinin adını yazınız.
      </h1>

      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="border p-2 w-full rounded mb-2"
        placeholder="Ad Soyad"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleContinue}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Devam Et
      </button>
    </div>
  );
}
