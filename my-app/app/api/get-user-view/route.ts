import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
        // Query the gig_profile view
        const { data, error } = await supabase
            .from('gig_profile')
            .select('*')
            .eq('evmAddress', address);

        if (error) throw error;

        if (data && data.length > 0) {
            return NextResponse.json(data[0]);
        } else {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}