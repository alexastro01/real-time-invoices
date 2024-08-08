import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem, decodeEventLog, Chain, Hex } from 'viem';
import { abi } from '@/abi/SablierLinear'; // Make sure this import is correct
import { sablierLinearV2LockUpAddress } from '@/constants/addresses'; // Adjust the import path as needed
import { baseSepolia, arbitrumSepolia } from 'viem/chains';

const MAX_RETRIES = 60;
const RETRY_INTERVAL = 1000; // 0.8 seconds

const opencampus = {
  id: 656476,
  name: 'Open Campus',
  nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
  },
} as const satisfies Chain;

const chains = {
  656476: opencampus,
  84532: baseSepolia,
  421614: arbitrumSepolia,
};

async function addStreamIdToInvoice(requestId: string, streamId: string) {
  console.log(`Attempting to add stream ID ${streamId} to invoice ${requestId}`);
  const response = await fetch(`${process.env.API_BASE_URL}/api/add-stream-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requestId,
      streamId,
    }),
  });

  if (!response.ok) {
    console.error(`Failed to add stream ID to invoice. Status: ${response.status}`);
    throw new Error('Failed to add stream ID to invoice');
  }

  const result = await response.json();
  console.log('Successfully added stream ID to invoice:', result);
  return result;
}

export async function POST(request: Request) {
  console.log('Received POST request to /api/get-stream-id');
  
  let body;
  try {
    body = await request.json();
    console.log('Request body:', body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { transactionHash, chainId, requestId } = body;

  if (!transactionHash || !chainId || !requestId) {
    console.error('Missing required parameters');
    return NextResponse.json({ error: 'Missing transactionHash, chainId, or requestId' }, { status: 400 });
  }

  console.log(`Processing request for transaction: ${transactionHash}, chain: ${chainId}, requestId: ${requestId}`);

  const chain = chains[chainId as keyof typeof chains];
  if (!chain) {
    console.error(`Unsupported chain: ${chainId}`);
    return NextResponse.json({ error: 'Unsupported chain' }, { status: 400 });
  }

  console.log(`Using chain: ${chain.name}`);

  const client = createPublicClient({
    chain,
    transport: http(),
  });

  let retries = 0;

  while (retries < MAX_RETRIES) {
    console.log(`Attempt ${retries + 1} to fetch transaction receipt`);
    try {
      const receipt = await client.getTransactionReceipt({ hash: transactionHash as `0x${string}` });

      if (receipt) {
        console.log('Transaction receipt found:', receipt);
        const relevantLogs = receipt.logs.filter(
          (log) => log.address.toLowerCase() === sablierLinearV2LockUpAddress.toLowerCase()
        );

        for (const log of relevantLogs) {
          console.log('Processing log:', log);

          try {
            const decodedLog = decodeEventLog({
              abi,
              data: log.data,
              topics: log.topics as [Hex, ...Hex[]],
            });

            console.log('Decoded log:', decodedLog);

            if (decodedLog.eventName === 'MetadataUpdate' && decodedLog.args) {
              console.log('MetadataUpdate event found');
              //@ts-ignore
              const streamId = decodedLog.args._tokenId.toString();
              console.log(`Stream ID found: ${streamId}`);

              try {
                await addStreamIdToInvoice(requestId, streamId);
                console.log('Stream ID successfully added to invoice');
                return NextResponse.json({ streamId, message: 'Stream ID added to invoice successfully' });
              } catch (error) {
                console.error('Error adding stream ID to invoice:', error);
                return NextResponse.json({ error: 'Failed to add stream ID to invoice' }, { status: 500 });
              }
            }
          } catch (decodeError) {
            console.error('Error decoding log:', decodeError);
          }
        }

        console.log('No MetadataUpdate event found in this receipt');
      } else {
        console.log('No receipt found for this attempt');
      }
    } catch (error) {
      console.error('Error fetching transaction receipt:', error);
    }

    retries++;
    console.log(`Waiting ${RETRY_INTERVAL}ms before next attempt`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  console.log('Max retries reached without finding stream ID');
  return NextResponse.json({ error: 'Stream ID not found after maximum retries' }, { status: 404 });
}