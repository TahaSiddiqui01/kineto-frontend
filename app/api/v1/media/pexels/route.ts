import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/dal';

type PexelsVideoFile = {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
};

type PexelsVideo = {
  id: number;
  url: string;
  image: string;
  width: number;
  height: number;
  video_files: PexelsVideoFile[];
};

type PexelsResponse = {
  videos?: PexelsVideo[];
  error?: string;
};

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const key = process.env.PEXELS_API_KEY;
  if (!key) return NextResponse.json({ error: 'Pexels not configured' }, { status: 503 });

  const q = req.nextUrl.searchParams.get('q') ?? 'nature';
  const orientation = req.nextUrl.searchParams.get('orientation') ?? '';

  const params = new URLSearchParams({ query: q, per_page: '15' });
  if (orientation) params.set('orientation', orientation);

  const res = await fetch(`https://api.pexels.com/videos/search?${params.toString()}`, {
    headers: { Authorization: key },
  });

  if (!res.ok) return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });

  const raw = await res.json() as PexelsResponse;

  return NextResponse.json({
    data: (raw.videos ?? []).map((v) => {
      // Prefer HD mp4, fallback to first file
      const file =
        v.video_files.find((f) => f.quality === 'hd' && f.file_type === 'video/mp4') ??
        v.video_files.find((f) => f.file_type === 'video/mp4') ??
        v.video_files[0];
      return {
        id: String(v.id),
        url: file?.link ?? v.url,
        thumb: v.image,
        width: v.width,
        height: v.height,
      };
    }),
  });
}
