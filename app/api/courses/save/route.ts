import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Node.js runtime kullan
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured' },
        { status: 500 }
      );
    }

    // JSON verisini al
    const coursesData = await request.json();

    console.log('📤 Saving courses data:', {
      cardCoursesCount: coursesData.cardCourses?.length || 0,
      scheduleTitle: coursesData.scheduleTitle,
      title: coursesData.title,
    });

    // Node.js runtime için Buffer kullan
    const body = Buffer.from(JSON.stringify(coursesData));

    // overwrite: aynı dosya adı kullanıldığında otomatik overwrite olur
    const { url } = await put('courses/courses-data.json', body, {
      token: blobToken,
      contentType: 'application/json', // Buffer ile birlikte güvenli
    });

    console.log('✅ Courses data saved to blob:', url);

    return NextResponse.json({
      success: true,
      url,
      message: 'Kurs verileri başarıyla kaydedildi',
    });
  } catch (error) {
    console.error('❌ Save error:', error);
    return NextResponse.json(
      {
        error:
          'Failed to save courses: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
