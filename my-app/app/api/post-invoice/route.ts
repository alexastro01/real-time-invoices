import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

// Initialize Supabase client

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      requestId,
      payeeDetails,
      payerDetails,
    } = body;

    const { data, error } = await supabaseClient
      .from('invoices')
      .insert({
        request_id: requestId,
        payee_name: payeeDetails.name || '',
        payee_email: payeeDetails.email || '',
        payee_address: payeeDetails.address || '',
        payee_city: payeeDetails.city || '',
        payee_state: payeeDetails.state || '',
        payee_zip: payeeDetails.zip || '',
        payee_country: payeeDetails.country || '',
        payer_name: payerDetails.name || '',
        payer_email: payerDetails.email || '',
        payer_address: payerDetails.address || '',
        payer_city: payerDetails.city || '',
        payer_state: payerDetails.state || '',
        payer_zip: payerDetails.zip || '',
        payer_country: payerDetails.country || '',
      });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 500 });
  }
}