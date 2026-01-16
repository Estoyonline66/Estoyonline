import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 500 }
      );
    }

    // 🔹 Yeni yapı: EN ve TR kurslarını birlikte alıyoruz
    const { cardCoursesEn, cardCoursesTr, paymentLinksGroup, paymentLinksPrivate, prices } = await request.json();

    // Eğer sadece fiyat güncellemesi yapılıyorsa validation'ı atla veya prices varsa kabul et
    if (
      (!prices) &&
      (!cardCoursesEn || !Array.isArray(cardCoursesEn)) &&
      (!cardCoursesTr || !Array.isArray(cardCoursesTr))
    ) {
      return NextResponse.json(
        { error: "Invalid course data. Expected arrays for EN or TR, or prices object." },
        { status: 400 }
      );
    }

    // 🔹 Blob’a kaydedilecek JSON yapısı (Courses)
    if (cardCoursesEn || cardCoursesTr) {
      const jsonString = JSON.stringify(
        {
          cardCoursesEn: cardCoursesEn || [],
          cardCoursesTr: cardCoursesTr || [],
          paymentLinksGroup: paymentLinksGroup || [],
          paymentLinksPrivate: paymentLinksPrivate || [],
        },
        null,
        2
      );

      // 🔹 Vercel Blob’a yaz (Courses)
      await put(
        "courses/courses-data.json",
        jsonString,
        {
          token: blobToken,
          contentType: "application/json",
          access: "public",
          addRandomSuffix: false,
        }
      );
    }

    // 🔹 Fiyatları (Prices) ayrı bir dosyaya kaydet
    if (prices) {
      await put(
        "checkout/prices.json",
        JSON.stringify(prices, null, 2),
        {
          token: blobToken,
          contentType: "application/json",
          access: "public",
          addRandomSuffix: false,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Cambios guardados correctamente.",
    });
  } catch (error) {
    console.error("❌ Save error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blobUrl =
      "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";

    const res = await fetch(blobUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ GET /api/courses/save failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blob data" },
      { status: 500 }
    );
  }
}
