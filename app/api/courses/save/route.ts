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

    // Request body'yi doğrudan string olarak oku
    const body = await request.text();
    
    console.log('📤 Saving courses data, length:', body.length);

    // Blob'a kaydet - doğrudan body string'ini kullan
    const { url } = await put('courses/courses-data.json', body, {
      token: blobToken,
    });

    console.log('✅ Courses data saved to blob:', url);

    return NextResponse.json({ 
      success: true, 
      url,
      message: 'Kurs verileri başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('❌ Kurs verileri kaydedilirken hata:', error);
    return NextResponse.json(
      { 
        error: 'Kurs verileri kaydedilemedi',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}