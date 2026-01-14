import { NextResponse } from 'next/server';

// 1. Ini buat Browser (GET Request) - Biar gak 404 pas dibuka
export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "API TikTok Downloader Ready 🚀",
    tutorial: "Kirim request POST dengan body { url: 'link_tiktok' }",
    maintainer: "Rofik"
  });
}

// 2. Ini buat API benerannya (POST Request)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL TikTok wajib diisi bre' }, { status: 400 });
    }

    // Nembak ke TikWM API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghubungi server TikWM', details: error }, 
      { status: 500 }
    );
  }
}
