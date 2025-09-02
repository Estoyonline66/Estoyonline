// app/api/checkout/text.ts

export interface CourseInfo {
  name: string;
  amount: number;
  currency: string;
}

export const courseMap: Record<string, CourseInfo> = {
  "A1.1_başlangıç_kursu_Türkiye_ab1X": { name: "A1.1 Başlangıç (Türkiye)", amount: 670000, currency: "try" },
  "A1.1_başlangıç_kursu_Yurtdışı_q9Z2": { name: "A1.1 Başlangıç (Yurtdışı)", amount: 19000, currency: "eur" },
  "A1.1_sabah_Türkiye_Xy7p": { name: "A1.1 Sabah (Türkiye)", amount: 550000, currency: "try" },
  "Üst_seviyeler_Türkiye_T6mQ": { name: "Üst Seviyeler (Türkiye)", amount: 510000, currency: "try" },
  "Üst_seviyeler_Yurtdışı_J8d4": { name: "Üst Seviyeler (Yurtdışı)", amount: 14500, currency: "eur" },
  "Tamamlayıcı_kurs_Türkiye_w2Np": { name: "Tamamlayıcı Kurs (Türkiye)", amount: 265000, currency: "try" },
  "Tamamlayıcı_kurs_Yurtdışı_Lp5k": { name: "Tamamlayıcı Kurs (Yurtdışı)", amount: 9000, currency: "eur" },
  "Complementary_course_120_EUR_v7Qe": { name: "Complementary Course", amount: 12000, currency: "eur" },
  "Examen_Rt6B": { name: "Examen", amount: 1500, currency: "eur" },

  // Özel dersler – yetişkin
  "10_derslik_yetişkin_özel_ders_paketi_Az1R": { name: "Özel Ders (1 yetişkin, 10 ders)", amount: 22000, currency: "eur" },
  "5_derslik_yetişkin_özel_ders_paketi_Nm8t": { name: "Özel Ders (1 yetişkin, 5 ders)", amount: 11000, currency: "eur" },
  "10_derslik_2_kişilik_grup_A1b2": { name: "Özel Ders (2 yetişkin, 10 ders)", amount: 30000, currency: "eur" },
  "5_derslik_2_kişilik_özel_ders_paketi_Zx9L": { name: "Özel Ders (2 yetişkin, 5 ders)", amount: 15000, currency: "eur" },
  "10_derslik_3_kişilik_grup_C3d4": { name: "Özel Ders (3 yetişkin, 10 ders)", amount: 36000, currency: "eur" },
  "5_derslik_3_kişilik_grup_E5f6": { name: "Özel Ders (3 yetişkin, 5 ders)", amount: 18000, currency: "eur" },
  "10_derslik_4_kişilik_grup_G7h8": { name: "Özel Ders (4 yetişkin, 10 ders)", amount: 41000, currency: "eur" },
  "5_derslik_4_kişilik_grup_I9j0": { name: "Özel Ders (4 yetişkin, 5 ders)", amount: 20500, currency: "eur" },
  "10_derslik_5_kişilik_grup_Lm3N": { name: "Özel Ders (5 yetişkin, 10 ders)", amount: 45000, currency: "eur" },
  "5_derslik_5_kişilik_özel_ders_paketi_Yr2P": { name: "Özel Ders (5 yetişkin, 5 ders)", amount: 22500, currency: "eur" },

  // Özel dersler – çocuk
  "10_derslik_çocuk_özel_ders_paketi_Kd3U": { name: "Özel Ders (1 çocuk, 10 ders)", amount: 17000, currency: "eur" },
  "5_derslik_çocuk_özel_ders_paketi_Hq7S": { name: "Özel Ders (1 çocuk, 5 ders)", amount: 8500, currency: "eur" },
  "10_derslik_2_çocuk_grup_Bb7N": { name: "Özel Ders (2 çocuk, 10 ders)", amount: 24000, currency: "eur" },
  "5_derslik_2_çocuk_grup_Ll3K": { name: "Özel Ders (2 çocuk, 5 ders)", amount: 12000, currency: "eur" },
};
