"use client";
import { useState } from "react";

export default function ResultsPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const trimmed = studentName.trim();

    // Ad ve soyadı ayır
    const parts = trimmed.split(" ");

    if (parts.length < 2) {
      setError("Lütfen ad ve soyad giriniz.");
      return;
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    // Kurallar:
    // 1. Ad en az 3 karakter olmalı
    // 2. Soyad en az 3 karakter olmalı
    // 3. Ad ve soyad sadece harflerden oluşmalı (numerik karakter olmamalı)
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
    alert(`Devam ediliyor: ${firstName} ${lastName}`);
    // Burada yönlendirme veya başka işlem yapılabilir
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Lütfen öğrencinin adını yazınız.</h1>

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
