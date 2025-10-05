import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "en";

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

    // sadece cardCourses kaydedilecek
    const { cardCourses } = await request.json();

    if (!cardCourses || !Array.isArray(cardCourses)) {
      return NextResponse.json(
        { error: "Invalid cardCourses data" },
        { status: 400 }
      );
    }

    const jsonString = JSON.stringify({ cardCourses }, null, 2);

    const { url: savedUrl } = await put(
      "courses/courses-data.json",
      jsonString,
      {
        token: blobToken,
        contentType: "application/json",
        access: "public",
        addRandomSuffix: false,
      }
    );

    return NextResponse.json({
      success: true,
      url: savedUrl,
      message: "✅ Kurs verileri başarıyla kaydedildi",
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
    const res = await fetch(blobUrl);
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ GET /api/courses/save failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
