"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const course = searchParams.get("course"); // ?course=A11

  // Course -> Stripe Link eşleştirmesi
  const courseLinks: Record<string, string> = {
    "A1.1 başlangıç kursu Türkiye": "https://buy.stripe.com/4gw28H6PG9Eq8ne8xi?prefilled_metadata[abx]=11",
    "A1.1 başlangıç kursu Yurtdışı": "https://buy.stripe.com/eVa5kTb5W7wi5b2bJq?prefilled_metadata[abx]=12",
    "A1.1 sabah Türkiye": "https://buy.stripe.com/aFaeVc9kj7aDemH5fPdMI18?prefilled_metadata[abx]=4",
    "Üst seviyeler Türkiye": "https://buy.stripe.com/eVa4gPgqg4k6eLC00N?prefilled_metadata[abx]=10",
    "Üst seviyeler Yurtdışı": "https://buy.stripe.com/dR614Db5W03Q46Y9Bh?prefilled_metadata[abx]=13",
    "Tamamlayıcı kurs Türkiye": "https://buy.stripe.com/00gdRp2zqbMyeLC00Q?prefilled_metadata[abx]=9",
    "Tamamlayıcı kurs Yurtdışı": "https://buy.stripe.com/4gw7t13Du7wicDu5lb?prefilled_metadata[abx]=8",
    "Complementary course 120 EUR": "https://buy.stripe.com/14AcN4aon2Un7YjaA9dMI1c?prefilled_metadata[abx]=2",
    "10 derslik yetişkin özel ders paketi": "https://buy.stripe.com/14k7t11vmg2O5b28x8?prefilled_metadata[abx]=16",
    "5 derslik yetişkin özel ders paketi": "https://buy.stripe.com/14kcNlei84k6dHy14F?prefilled_metadata[abx]=15",
    "3 derslik özel ders paketi": "https://buy.stripe.com/fZu6oG54352vbav8s1dMI1d?prefilled_metadata[abx]=1",
    "5 derslik 5 kişilik özel ders paketi": "https://buy.stripe.com/7sY3cu0NN0MfguPdMldMI1a?prefilled_metadata[abx]=3",
    "5 derslik 2 kişilik özel ders paketi": "https://buy.stripe.com/9AQdRp7TK9Eq1YQ9Bw?prefilled_metadata[abx]=6",
    "10 derslik çocuk özel ders paketi": "https://buy.stripe.com/6oE8x52zqeYKeLCeVU?prefilled_metadata[abx]=5",
    "5 derslik çocuk özel ders paketi": "https://buy.stripe.com/6oE14D2zq9Eqavm9Bs?prefilled_metadata[abx]=7",
    "Examen": "https://buy.stripe.com/9AQ9B9ca0eYKcDu00F?prefilled_metadata[abx]=14",
  };

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

    if (course && courseLinks[course]) {
      // Orijinal linki al
      const baseLink = courseLinks[course];
      // Prefilled metadata'yı değiştir → öğrenci adı girilecek
      const finalLink = baseLink.replace(/prefilled_metadata\[abx\]=[^&]+/, `prefilled_metadata[abx]=${encodeURIComponent(studentName)}`);
      window.location.href = finalLink; // Stripe yönlendirme
    } else {
      setError("Geçersiz veya tanımsız kurs seçildi.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {course && <h2 className="text-lg font-semibold mb-2">{course}</h2>}

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
