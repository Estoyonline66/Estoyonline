// app/api/test-ftp/route.js
import { NextResponse } from 'next/server';
import ftp from 'basic-ftp';

export async function GET() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE === 'true'
    });

    const serverInfo = {
      currentDir: await client.pwd(),
      features: await client.features(),
      list: await client.list()
    };

    return NextResponse.json({
      success: true,
      serverInfo
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack,
      config: {
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        secure: process.env.FTP_SECURE
      }
    }, { status: 500 });
  } finally {
    client.close();
  }
}