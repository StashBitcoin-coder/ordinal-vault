import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return new NextResponse('Missing id', { status: 400 });
  return NextResponse.redirect(`https://ordinals.com/content/${id}`, 301);
}
