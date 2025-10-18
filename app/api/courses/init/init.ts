import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 500 }
      );
    }

    // ✅ Başlangıç verisi (EN ve TR)
    const cardCoursesEn = [
      { title: "A1.1 Beginner", bold: "Saturday", lesson: "First class", time: "5:00 pm Spain time", week: "Once a week 2.5 hours", month: "Oct 11" },
      { title: "A2.2", bold: "Monday", lesson: "First class", time: "5:30 pm Spain time", week: "Once a week 2.5 hours", month: "Sep 1" },
      { title: "A2.1", bold: "Monday", lesson: "First class", time: "6:00 pm Spain time", week: "Once a week 2.5 hours", month: "Oct 6" },
      { title: "A1.2", bold: "Monday", lesson: "First class", time: "6:00 pm Spain time", week: "Once a week 2.5 hours", month: "Nov 3" },
      { title: "A2.1", bold: "Friday", lesson: "First class", time: "6:00 pm Spain time", week: "Once a week 2.5 hours", month: "Sep 26" },
      { title: "A2.2", bold: "Wednesday", lesson: "First class", time: "5:30 pm Spain time", week: "Once a week 2.5 hours", month: "Sep 3" },
      { title: "A2.3", bold: "Tuesday", lesson: "First class", time: "6:00 pm Spain time", week: "Once a week 2.5 hours", month: "Sep 9" },
      { title: "B1.2", bold: "Friday", lesson: "First class", time: "5:30 pm Spain time", week: "Once a week 2.5 hours", month: "Sep 5" },
      { title: "Speaking Course Beginner A1", bold: "Wednesday", lesson: "First class", time: "6:30 pm Spain time", week: "Once a week 2 hours", month: "Oct 1" },
      { title: "Speaking Course Intermediate A2", bold: "Wednesday", lesson: "First class", time: "6:30 pm Spain time", week: "Once a week 2 hours", month: "Sep 17", teacher: "sfsdf" },
      { title: "Speaking Course Advanced B1-B2", bold: "Saturday", lesson: "First class", time: "9:00 am Spain time", week: "Once a week 2 hours", month: "Oct 11", teacher: "5656757" }
    ];

    const cardCoursesTr = [
      { title: "A1.1 Başlangıç", bold: "Pazartesi", lesson: "İlk ders", time: "19:00 - 2,5 saat", week: "Haftada 1 gün", month: "6 Ekim", teacher: "Anita" },
      { title: "A1.1 Başlangıç", bold: "Cumartesi", lesson: "İlk ders", time: "17:00 - 2,5 saat", week: "Haftada 1 gün", month: "4 Ekim", teacher: "Meli" },
      { title: "A1.1 Başlangıç", bold: "Cuma", lesson: "İlk ders", time: "11:00 - 2,5 saat", week: "Haftada 1 gün", month: "3 Ekim", teacher: "Iván" },
      { title: "A1.2", bold: "Cuma", lesson: "İlk ders", time: "11:00-13:30", week: "Haftada 1 gün", month: "17 Ekim", teacher: "Ivan" },
      { title: "A1.2", bold: "Pazartesi", lesson: "İlk ders", time: "19:00 - 2,5 saat", week: "Haftada 1 gün", month: "3 Kasım", teacher: "Meli" },
      { title: "A2.1", bold: "Pazartesi", lesson: "İlk ders", time: "19:00 - 2,5 saat", week: "Haftada 1 gün", month: "6 Ekim", teacher: "Sabri" },
      { title: "A2.1", bold: "Cuma", lesson: "İlk ders", time: "19:00 - 2,5 saat", week: "Haftada 1 gün", month: "26 Eylül", teacher: "Meli" },
      { title: "A2.2", bold: "Pazartesi", lesson: "İlk ders", time: "18:30 - 2,5 saat", week: "Haftada 1 gün", month: "1 Eylül", teacher: "Caro" },
      { title: "A2.2", bold: "Çarşamba", lesson: "İlk ders", time: "18:30 - 2,5 saat", week: "Haftada 1 gün", month: "3 Eylül", teacher: "Caro" },
      { title: "A2.3", bold: "Salı", lesson: "İlk ders", time: "19:00 - 2,5 saat", week: "Haftada 1 gün", month: "9 Eylül", teacher: "Sabri" },
      { title: "B1.2", bold: "Cuma", lesson: "İlk ders", time: "18:30 - 2,5 saat", week: "Haftada 1 gün", month: "5 Eylül", teacher: "Caro" },
      { title: "Konuşma Kursu Başlangıç A1", bold: "Çarşamba", lesson: "İlk ders", time: "19:30 - 2 saat", week: "Haftada 1 gün", month: "1 Ekim", teacher: "Meli" },
      { title: "Konuşma Kursu Orta A2", bold: "Perşembe", lesson: "İlk ders", time: "19:30 - 2 saat", week: "Haftada 1 gün", month: "2 Ekim", teacher: "Sabri" },
      { title: "Konuşma Kursu İleri B1-B2", bold: "Cumartesi", lesson: "İlk ders", time: "10:00 - 2 saat", week: "Haftada 1 gün", month: "11 Ekim", teacher: "Sabri" }
    ];

    // blob formatında birleştir
    const jsonString = JSON.stringify({ cardCoursesEn, cardCoursesTr }, null, 2);

    // blob’a yaz (eski veri otomatik üzerine yazılır)
    const { url: savedUrl } = await put("courses/courses-data.json", jsonString, {
      token: blobToken,
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false
    });

    return NextResponse.json({ success: true, url: savedUrl, message: "✅ Başlangıç verisi yüklendi." });
  } catch (err) {
    console.error("Error initializing blob:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
