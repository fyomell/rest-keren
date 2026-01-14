import { NextResponse } from 'next/server';

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
