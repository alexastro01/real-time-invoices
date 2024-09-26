import React, { useState } from "react";
import { generateRequestParameters } from "@/utils/request-network/generateRequestParamaters";
import { useWalletClient } from "wagmi";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PingAnimation from "@/components/helpers/PingAnimation";
import RequestConfirmed from "@/components/create-invoice/RequestConfirmed";
import Spinner from "@/components/helpers/Spinner";
import Image from "next/image";
import { generateRequestParamatersFromGig } from "@/utils/request-network/generateRequestParamtersFromGig";

interface UserDetails {
  evmAddress: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  created_at: string;
}

interface CreateRequestFromGigProps {
  payerDetails: UserDetails | null;
  gigPrice: number;
  recipientAddress: string;
  dueDate: number;
  chainId: string;
  gigId: string;
}

const CreateRequestFromGig: React.FC<CreateRequestFromGigProps> = ({
  payerDetails,
  gigPrice,
  gigId,
  recipientAddress,
  dueDate,
  chainId
}) => {
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClick = async () => {
    if (!payerDetails || !gigPrice || !recipientAddress || !dueDate || !chainId) {
      alert("Missing required information");
      return;
    }

    setIsConfirmed(false);
    setLoading(true);
    setDialogOpen(true);
    setDialogMessage("Creating Request...");

    try {
      const web3SignatureProvider = new Web3SignatureProvider(walletClient);
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://gnosis.gateway.request.network",
        },
        signatureProvider: web3SignatureProvider,
      });





      const requestParameters = generateRequestParamatersFromGig({
        payeeIdentity: recipientAddress,
        payerIdentity: payerDetails.evmAddress,
        expectedAmount: gigPrice.toString(),
        dueDate: dueDate,
        invoiceItems: [{ name: "Gig Payment", quantity: 1, price: gigPrice }],
        tokenAddress: "0xc75ab970D9492f6b04d66153CcCED146e60A7D5B", // USDC on Gnosis
        expectedFlowRate: "15",
        chain: chainId
      });

      console.log("Request Parameters:", requestParameters);
      
      const request = await requestClient.createRequest(requestParameters);
      setDialogMessage("Request Created Successfully! Confirming Request...");

      const confirmedRequestData = await request.waitForConfirmation();
      setDialogMessage("Request Confirmed");

      console.log(confirmedRequestData.requestId);

      // Create invoice in Supabase
      const response = await fetch('/api/post-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: confirmedRequestData.requestId,
          payeeDetails: { evmAddress: recipientAddress },
          payerDetails,
          payerEVMAddress: payerDetails.evmAddress,
          payeeEVMAddress: recipientAddress,
          expectedAmount: gigPrice,
          dueDate: dueDate,
          chain: chainId,
          gateway: 'gnosis',
          gigId: gigId
        }),
      });

      setRequestId(confirmedRequestData.requestId);

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      setDialogMessage("Request Created Successfully");
      setIsConfirmed(true);
    } catch (error: any) {
      console.log(error)
      alert('Error: gnosis gateway')
      setDialogMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="w-full" onClick={handleClick} disabled={loading}>
        <Image src="/logo_cropped.png" alt="Streambill" width={30} height={30} className="w-6 h-6 mr-2" /> Pay with Streambill
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConfirmed ? "Request created" : "Creating Request"}    <PingAnimation color="blue" size="small" /></DialogTitle>
          </DialogHeader>
          {loading && !isConfirmed &&
            <div className="flex flex-col items-center justify-center p-4">
              <Spinner className="mb-4" />
              <p>{dialogMessage}</p>
            </div>
          }
          {isConfirmed &&
            <div className="flex flex-col items-center justify-center p-4">
              <RequestConfirmed requestId={requestId} />
            </div>
          }
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRequestFromGig;