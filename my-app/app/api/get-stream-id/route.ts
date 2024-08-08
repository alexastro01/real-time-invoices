import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem, decodeEventLog, Chain, Hex } from 'viem';
import { abi } from '@/abi/SablierLinear';
import { sablierLinearV2LockUpAddress } from '@/constants/addresses';
import { baseSepolia, arbitrumSepolia } from 'viem/chains';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';

const MAX_RETRIES = 60;
const INITIAL_RETRY_INTERVAL = 500;
const MAX_RETRY_INTERVAL = 5000;

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

function customJSONStringify(obj: any, space?: number): string {
    return JSON.stringify(obj, (key, value) => 
      typeof value === 'bigint'
        ? value.toString()
        : value
    , space);
  }
  
  function logObject(label: string, obj: any) {
    console.log(`${label}:`);
    console.log(customJSONStringify(obj, 2));
  }

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

function extractStreamIdFromLog(log: any): string | null {
    logObject('Attempting to extract stream ID from log', log);
  
    try {
      const decodedLog = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
  
      logObject('Decoded log', decodedLog);
  
      if (decodedLog.eventName === 'MetadataUpdate' && decodedLog.args && '_tokenId' in decodedLog.args) {
        //@ts-ignore
        console.log('Found MetadataUpdate event with _tokenId:', decodedLog.args._tokenId.toString());
        //@ts-ignore
        return decodedLog.args._tokenId.toString();
      }
  
      if (decodedLog.eventName === 'CreateLockupLinearStream' && decodedLog.args && 'streamId' in decodedLog.args) {
        //@ts-ignore
        console.log('Found CreateLockupLinearStream event with streamId:', decodedLog.args.streamId.toString());
        //@ts-ignore
        return decodedLog.args.streamId.toString();
      }
  
      console.log('Decoded event does not match expected events:', decodedLog.eventName);
    } catch (decodeError) {
      console.error('Error decoding log:', decodeError);
    }
  
    // Fallback: Check for MetadataUpdate event signature
    if (log.topics[0] === '0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7') {
      console.log('Found MetadataUpdate event signature');
      const streamId = BigInt(log.data).toString();
      console.log('Extracted streamId from MetadataUpdate data:', streamId);
      return streamId;
    }
  
    // Fallback: Check for CreateLockupLinearStream event signature
    if (log.topics[0] === '0x44cb432df42caa86b7ec73644ab8aec922bc44c71c98fc330addc75b88adbc7c') {
      console.log('Found CreateLockupLinearStream event signature');
      const streamId = BigInt('0x' + log.data.slice(2, 66)).toString();
      console.log('Extracted streamId from CreateLockupLinearStream data:', streamId);
      return streamId;
    }
  
    // If we still haven't found the stream ID, try to extract from raw data
    if (log.data && log.data.length >= 66) {
      console.log('Attempting to extract streamId from log data');
      const streamId = BigInt('0x' + log.data.slice(2, 66)).toString();
      console.log('Potential streamId from data:', streamId);
      if (streamId !== '0') {
        return streamId;
      }
    }
  
    console.log('Could not extract stream ID from this log');
    return null;
  }


  export async function POST(request: Request) {
    let body;
    try {
      body = await request.json();
      logObject('Received POST request to /api/get-stream-id', body);
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
    let retryInterval = INITIAL_RETRY_INTERVAL;
  
    // Get the contract address for the given chainId, or use a fallback method
    const contractAddress = contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress
    if (!contractAddress) {
      console.warn(`No contract address found for chainId ${chainId}. Will process all logs.`);
    }
    if (!contractAddress) {
        console.warn(`No contract address found for chainId ${chainId}. Will process all logs.`);
      }
    
  
    while (retries < MAX_RETRIES) {
      console.log(`Attempt ${retries + 1} to fetch transaction receipt`);
      try {
        const receipt = await client.getTransactionReceipt({ hash: transactionHash as `0x${string}` });
  
        if (receipt) {
          logObject('Transaction receipt found', receipt);
          
          // If we have a contract address, filter logs. Otherwise, process all logs.
       
          const logsToProcess = contractAddress
             //@ts-ignore
            ? receipt.logs.filter(log => log.address.toLowerCase() === contractAddress.toLowerCase())
            : receipt.logs;
  
          for (const log of logsToProcess) {
            const streamId = extractStreamIdFromLog(log);
            if (streamId) {
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
          }
  
          console.log('No suitable event found in this receipt to extract stream ID');
        } else {
          console.log('No receipt found for this attempt');
        }
      } catch (error) {
        console.error('Error fetching transaction receipt:', error);
      }
  
      retries++;
      console.log(`Waiting ${retryInterval}ms before next attempt`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      
      retryInterval = Math.min(retryInterval * 1.5, MAX_RETRY_INTERVAL);
    }
  
    console.log('Max retries reached without finding stream ID');
    return NextResponse.json({ error: 'Stream ID not found after maximum retries' }, { status: 404 });
  }