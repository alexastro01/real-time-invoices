import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

interface Invoice {
  created_at: string;
  payer_evm_address: string;
  payee_evm_address: string;
  expected_amount: number;
  request_id: string;
  chain_id: number
}

interface FormattedInvoice {
  created_at: string;
  payer_evm_address: string;
  payee_evm_address: string;
  expected_amount: string;
  request_id: string;
  chain_id: number

}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payee_address = searchParams.get('payee_address');

  if (!payee_address) {
    return NextResponse.json({ error: 'Payee address is required' }, { status: 400 });
  }

  try {
    const supabaseStartTime = performance.now();

    const { data, error } = await supabaseClient
      .from('invoices')
      .select('created_at, payer_evm_address, payee_evm_address, expected_amount, request_id, chain_id')
      .eq('payee_evm_address', payee_address)
      .order('created_at', { ascending: false });

    const supabaseEndTime = performance.now();
    const supabaseTimeTaken = supabaseEndTime - supabaseStartTime;

    console.log(`Supabase query took ${supabaseTimeTaken.toFixed(2)} milliseconds`);

    if (error) throw error;


    const formattedData: FormattedInvoice[] = (data as Invoice[]).map(invoice => ({
      created_at: new Date(invoice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      payer_evm_address: invoice.payer_evm_address,
      payee_evm_address: invoice.payee_evm_address,
      expected_amount: `${invoice.expected_amount}`,
      request_id: invoice.request_id,
      chain_id: invoice.chain_id
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices', details: (error as Error).message }, { status: 500 });
  }
}