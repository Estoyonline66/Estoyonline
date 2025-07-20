import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request) {
  try {
    const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'tmp');
    const dataFilePath = path.join(tmpDir, 'campAWad342_res.txt');
    
    // Dizin kontrolü ve oluşturma
    try {
      await fs.access(tmpDir);
    } catch {
      await fs.mkdir(tmpDir, { recursive: true });
    }

    const { name, email, whatsapp, level, formattedDate } = await request.json();
    
    let entries = [];
    
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
    
    const newEntry = [
      entries.length - 1,
      formattedDate || new Date().toLocaleString(),
      name,
      email,
      whatsapp,
      level
    ].join('|');
    
    await fs.writeFile(dataFilePath, [...entries, newEntry].join('\n'));
    
    return NextResponse.json({ success: true, filePath: dataFilePath }, { status: 200 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'tmp');
    const dataFilePath = path.join(tmpDir, 'campAWad342_res.txt');
    
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json({ data: fileContent.split('\n') }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'No data yet', details: error.message },
      { status: 404 }
    );
  }
}