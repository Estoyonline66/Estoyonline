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

    const coursesData = await request.json();
    
    // ÖNEMLİ: Her zaman AYNI dosya adını kullan
    const { url } = await put('courses/courses-data.json', JSON.stringify(coursesData), {
      access: 'public',
      contentType: 'application/json',
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
      { error: 'Kurs verileri kaydedilemedi' },
      { status: 500 }
    );
  }
}