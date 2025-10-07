"use client";

import React, { useState } from "react";

export default function InitializeCourses() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInitialize = async () => {
    if (!confirm("⚠️ Bu işlem blob üzerindeki mevcut verileri silecektir. Devam etmek istiyor musunuz?")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/courses/init", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Başlangıç verisi yüklenemedi.");

      setMessage(data.message || "✅ Başlangıç verisi yüklendi.");
    } catch (err: any) {
      setMessage(`❌ Hata: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-5">Iniciar Cursos - Blob</h1>
      <p className="mb-5 text-sm text-gray-600">
        Bu işlem blob üzerindeki mevcut kurs verilerini silecek ve başlangıç datasını yükleyecektir.
      </p>
      <button
        onClick={handleInitialize}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Yükleniyor..." : "Veriyi Yükle"}
      </button>
      {message && <p className="mt-5 text-sm">{message}</p>}
    </div>
  );
}
