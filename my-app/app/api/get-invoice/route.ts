import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { requestClient } from '@/lib/requestNetworkClient';
import { IInvoiceData } from '@/types/interfaces';

export async function GET(request: Request) {

    

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('request_id');


    if (!requestId) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
  
  
    try {
        const supabaseStartTime = performance.now();

        const { data, error } = await supabaseClient
            .from('invoices')
            .select('*')
            .eq('request_id', requestId)
            .single();

        const supabaseEndTime = performance.now();
        const supabaseTimeTaken = supabaseEndTime - supabaseStartTime;

        console.log(`Supabase query took ${supabaseTimeTaken.toFixed(2)} milliseconds`);

      if (error) throw error;
   
       const requestStartTime = performance.now();

      const requestnetwork = await requestClient.fromRequestId(
        requestId,
      );
      const requestData =  requestnetwork.getData();

        const requestNetworkEndTime = performance.now();

        const requestNetworkTimeTaken = requestNetworkEndTime - requestStartTime;

        console.log(`Request ipfs query took ${requestNetworkTimeTaken.toFixed(2)} milliseconds`);
 
      const invoiceData: IInvoiceData = {
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
        },
        paymentDetails: {
            payeeAddress: requestData.payee?.value as string,
            payerAddress: requestData.payer?.value as string,
            // ! REPLACE THIS WITH ACTUAL CHAIN
            chain: "EDU",
            currency: requestData.currencyInfo.value,
            streamType: "linear",
            dueDate: Date.now(),
            totalAmount: requestData.expectedAmount,
            invoiceItems: requestData.contentData.invoiceItems,

        }
      }

      return NextResponse.json(invoiceData);

  
    //   return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
  }