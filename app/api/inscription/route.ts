import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return new NextResponse('Missing id', { status: 400 });

  try {
    const res = await fetch(`https://ordinals.com/content/${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Failed', { status: 500 });
  }
}
