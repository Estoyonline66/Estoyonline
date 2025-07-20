import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import ftp from 'basic-ftp';

const DATA_FILE_PATH = '/tmp/persistent_VioleAWad342_data.txt';

class CustomFTPClient extends ftp.Client {
  constructor() {
    super();
    this.ftp.verbose = true;
    this.timeout = 10000;
  }
}

async function backupToFTP() {
  const client = new CustomFTPClient();
  let uploadSuccess = false;

  try {
    console.log('Starting FTP backup process...');
    
    // Verify local file exists
    try {
      await fs.access(DATA_FILE_PATH);
      console.log('Local data file exists');
    } catch (err) {
      throw new Error(`Local file not found: ${err.message}`);
    }

    const stats = await fs.stat(DATA_FILE_PATH);
    console.log(`File size: ${stats.size} bytes`);

    console.log(`Connecting to ${process.env.FTP_HOST}...`);
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE === 'true',
      port: process.env.FTP_PORT || 21
    });

    const workingDir = await client.pwd();
    console.log(`Connected to FTP. Current directory: ${workingDir}`);

    console.log('Starting file upload...');
    await client.uploadFrom(await fs.readFile(DATA_FILE_PATH), 'violeawad342_backup.txt');
    uploadSuccess = true;
    console.log('FTP backup completed successfully!');

  } catch (err) {
    console.error('FTP Backup Error:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      host: process.env.FTP_HOST,
      time: new Date().toISOString()
    });
    throw err;
  } finally {
    client.close();
    console.log(`FTP connection closed. Upload success: ${uploadSuccess}`);
  }
}

export async function POST(req) {  // Changed from 'request' to 'req'
  try {
    const { name, email, whatsapp, level, formattedDate } = await req.json();
    
    // Ensure directory exists
    try {
      await fs.mkdir('/tmp', { recursive: true });
    } catch (err) {
      console.log('Directory already exists or could not be created');
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
    
    try {
      await backupToFTP();
      console.log('Backup completed after form submission');
    } catch (err) {
      console.error('Background backup failed, but form was saved:', err);
    }
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('POST Error:', {
      error: err.message,
      stack: err.stack,
      time: new Date().toISOString()
    });
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