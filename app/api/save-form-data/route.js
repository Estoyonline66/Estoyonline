import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request) {
  try {
    // Vercel'de /tmp, local'de ./tmp kullan
    const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'tmp');
    const dataFilePath = path.join(tmpDir, 'campAWad342_res.txt');

    // Dizin yoksa oluştur
    try {
      await fs.access(tmpDir);
    } catch {
      await fs.mkdir(tmpDir, { recursive: true });
    }

    const { name, email, whatsapp, level, formattedDate } = await request.json();
    
    let entries = [];
    
    // Dosya varsa oku
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      entries = fileContent.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
      if (error.code === 'ENOENT') {
        entries.push('No.|Date|Name|Email|WhatsApp|Level');
      } else {
        throw error;
      }
    }
    
    // Yeni kayıt
    const newEntry = [
      entries.length,
      formattedDate || new Date().toISOString(),
      name,
      email,
      whatsapp,
      level
    ].join('|');
    
    await fs.writeFile(dataFilePath, [...entries, newEntry].join('\n'));
    
    return NextResponse.json({ 
      success: true,
      message: 'Data saved successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'tmp');
    const dataFilePath = path.join(tmpDir, 'campAWad342_res.txt');

    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const submissions = fileContent.split('\n')
      .filter(line => line.trim() !== '')
      .slice(1) // Başlık satırını atla
      .map(row => {
        const [no, date, name, email, whatsapp, level] = row.split('|');
        return { no, date, name, email, whatsapp, level };
      });

    return NextResponse.json({ data: submissions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { data: [], message: 'No data yet' },
      { status: 200 }
    );
  }
}