import { put, get } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = "nodejs";

/**
 * POST: Kurs verilerini blob'a kaydeder (yalnızca /en/courses için)
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';

    if (locale !== 'en') {
      return NextResponse.json(
        { error: 'Saving is only allowed for /en/courses' },
        { status: 403 }
      );
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const coursesData = await request.json();
    const jsonString = JSON.stringify(coursesData);

    const { url: savedUrl } = await put('courses/courses-data.json', jsonString, {
      token: blobToken,
      contentType: 'application/json',
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: savedUrl,
      message: 'Kurs verileri başarıyla kaydedildi',
    });
  } catch (error) {
    console.error('❌ Save error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save courses: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Kurs verilerini blob'dan getirir (yalnızca /en/courses için)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';

    if (locale !== 'en') {
      return NextResponse.json({
        success: false,
        message: 'Locale not supported for blob',
      }, { status: 404 });
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const { text } = await get('courses/courses-data.json', {
      token: blobToken,
    });

    const coursesData = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: coursesData,
    });
  } catch (error) {
    console.error('❌ Fetch courses error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch courses: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
