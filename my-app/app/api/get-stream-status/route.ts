import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { Chain } from 'viem';
import { arbitrumSepolia, baseSepolia } from 'viem/chains';

const chains: Record<ValidChainId, Chain> = {
    656476: {
        id: 656476,
        name: 'Open Campus',
        nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
        rpcUrls: {
            default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
        },
    } as const,
    84532: baseSepolia,
    421614: arbitrumSepolia,
};

export async function POST(request: Request) {


  try {
    const body = await request.json();
    const { requestId, streamId } = body;

    if (!requestId || !streamId) {
      return NextResponse.json(
        { success: false, error: 'Request ID and Stream ID are required' },
        { status: 400 }
      );
    }
    console.log(requestId)
    console.log(streamId)
    const { data, error } = await supabaseClient
    .from('invoices')
    .select('stream_id, chain_id') // Select both stream_id and chain_id
    .eq('request_id', requestId)
    .single();

        
    const contractAddress = contracts[data?.chain_id as ValidChainId].sablierLinearV2LockUpAddress?.toLowerCase();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No invoice found with the given Request ID' },
        { status: 404 }
      );
    }

    

    return NextResponse.json({ success: true, data: data?.stream_id }, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice with stream ID' },
      { status: 500 }
    );
  }
}