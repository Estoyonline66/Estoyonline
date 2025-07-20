import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Vercel'de /tmp, local'de ./tmp kullan
    const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'tmp');
    const dataFilePath = path.join(tmpDir, 'campAWad342_res.txt');

    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      const rows = fileContent.split('\n').filter(row => row.trim() !== '');
      
      // Başlık satırını atlayıp verileri işle
      const submissions = rows.slice(1).map(row => {
        const [no, date, name, email, whatsapp, level] = row.split('|');
        return { no, date, name, email, whatsapp, level };
      });

      return NextResponse.json({ data: submissions }, { status: 200 });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      throw error;
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}