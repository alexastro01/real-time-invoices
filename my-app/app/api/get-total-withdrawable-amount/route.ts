import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
  
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
      const { data, error } = await supabaseClient
        .from('invoices')
        .select('stream_id, chain_id')
        .eq('payee_evm_address', address)
        .not('stream_id', 'is', null);
  
      if (error) throw error;
  
      const streams = data.map(({ stream_id, chain_id }) => ({ stream_id, chain_id }));
  
      return NextResponse.json(streams);
    } catch (error) {
      console.error('Error fetching user streams:', error);
      return NextResponse.json({ error: 'Failed to fetch user streams' }, { status: 500 });
    }
}