import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Node.js runtime kullanıyoruz
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

    // 🧪 ÖNCE TEST DOSYASINI DENEYELİM
    console.log('🧪 Test dosyası denemesi...');
    
    const testContent = `Test dosyası - ${new Date().toISOString()}\nMerhaba Dünya!`;
    
    try {
      const testResult = await put('test-files/test.txt', testContent, {
        token: blobToken,
        contentType: 'text/plain',
      });
      
      console.log('✅ Test dosyası başarılı:', testResult.url);
    } catch (testError) {
      console.error('❌ Test dosyası hatası:', testError);
      // Test hatasında devam et, belki courses farklı davranır
    }

    // JSON verisini al
    const coursesData = await request.json();

    console.log('📤 Saving courses data:', {
      cardCoursesCount: coursesData.cardCourses?.length || 0,
      scheduleTitle: coursesData.scheduleTitle,
      title: coursesData.title,
    });

    // 🔑 Saf string gönderiyoruz, Buffer veya Blob kullanmıyoruz
    const jsonString = JSON.stringify(coursesData);

    // overwrite: aynı dosya adı kullanıldığında otomatik overwrite olur
    const { url } = await put('courses/courses-data.json', jsonString, {
      token: blobToken,
      contentType: 'application/json', // string ile birlikte güvenli
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