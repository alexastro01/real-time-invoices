// app/api/joinWaitlist/route.ts
import { NextResponse } from 'next/server'

import { supabaseClient } from '@/lib/supabaseClient'



export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseClient
      .from('waitlists')
      .insert([{ email }])

    if (error) throw error

    return NextResponse.json({ message: 'Successfully joined waitlist' }, { status: 200 })
  } catch (error) {
    console.error('Error inserting email:', error)
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
  }
}