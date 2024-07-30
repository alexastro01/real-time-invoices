import { supabaseClient } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';




export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { evmAddress, name, email, address, city, state, zip, country } = body

    if (!evmAddress || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseClient
      .from('user_details')
      .upsert(
        { evmAddress, name, email, address, city, state, zip, country },
        { onConflict: 'evmAddress', ignoreDuplicates: false }
      )

    if (error) throw error

    return NextResponse.json({ message: 'User details saved successfully', data })
  } catch (error) {
    console.error('Error saving user details:', error)
    return NextResponse.json({ error: 'Failed to save user details' }, { status: 500 })
  }
}