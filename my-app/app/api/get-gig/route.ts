import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  if (!session || !session.user?.address) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const gig_id = searchParams.get('gig_id');

  if (!gig_id) {
    return NextResponse.json({ error: 'Gig ID is required' }, { status: 400 });
  }

  try {
    const supabase = createAuthenticatedSupabaseClient(session);

    const { data: gig, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('gig_id', gig_id)
      .single();

    if (error) throw error;

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    return NextResponse.json({ gig });
  } catch (error) {
    console.error('Error fetching gig:', error);
    return NextResponse.json({ error: 'Failed to fetch gig' }, { status: 500 });
  }
}