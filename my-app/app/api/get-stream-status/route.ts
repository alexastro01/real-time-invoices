import { NextResponse } from 'next/server';
import { contracts } from '@/utils/contracts/contracts';
import { Chain, createPublicClient, http, defineChain } from 'viem';
import { arbitrum, base } from 'viem/chains';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';

const openCampus = defineChain({
  id: 41923,
  name: 'Open Campus',
  nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.edu-chain.raas.gelato.cloud'] },
  },
});

const morph = defineChain({
  id: 2818,
  name: 'Morph',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-quicknode.morphl2.io'] },
  },
});



const chains: Record<ValidChainId, Chain> = {
  41923: openCampus,
  8453: base,
  42161: arbitrum,
  2818: morph
};

// Add this ABI fragment for the statusOf function
const sablierABI = [
  {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "streamId",
            "type": "uint256"
        }
    ],
    "name": "statusOf",
    "outputs": [
        {
            "internalType": "enum Lockup.Status",
            "name": "status",
            "type": "uint8"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
] as const;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
    //@ts-ignore
    if(!session || !session.user?.address){
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

  try {
    const body = await request.json();
    const { requestId, streamId } = body;

    const supabase = createAuthenticatedSupabaseClient(session);

    if (!requestId || !streamId) {
      return NextResponse.json(
        { success: false, error: 'Request ID and Stream ID are required' },
        { status: 400 }
      );
    }
    

    const { data, error } = await supabase
      .from('testnet_invoices')
      .select('stream_id, chain_id')
      .eq('request_id', requestId)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No invoice found with the given Request ID' },
        { status: 404 }
      );
    }

    const chainId = data.chain_id as ValidChainId;
    const contractAddress = contracts[chainId].sablierLinearV2LockUpAddress?.toLowerCase();

    if (!contractAddress) {
      throw new Error(`No contract address found for chain ID ${chainId}`);
    }

    // Create a public client for the specific chain
    const publicClient = createPublicClient({
      chain: chains[chainId],
      transport: http(),
    });

    // Call the statusOf function
    const status = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: sablierABI,
      functionName: 'statusOf',
      args: [BigInt(streamId)],
    });

    // Map the status number to a human-readable string
    const statusMap = ['PENDING', 'STREAMING', 'SETTLED', 'CANCELED'];
    const statusString = statusMap[Number(status)] || 'UNKNOWN';

    console.log({
      stream_id: data.stream_id,
      status: statusString
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        stream_id: data.stream_id,
        status: statusString
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stream status' },
      { status: 500 }
    );
  }
}