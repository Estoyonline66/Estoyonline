import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { Client } from 'basic-ftp';

async function uploadToFTP(filename: string, content: string) {
  const client = new Client();
  const localPath = path.join(os.tmpdir(), filename);
  await fs.writeFile(localPath, content, 'utf8');

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false
      },
      port: process.env.FTP_PORT ? Number(process.env.FTP_PORT) : 21
    });

    await client.uploadFrom(localPath, filename);
    console.log(`FTP upload complete: ${filename}`);
  } finally {
    client.close();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, level } = await req.json();
    const timestamp = new Date().toISOString();
    const filename = `violeawad342_${timestamp.replace(/[:.]/g, '-')}.txt`;

    const headers = 'No.|Date|Name|Email|WhatsApp|Level';
    const entry = `1|${timestamp}|${name}|${email}|${whatsapp}|${level}`;
    const content = `${headers}\n${entry}`;

    await uploadToFTP(filename, content);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false
      },
      port: process.env.FTP_PORT ? Number(process.env.FTP_PORT) : 21
    });

    const list = await client.list();
    const txtFiles = list
      .filter(f => f.name.startsWith('violeawad342_') && f.name.endsWith('.txt'))
      .sort((a, b) => b.name.localeCompare(a.name)); // En yeni en üstte

    if (txtFiles.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const latestFile = txtFiles[0].name;
    const localPath = path.join(os.tmpdir(), latestFile);
    await client.downloadTo(localPath, latestFile);
    const content = await fs.readFile(localPath, 'utf8');

    const rows = content.trim().split('\n').slice(1); // Header'ı atla
    const submissions = rows.map(row => {
      const [no, date, name, email, whatsapp, level] = row.split('|');
      return { no, date, name, email, whatsapp, level };
    });

    return NextResponse.json({ data: submissions }, { status: 200 });
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Could not read from FTP' }, { status: 500 });
  } finally {
    client.close();
  }
}