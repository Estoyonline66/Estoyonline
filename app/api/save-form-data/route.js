import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import ftp from 'basic-ftp';

// Persistent storage path
const DATA_FILE_PATH = '/tmp/persistent_VioleAWad342_data.txt';

// FTP Configuration
const FTP_CONFIG = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true'
};

async function backupToFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Enable for debugging
  
  try {
    // Read current data
    const content = await fs.readFile(DATA_FILE_PATH);
    
    // Connect to FTP server
    await client.access(FTP_CONFIG);
    
    // Upload file
    await client.uploadFrom(Buffer.from(content), 'violeawad342_backup.txt');
    
    console.log('FTP backup completed successfully');
  } catch (err) {
    console.error('FTP backup failed:', err);
  } finally {
    client.close();
  }
}

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
        entries.push('No.|Date|Name|Email|WhatsApp|Level');
      } else {
        throw err;
      }
    }

    const newEntry = [
      entries.length,
      formattedDate || new Date().toISOString(),
      name,
      email,
      whatsapp,
      level
    ].join('|');

    await fs.writeFile(DATA_FILE_PATH, [...entries, newEntry].join('\n'));
    
    // Trigger FTP backup in background
    backupToFTP().catch(console.error);
    
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
      .slice(1)
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