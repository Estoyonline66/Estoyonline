import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const coursesData = await request.json();
    
    // Kurs verilerini Vercel Blob'a kaydet
    const { url } = await put('courses-data.json', JSON.stringify(coursesData), {
      // Eski versiyonda 'access' yerine 'public' kullanılıyor
      // Yeni versiyonda token-based auth kullanılıyor
      contentType: 'application/json',
    });

    console.log('Courses data saved to blob:', url);

    return NextResponse.json({ 
      success: true, 
      url,
      message: 'Kurs verileri başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('Kurs verileri kaydedilirken hata:', error);
    return NextResponse.json(
      { error: 'Kurs verileri kaydedilemedi' },
      { status: 500 }
    );
  }
}