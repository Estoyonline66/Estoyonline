"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function PaymentPage() {
  const [studentNames, setStudentNames] = useState<string[]>([""]);
  const [error, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isTurkish = pathname.startsWith("/tr/");

  const courseParam = searchParams.get("course");
  const status = searchParams.get("status"); // success veya cancel

  const courseReadable = courseParam
    ? courseParam.replace(/_[^_]{4}$/, "").replace(/_/g, " ")
    : null;

  // Eğer Examen_Rt6B ise her şey İspanyolca olacak
  const isExamen = courseParam === "Examen_Rt6B";

  const t = (tr: string, en: string) => {
    if (isExamen) return ""; // t() fonksiyonu devre dışı
    return isTurkish ? tr : en;
  };

  // durum mesajı
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  useEffect(() => {
    if (status === "success") {
      setStatusMessage(
        isExamen
          ? "Su pago ha sido recibido, gracias"
          : t("Ödemeniz alınmıştır. Teşekkürler", "Your payment has been received, thank you")
      );
    } else if (status === "cancel") {
      setStatusMessage(
        isExamen
          ? "Pago cancelado"
          : null
      );
    }
  }, [status]);

  const getRequiredStudents = () => {
    if (!courseParam) return 1;
    if (courseParam.includes("2_kişilik") || courseParam.includes("2_çocuk")) return 2;
    if (courseParam.includes("3_kişilik") || courseParam.includes("3_çocuk")) return 3;
    if (courseParam.includes("4_kişilik")) return 4;
    if (courseParam.includes("5_kişilik")) return 5;
    return 1;
  };
  const requiredStudents = getRequiredStudents();

  const handleNameChange = (index: number, value: string) => {
    const updated = [...studentNames];
    updated[index] = value;
    setStudentNames(updated);
  };

  const handleContinue = async () => {
    const nameRegex = /^\p{L}+$/u;

    for (let i = 0; i < requiredStudents; i++) {
      const trimmed = (studentNames[i] || "").trim();
      const parts = trimmed.split(" ");
      if (parts.length < 2) {
        setError(
          isExamen
            ? `Estudiante ${i + 1}: por favor ingrese nombre y apellido`
            : t(
                `Öğrenci ${i + 1}: Lütfen ad ve soyad giriniz.`,
                `Student ${i + 1}: Please enter first and last name.`
              )
        );
        return;
      }
      const firstName = parts[0];
      if (firstName.length < 2 || !nameRegex.test(firstName)) {
        setError(
          isExamen
            ? `Estudiante ${i + 1}: el nombre debe tener al menos 2 letras y sin números`
            : t(
                `Öğrenci ${i + 1}: Ad en az 2 harf olmalı ve sayı içermemeli.`,
                `Student ${i + 1}: First name must be at least 2 letters and contain no numbers.`
              )
        );
        return;
      }
      const lastName = parts.slice(1).join(" ");
      for (const word of lastName.split(" ")) {
        if (word.length < 3 || !nameRegex.test(word)) {
          setError(
            isExamen
              ? `Estudiante ${i + 1}: el apellido debe tener al menos 3 letras y sin números`
              : t(
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
        body: JSON.stringify({
          studentNames,
          courseKey: courseParam,
          locale: isExamen ? "es" : isTurkish ? "tr" : "en",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else
        setError(
          isExamen
            ? "No se pudo crear el enlace de pago"
            : t("Payment link oluşturulamadı.", "Payment link could not be created.")
        );
    } catch {
      setError(isExamen ? "Ocurrió un error" : t("Bir hata oluştu.", "An error occurred."));
    }
  };

  if (!courseParam)
    return <p>{isExamen ? "Enlace de curso inválido" : t("Geçersiz kurs linki", "Invalid course link")}</p>;

  return (
    <div className="container mx-auto p-6">
      {statusMessage && <h2 className="text-2xl font-bold mb-4 text-green-600">{statusMessage}</h2>}
      {courseReadable && <h2 className="text-lg font-semibold mb-2">{courseReadable}</h2>}
      <h1 className="text-xl font-bold mb-4">
        {isExamen
          ? "Por favor escriba el nombre del estudiante"
          : t(
              requiredStudents === 1 ? "Lütfen öğrencinin adını yazın" : "Lütfen öğrenci(ler)in adını yazın",
              requiredStudents === 1 ? "Please write student name" : "Please write student name(s)"
            )}
      </h1>

      {Array.from({ length: requiredStudents }, (_, i) => (
        <input
          key={i}
          type="text"
          value={studentNames[i] || ""}
          onChange={(e) => handleNameChange(i, e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder={
            isExamen
              ? `Nombre del estudiante ${i + 1}`
              : t(
                  requiredStudents === 1 ? "Öğrenci Adı" : `Öğrenci ${i + 1} Adı`,
                  requiredStudents === 1 ? "Student Name" : `Student ${i + 1} Name`
                )
          }
        />
      ))}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleContinue}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isExamen ? "Continuar con el pago" : t("Ödeme işlemine devam et", "Continue Payment")}
      </button>
    </div>
  );
}
