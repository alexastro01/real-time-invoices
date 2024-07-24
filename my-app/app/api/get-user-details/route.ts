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
        .from('user_details')
        .select('*')
        .eq('evmAddress', address)
        .single();
  
      if (error) throw error;
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
  }