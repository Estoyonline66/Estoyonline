// app/api/save-form-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { Client } from 'basic-ftp';

// New function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function getLatestFileContent(client: Client) {
  const list = await client.list();
  const txtFiles = list
    .filter(f => f.name.startsWith('IngridYse342_') && f.name.endsWith('.txt'))
    .sort((a, b) => b.name.localeCompare(a.name));

  if (txtFiles.length === 0) return null;

  const latestFile = txtFiles[0].name;
  const localPath = path.join(os.tmpdir(), latestFile);
  await client.downloadTo(localPath, latestFile);
  return await fs.readFile(localPath, 'utf8');
}

async function uploadToFTP(client: Client, filename: string, content: string) {
  const localPath = path.join(os.tmpdir(), filename);
  await fs.writeFile(localPath, content, 'utf8');
  await client.uploadFrom(localPath, filename);
  console.log(`FTP upload complete: ${filename}`);
}

export async function POST(req: NextRequest) {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
      secureOptions: { rejectUnauthorized: false },
      port: process.env.FTP_PORT ? Number(process.env.FTP_PORT) : 21
    });

    const { name, email, whatsapp, level } = await req.json();
    const timestamp = new Date().toISOString();
    const formattedDate = formatDate(timestamp); // Use formatted date
    const filename = `IngridYse342_${timestamp.replace(/[:.]/g, '-')}.txt`;

    const existingContent = await getLatestFileContent(client);
    let newContent = '';
    let nextNumber = 1;

    if (existingContent) {
      const rows = existingContent.trim().split('\n');
      const lastRow = rows[rows.length - 1];
      const lastNumber = parseInt(lastRow.split('|')[0]);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
      newContent = existingContent.trim() + '\n';
    } else {
      newContent = 'No.|Date|Name|Email|WhatsApp|Level\n';
    }

    const entry = `${nextNumber}|${formattedDate}|${name}|${email}|${whatsapp}|${level}`;
    newContent += entry;

    await uploadToFTP(client, filename, newContent);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.close();
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
      secureOptions: { rejectUnauthorized: false },
      port: process.env.FTP_PORT ? Number(process.env.FTP_PORT) : 21
    });

    const content = await getLatestFileContent(client);
    if (!content) return NextResponse.json({ data: [] }, { status: 200 });

    const rows = content.trim().split('\n').slice(1);
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