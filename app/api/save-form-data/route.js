// app/api/save-form-data/route.js
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Persistent storage path (works on Vercel)
const DATA_FILE_PATH = '/tmp/persistent_VioleAWad342_data.txt';

export async function POST(request) {
  try {
    const { name, email, whatsapp, level, formattedDate } = await request.json();
    
    // Ensure directory exists
    try {
      await fs.access(path.dirname(DATA_FILE_PATH));
    } catch {
      await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    }

    let entries = [];
    try {
      const content = await fs.readFile(DATA_FILE_PATH, 'utf8');
      entries = content.split('\n').filter(line => line.trim() !== '');
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Initialize with header if file doesn't exist
        entries.push('No.|Date|Name|Email|WhatsApp|Level');
      } else {
        throw err;
      }
    }

    const newEntry = [
      entries.length,
      formattedDate,
      name,
      email,
      whatsapp,
      level
    ].join('|');

    await fs.writeFile(DATA_FILE_PATH, [...entries, newEntry].join('\n'));
    
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
    const content = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const submissions = content.split('\n')
      .filter(line => line.trim() !== '')
      .slice(1) // Skip header
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