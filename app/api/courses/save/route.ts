import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const coursesData = await request.json();
    
    // Kurs verilerini Vercel Blob'a kaydet
    const { url } = await put('courses-data.json', JSON.stringify(coursesData), {
      access: 'public',
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
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