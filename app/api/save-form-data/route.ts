// app/api/save-form-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { Client } from 'basic-ftp';

async function getLatestFileContent(client: Client) {
  const list = await client.list();
  const txtFiles = list
    .filter(f => f.name.startsWith('violeawad342_') && f.name.endsWith('.txt'))
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
    const filename = `violeawad342_${timestamp.replace(/[:.]/g, '-')}.txt`;

    // Get the latest file content
    const existingContent = await getLatestFileContent(client);
    let newContent = '';
    let nextNumber = 1;

    if (existingContent) {
      const rows = existingContent.trim().split('\n');
      const lastRow = rows[rows.length - 1];
      const lastNumber = parseInt(lastRow.split('|')[0]);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
      
      // Keep headers and existing rows
      newContent = existingContent.trim() + '\n';
    } else {
      // Create new headers if no file exists
      newContent = 'No.|Date|Name|Email|WhatsApp|Level\n';
    }

    // Add new entry
    const entry = `${nextNumber}|${timestamp}|${name}|${email}|${whatsapp}|${level}`;
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

    const rows = content.trim().split('\n').slice(1); // Skip header
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