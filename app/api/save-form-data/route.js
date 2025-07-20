import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'campAWad342_res.txt');

export async function POST(request: Request) {
  try {
    const { name, email, whatsapp, level, formattedDate } = await request.json();
    
    // Dosya varsa oku, yoksa başlık satırını oluştur
    let fileContent = '';
    let entries = [];
    
    if (fs.existsSync(dataFilePath)) {
      fileContent = fs.readFileSync(dataFilePath, 'utf8');
      entries = fileContent.split('\n').filter(line => line.trim() !== '');
      
      // Başlık satırı kontrolü
      if (entries.length === 0 || !entries[0].startsWith('No.|Date|Name|Email|WhatsApp|Level')) {
        entries.unshift('No.|Date|Name|Email|WhatsApp|Level');
      }
    } else {
      entries.push('No.|Date|Name|Email|WhatsApp|Level');
    }
    
    // Yeni kaydı ekle
    const newEntry = [
      entries.length - 1, // Başlık satırını çıkar
      formattedDate,
      name,
      email,
      whatsapp,
      level
    ].join('|');
    
    entries.push(newEntry);
    
    // Dosyayı güncelle
    fs.writeFileSync(dataFilePath, entries.join('\n'));
    
    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ message: 'Error saving data' }, { status: 500 });
  }
}

// OPTIONAL: Diğer HTTP metodlarını engellemek için
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}