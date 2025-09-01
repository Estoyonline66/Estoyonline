"use client";

import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Stripe from "stripe";

// ✅ Server Action aynı dosyada
async function createCheckout(studentName: string, courseKey: string) {
  "use server";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
  });

  // Kurs eşleştirme (örnek fiyatlar! kendi fiyatlarını güncelle)
  const courseMap: Record<string, { name: string; amount: number; currency: string }> = {
    "A1.1_başlangıç_kursu_Türkiye_ab1X": { name: "A1.1 Başlangıç (Türkiye)", amount: 50000, currency: "try" },
    "A1.1_başlangıç_kursu_Yurtdışı_q9Z2": { name: "A1.1 Başlangıç (Yurtdışı)", amount: 12000, currency: "eur" },
    "A1.1_sabah_Türkiye_Xy7p": { name: "A1.1 Sabah (Türkiye)", amount: 45000, currency: "try" },
    "Üst_seviyeler_Türkiye_T6mQ": { name: "Üst Seviyeler (Türkiye)", amount: 60000, currency: "try" },
    "Üst_seviyeler_Yurtdışı_J8d4": { name: "Üst Seviyeler (Yurtdışı)", amount: 15000, currency: "eur" },
    "Tamamlayıcı_kurs_Türkiye_w2Np": { name: "Tamamlayıcı Kurs (Türkiye)", amount: 30000, currency: "try" },
    "Tamamlayıcı_kurs_Yurtdışı_Lp5k": { name: "Tamamlayıcı Kurs (Yurtdışı)", amount: 9000, currency: "eur" },
    "Complementary_course_120_EUR_v7Qe": { name: "Complementary Course", amount: 12000, currency: "eur" },
    "10_derslik_yetişkin_özel_ders_paketi_Az1R": { name: "10 Derslik Yetişkin Özel Ders", amount: 100000, currency: "try" },
    "5_derslik_yetişkin_özel_ders_paketi_Nm8t": { name: "5 Derslik Yetişkin Özel Ders", amount: 55000, currency: "try" },
    "3_derslik_özel_ders_paketi_Gf4W": { name: "3 Derslik Özel Ders", amount: 35000, currency: "try" },
    "5_derslik_5_kişilik_özel_ders_paketi_Yr2P": { name: "5 Derslik 5 Kişilik Özel Ders", amount: 70000, currency: "try" },
    "5_derslik_2_kişilik_özel_ders_paketi_Zx9L": { name: "5 Derslik 2 Kişilik Özel Ders", amount: 60000, currency: "try" },
    "10_derslik_çocuk_özel_ders_paketi_Kd3U": { name: "10 Derslik Çocuk Özel Ders", amount: 90000, currency: "try" },
    "5_derslik_çocuk_özel_ders_paketi_Hq7S": { name: "5 Derslik Çocuk Özel Ders", amount: 50000, currency: "try" },
    "Examen_Rt6B": { name: "Examen", amount: 20000, currency: "eur" },
    "10_derslik_2_kişilik_grup_A1b2": { name: "10 Derslik 2 Kişilik Grup", amount: 80000, currency: "try" },
    "10_derslik_3_kişilik_grup_C3d4": { name: "10 Derslik 3 Kişilik Grup", amount: 90000, currency: "try" },
    "5_derslik_3_kişilik_grup_E5f6": { name: "5 Derslik 3 Kişilik Grup", amount: 50000, currency: "try" },
    "10_derslik_4_kişilik_grup_G7h8": { name: "10 Derslik 4 Kişilik Grup", amount: 95000, currency: "try" },
    "5_derslik_4_kişilik_grup_I9j0": { name: "5 Derslik 4 Kişilik Grup", amount: 55000, currency: "try" },
    "10_derslik_5_kişilik_grup_K1l2": { name: "10 Derslik 5 Kişilik Grup", amount: 100000, currency: "try" },
  };

  const course = courseMap[courseKey];
  if (!course) return null;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: course.currency,
          product_data: { name: course.name },
          unit_amount: course.amount,
        },
        quantity: 1,
      },
    ],
    success_url: `https://estoyonline.es?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://estoyonline.es?cancel=1`,
    custom_fields: [
      {
        key: "student_name",
        label: { type: "custom", custom: "Öğrenci Adı" },
        type: "text",
        optional: false,
      },
    ],
    metadata: {
      courseKey,
      studentName,
    },
  });

  return session.url;
}

export default function PayoutPage() {
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
    if (!courseParam) {
      setError("Geçersiz kurs seçimi.");
      return;
    }

    const trimmed = studentName.trim();
    if (trimmed.length < 3) {
      setError(t("Lütfen geçerli bir öğrenci adı giriniz.", "Please enter a valid student name."));
      return;
    }

    setError("");

    try {
      const url = await createCheckout(trimmed, courseParam);
      if (url) {
        window.location.href = url;
      } else {
        setError("Ödeme linki oluşturulamadı.");
      }
    } catch (err) {
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
