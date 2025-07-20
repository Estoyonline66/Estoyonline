import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import ftp from 'basic-ftp';

const DATA_FILE_PATH = '/tmp/persistent_VioleAWad342_data.txt';

// Enhanced FTP Client with timeout
class CustomFTPClient extends ftp.Client {
  constructor() {
    super();
    this.ftp.verbose = true;
    this.timeout = 10000; // 10 seconds timeout
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

    // Read file stats for debugging
    const stats = await fs.stat(DATA_FILE_PATH);
    console.log(`File size: ${stats.size} bytes`);

    // Connect to FTP
    console.log(`Connecting to ${process.env.FTP_HOST}...`);
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE === 'true',
      port: process.env.FTP_PORT || 21
    });

    // Verify connection
    const workingDir = await client.pwd();
    console.log(`Connected to FTP. Current directory: ${workingDir}`);

    // Upload file
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
    throw err; // Re-throw to ensure we know it failed
  } finally {
    client.close();
    console.log(`FTP connection closed. Upload success: ${uploadSuccess}`);
  }
}

export async function POST(request) {
  try {
    // ... [previous form handling code remains the same until after file write]

    await fs.writeFile(DATA_FILE_PATH, [...entries, newEntry].join('\n'));
    
    // Enhanced backup with error tracking
    try {
      await backupToFTP();
      console.log('Backup completed after form submission');
    } catch (err) {
      console.error('Background backup failed, but form was saved:', err);
      // Consider sending an alert email here if needed
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