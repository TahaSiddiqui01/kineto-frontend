import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/dal';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams.get('q');
  if (!q?.trim()) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ error: 'Unsplash not configured' }, { status: 503 });

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );

  if (!res.ok) return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });

  const raw = await res.json() as {
    results?: { id: string; urls: { regular: string; thumb: string }; alt_description?: string }[];
  };

  return NextResponse.json({
    data: (raw.results ?? []).map((r) => ({
      id: r.id,
      url: r.urls.regular,
      thumb: r.urls.thumb,
      alt: r.alt_description ?? '',
    })),
  });
}
