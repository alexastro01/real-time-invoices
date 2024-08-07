// app/api/invoice-chart-data/route.ts

import { supabaseClient } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// Define the structure of an invoice from Supabase
interface Invoice {
  created_at: string; // This will be a string representation of the timestampz
  expected_amount: string; // Assuming this is stored as a string in Supabase
}

// Define the structure of our aggregated data
interface AggregatedData {
  date: string;
  expectedAmount: number;
  invoicesSent: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_address = searchParams.get('user_address');

  if (!user_address) {
    return NextResponse.json({ message: 'User address is required' }, { status: 400 });
  }

  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // Get data for the last 3 months

    const { data, error } = await supabaseClient
      .from('invoices')
      .select('created_at, expected_amount')
      .eq('payee_evm_address', user_address)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Process the data to aggregate by day
    const aggregatedData = (data as Invoice[]).reduce((acc: { [key: string]: AggregatedData }, invoice) => {
      const date = new Date(invoice.created_at).toISOString().split('T')[0]; // Get just the date part
      if (!acc[date]) {
        acc[date] = { date, expectedAmount: 0, invoicesSent: 0 };
      }
      acc[date].expectedAmount += parseFloat(invoice.expected_amount);
      acc[date].invoicesSent += 1;
      return acc;
    }, {});

    // Convert to array and sort by date
    const chartData = Object.values(aggregatedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    return NextResponse.json({ message: 'Error fetching invoice data' }, { status: 500 });
  }
}