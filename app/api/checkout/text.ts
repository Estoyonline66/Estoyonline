export interface CourseInfo {
  name: string;
  amount: number; // kuruş/cent cinsinden
  currency: string;
}

export const courseMap: Record<string, CourseInfo> = {
  // Grupales
  "A1.1_başlangıç_kursu_Türkiye_ab1X": { name: "A1.1 Başlangıç (Türkiye)", amount: 798000, currency: "try" },
  "A1.1_başlangıç_kursu_Yurtdışı_q9Z2": { name: "A1.1 Başlangıç (Yurtdışı)", amount: 19000, currency: "eur" },
  "A1.1_sabah_Türkiye_Xy7p": { name: "A1.1 Sabah (Türkiye)", amount: 660000, currency: "try" },
  "Üst_seviyeler_Türkiye_T6mQ": { name: "Üst Seviyeler (Türkiye)", amount: 612000, currency: "try" },
  "Üst_seviyeler_indirimli_Türkiye_D7k2": { name: "Üst Seviyeler İndirimli (Türkiye)", amount: 460000, currency: "try" },
  "Üst_seviyeler_Yurtdışı_J8d4": { name: "Üst Seviyeler (Yurtdışı)", amount: 14500, currency: "eur" },
  "Tamamlayıcı_kurs_Türkiye_w2Np": { name: "Tamamlayıcı Kurs (Türkiye)", amount: 318000, currency: "try" },
  "Tamamlayıcı_kurs_Yurtdışı_Lp5k": { name: "Tamamlayıcı Kurs (Yurtdışı)", amount: 9000, currency: "eur" },
  "Complementary_course_ext_v7Qe": { name: "Complementary Course", amount: 12000, currency: "eur" },
  "Upper_level_courses_ext_R82e": { name: "Upper level courses", amount: 19000, currency: "eur" },
  "Examen_Rt6B": { name: "Examen", amount: 1500, currency: "eur" },



  "10_derslik_özel_ders_paketi_Az1R": { name: "Özel Ders (1 kişi, 10 ders)", amount: 22000, currency: "eur" },
  "5_derslik_özel_ders_paketi_Nm8t": { name: "Özel Ders (1 kişi, 5 ders)", amount: 11000, currency: "eur" },
  "10_derslik_2_kişilik_grup_A1b2": { name: "Özel Ders (2 kişi, 10 ders)", amount: 30000, currency: "eur" },
  "5_derslik_2_kişilik_özel_ders_paketi_Zx9L": { name: "Özel Ders (2 kişi, 5 ders)", amount: 15000, currency: "eur" },
  "10_derslik_3_kişilik_grup_C3d4": { name: "Özel Ders (3 kişi, 10 ders)", amount: 36000, currency: "eur" },
  "5_derslik_3_kişilik_grup_E5f6": { name: "Özel Ders (3 kişi, 5 ders)", amount: 18000, currency: "eur" },
  "10_derslik_4_kişilik_grup_G7h8": { name: "Özel Ders (4 kişi, 10 ders)", amount: 41000, currency: "eur" },
  "5_derslik_4_kişilik_grup_I9j0": { name: "Özel Ders (4 kişi, 5 ders)", amount: 20500, currency: "eur" },
  "10_derslik_5_kişilik_grup_Lm3N": { name: "Özel Ders (5 kişi, 10 ders)", amount: 45000, currency: "eur" },
  "5_derslik_5_kişilik_özel_ders_paketi_Yr2P": { name: "Özel Ders (5 kişi, 5 ders)", amount: 1122500, currency: "eur" },
};

export const PRICES_BLOB_URL = "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/checkout/prices.json";

export async function getCourseMap(): Promise<Record<string, CourseInfo>> {
  try {
    const res = await fetch(`${PRICES_BLOB_URL}?_ts=${Date.now()}`, { 
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" } 
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.warn("⚠️ Failed to fetch prices from Blob, using fallback:", error);
  }
  return courseMap;
}
