import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/dal';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const key = process.env.GIPHY_API_KEY;
  if (!key) return NextResponse.json({ error: 'Giphy not configured' }, { status: 503 });

  const q = req.nextUrl.searchParams.get('q');

  const url = q?.trim()
    ? `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(q)}&limit=20&api_key=${key}`
    : `https://api.giphy.com/v1/gifs/trending?limit=20&api_key=${key}`;

  const res = await fetch(url);

  if (!res.ok) return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });

  const raw = await res.json() as {
    data?: {
      id: string;
      images: { original: { url: string }; fixed_height_small: { url: string } };
    }[];
  };

  return NextResponse.json({
    data: (raw.data ?? []).map((r) => ({
      id: r.id,
      url: r.images.original.url,
      preview: r.images.fixed_height_small.url,
    })),
  });
}
