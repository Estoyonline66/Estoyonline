import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!blobToken) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured' },
        { status: 500 }
      );
    }

    // JSON'ı parse et
    const coursesData = await request.json();
    
    console.log('📤 Saving courses data:', {
      cardCoursesCount: coursesData.cardCourses?.length || 0,
      scheduleTitle: coursesData.scheduleTitle,
      title: coursesData.title
    });

    // JSON.stringify ile tekrar string'e çevir (encoding sorununu çözmek için)
    const jsonString = JSON.stringify(coursesData);
    
    const { url } = await put('courses/courses-data.json', jsonString, {
      token: blobToken,
    });

    console.log('✅ Courses data saved to blob:', url);

    return NextResponse.json({ 
      success: true, 
      url,
      message: 'Kurs verileri başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('❌ Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save courses: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}