import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { requestClient } from '@/lib/requestNetworkClient';

export async function GET(request: Request) {

    

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('request_id');


    if (!requestId) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
  
  
    try {
      const { data, error } = await supabaseClient
        .from('invoices')
        .select('*')
        .eq('request_id', searchParams)
        .single();
  
      if (error) throw error;
   
      const requestnetwork = await requestClient.fromRequestId(
        requestId,
      );
      const requestData =  requestnetwork.getData();
 
      const invoiceData = {
        partiesDetails : {
            seller: {
                name: data.payee_name,
                email: data.payee_email,
                address: data.payee_address,
                city: data.payee_city,
                state: data.payee_state,
                zip: data.payee_zip,
                country: data.payee_country
              },
              client: {
                name: data.payer_name,
                email: data.payer_email,
                address: data.payer_address,
                city: data.payer_city,
                state: data.payer_state,
                zip: data.payer_zip,
                country: data.payer_country
              }
        }
      }
  
    //   return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
  }