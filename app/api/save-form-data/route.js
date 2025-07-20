import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const getDataFilePath = () => {
  const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'tmp');
  return path.join(tmpDir, 'VioleAWad342_res.txt');
};

export async function POST(request) {
  try {
    const dataFilePath = getDataFilePath();
    const { name, email, whatsapp, level } = await request.json();
    
    // Dizin yoksa oluştur
    try {
      await fs.access(path.dirname(dataFilePath));
    } catch {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    }

    let entries = [];
    try {
      const content = await fs.readFile(dataFilePath, 'utf8');
      entries = content.split('\n').filter(line => line.trim() !== '');
    } catch (err) {
      if (err.code === 'ENOENT') {
        entries.push('No.|Date|Name|Email|WhatsApp|Level');
      } else {
        throw err;
      }
    }

    const newEntry = [
      entries.length,
      new Date().toLocaleString('tr-TR'),
      name,
      email,
      whatsapp,
      level
    ].join('|');

    await fs.writeFile(dataFilePath, [...entries, newEntry].join('\n'));
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataFilePath = getDataFilePath();
    const content = await fs.readFile(dataFilePath, 'utf8');
    
    const submissions = content.split('\n')
      .filter(line => line.trim() !== '')
      .slice(1) // Başlık satırını atla
      .map(row => {
        const [no, date, name, email, whatsapp, level] = row.split('|');
        return { no, date, name, email, whatsapp, level };
      });

    return NextResponse.json({ data: submissions }, { status: 200 });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
    console.error('GET Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}