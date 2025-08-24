"use client";
import { useState } from "react";

export default function ResultsPage() {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    // Kontrol: en az 3 karakterli ad ve soyad içermeli
    const parts = studentName.trim().split(" ");
    if (
      studentName.trim().length < 3 ||
      parts.length < 2 ||
      parts.some((p) => p.length < 2)
    ) {
      setError("Lütfen geçerli bir ad ve soyad giriniz.");
      return;
    }

    setError("");
    alert(`Devam ediliyor: ${studentName}`);
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
