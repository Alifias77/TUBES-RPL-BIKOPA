import { NextRequest, NextResponse } from 'next/server';
import { ANNOUNCEMENTS } from '@/lib/data/announcements';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corridor = searchParams.get('corridor')?.toUpperCase();

  const now = new Date();
  const activeAnnouncements = ANNOUNCEMENTS.filter((ann) => {
    if (!ann.is_active) return false;
    if (ann.ends_at && new Date(ann.ends_at) < now) return false;
    if (corridor && ann.corridor_code && ann.corridor_code !== corridor) return false;
    return true;
  });

  return NextResponse.json({
    data: activeAnnouncements,
  });
}
