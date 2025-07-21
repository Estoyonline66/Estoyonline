// app/api/test-ftp/route.js
import { NextResponse } from 'next/server';
import ftp from 'basic-ftp';

export async function GET() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  let connectionSuccess = false;

  try {
    // Test FTP connection with environment variables
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE === 'true',
      port: process.env.FTP_PORT || 21
    });

    connectionSuccess = true;
    
    // Get server information
    const serverInfo = {
      currentDirectory: await client.pwd(),
      serverFeatures: await client.features(),
      fileList: await client.list()
    };

    return NextResponse.json({
      status: 'success',
      message: 'FTP connection successful',
      serverInfo,
      config: {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT || 21,
        secure: process.env.FTP_SECURE
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'FTP connection failed',
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      config: {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USER,
        secure: process.env.FTP_SECURE
      }
    }, { 
      status: 500 
    });

  } finally {
    // Ensure connection is closed
    if (connectionSuccess) {
      await client.close();
      console.log('FTP connection closed successfully');
    }
  }
}