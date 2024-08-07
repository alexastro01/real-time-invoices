import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, txn_hash } = body;

    if (!requestId || !txn_hash) {
      return NextResponse.json(
        { success: false, error: 'Request ID and Stream ID are required' },
        { status: 400 }
      );
    }
    console.log(requestId)
    console.log(txn_hash)
    const { data, error } = await supabaseClient
      .from('invoices')
      .update({ txn_hash: txn_hash })
      .eq('request_id', requestId)
      .select();

    if (error) throw error;

    if (data && data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No invoice found with the given Request ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] }, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice with stream ID' },
      { status: 500 }
    );
  }
}