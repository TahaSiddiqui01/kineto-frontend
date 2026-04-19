import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/dal';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ error: 'Unsplash not configured' }, { status: 503 });

  const q = req.nextUrl.searchParams.get('q');

  const url = q?.trim()
    ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20`
    : `https://api.unsplash.com/photos?order_by=popular&per_page=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });

  if (!res.ok) return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });

  if (q?.trim()) {
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

  const raw = await res.json() as {
    id: string; urls: { regular: string; thumb: string }; alt_description?: string;
  }[];
  return NextResponse.json({
    data: (Array.isArray(raw) ? raw : []).map((r) => ({
      id: r.id,
      url: r.urls.regular,
      thumb: r.urls.thumb,
      alt: r.alt_description ?? '',
    })),
  });
}
