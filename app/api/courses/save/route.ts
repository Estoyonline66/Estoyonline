import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Edge Runtime default (export const runtime = "edge"; yazmana gerek yok, ama istersen ekleyebilirsin)
// export const runtime = "edge";

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

    // JSON string
    const jsonString = JSON.stringify(coursesData);

    // Edge Runtime için: Uint8Array → ArrayBuffer
    const body = new TextEncoder().encode(jsonString).buffer;

    // overwrite: aynı dosya adı kullanıldığında otomatik overwrite yapar
    const { url } = await put('courses/courses-data.json', body, {
      token: blobToken,
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
