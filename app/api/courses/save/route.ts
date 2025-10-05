import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// 🟢 Kurs verilerini kaydetmek (PUT)
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "en";

    // Sadece İngilizce sürümde kayıt yapılmasına izin veriyoruz (örnek)
    if (locale !== "en") {
      return NextResponse.json(
        { error: "Saving is only allowed for /en/courses" },
        { status: 403 }
      );
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 500 }
      );
    }

    const coursesData = await request.json();
    const jsonString = JSON.stringify(coursesData, null, 2);

    // 🟢 Blob’a yazma
    const { url: savedUrl, pathname } = await put(
      "courses/courses-data.json",
      jsonString,
      {
        access: "public",
        token: blobToken,
        contentType: "application/json",
        addRandomSuffix: false, // aynı dosyanın üzerine yazmak için
      }
    );

    return NextResponse.json({
      success: true,
      url: savedUrl,
      path: pathname,
      message: "✅ Kurs verileri başarıyla kaydedildi",
    });
  } catch (error) {
    console.error("❌ Save error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to save courses: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}

// 🟢 Kurs verilerini okumak (GET)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "en";

    if (locale !== "en") {
      return NextResponse.json(
        { success: false, message: "Locale not supported for blob" },
        { status: 404 }
      );
    }

const blobUrl =
  "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";


    const res = await fetch(blobUrl);
    if (!res.ok) {
      throw new Error(`Blob fetch failed: ${res.status}`);
    }

    const text = await res.text();
    const data = JSON.parse(text);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Fetch courses error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to fetch courses: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
