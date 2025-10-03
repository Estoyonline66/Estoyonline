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

    // Raw body olarak oku
    const body = await request.text();
    const coursesData = JSON.parse(body);
    
    console.log('📤 Saving courses data...');

    // Minimum options ile blob'a kaydet
    const { url } = await put('courses/courses-data.json', body, {
      token: blobToken,
    });

    console.log('✅ Courses data saved to:', url);

    return NextResponse.json({ 
      success: true, 
      url,
      message: 'Kurs verileri başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('❌ Save error:', error);
    return NextResponse.json(
      { 
        error: 'Save failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}