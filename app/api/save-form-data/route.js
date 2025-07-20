import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir, access } from 'fs/promises';

export async function POST(request: Request) {
  try {
    // Vercel'de /tmp dizinini kullanıyoruz
    const tmpDir = path.join(process.cwd(), 'tmp');
    const dataFilePath = path.join(tmpDir, 'campAWad342_res.txt');
    
    // Dizin yoksa oluştur
    try {
      await access(tmpDir);
    } catch {
      await mkdir(tmpDir, { recursive: true });
    }

    const { name, email, whatsapp, level, formattedDate } = await request.json();
    
    let entries: string[] = [];
    
    // Dosya varsa oku
    try {
      const fileContent = await readFile(dataFilePath, 'utf8');
      entries = fileContent.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
      // Dosya yoksa başlık satırını ekle
      if (error.code === 'ENOENT') {
        entries.push('No.|Date|Name|Email|WhatsApp|Level');
      } else {
        throw error;
      }
    }
    
    // Yeni kaydı ekle
    const newEntry = [
      entries.length - 1,
      formattedDate,
      name,
      email,
      whatsapp,
      level
    ].join('|');
    
    entries.push(newEntry);
    
    // Dosyayı yaz
    await writeFile(dataFilePath, entries.join('\n'));
    
    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { message: 'Error saving data', error: error.message },
      { status: 500 }
    );
  }
}

// Vercel'in /tmp dizinini kullanarak dosya okuma
async function readFile(filePath: string, encoding: BufferEncoding) {
  if (process.env.VERCEL) {
    // Vercel'de /tmp kullan
    const tmpPath = path.join('/tmp', path.basename(filePath));
    return await fs.promises.readFile(tmpPath, encoding);
  }
  return await fs.promises.readFile(filePath, encoding);
}

// Diğer HTTP metodlarını engelle
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}