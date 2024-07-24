import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { generateRequestParameters } from "@/utils/request-network/generateRequestParamaters";
import { generateRequestParamatersParams } from "@/types/types";
import { useWalletClient } from "wagmi";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork } from "@requestnetwork/request-client.js";

import Spinner from "../helpers/Spinner";
import ShimmerButton from "../magicui/shimmer-button";
import RequestConfirmed from "./RequestConfirmed";


interface CreateRequestButtonProps {
  payeeEVMAddress: string;
  payerEVMAddress: string;
  payeeDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payerDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  expectedAmount: string;
  dueDate: number;
  reason: string;
  expectedFlowRate: string;
}

const CreateRequestButton: React.FC<CreateRequestButtonProps> = ({
  payeeEVMAddress,
  payerEVMAddress,
  payeeDetails,
  payerDetails,
  expectedAmount,
  dueDate,
  reason,
  expectedFlowRate,
}) => {
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [linkState, setLinkState] = useState("");

  const handleClick = async () => {
    if (!payerEVMAddress || !expectedAmount || !dueDate || !reason) {
      alert("Please fill in all the fields");
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
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
      });

    //   const flowRate = calculateUSDCPerSecond(dueDate.toString(), parseInt(expectedAmount));
      
      const requestParameters = generateRequestParameters({
        payeeIdentity: payeeEVMAddress,
        payerIdentity: payerEVMAddress,
        expectedAmount,
        dueDate,
        reason,
        tokenAddress: "0xc75ab970D9492f6b04d66153CcCED146e60A7D5B",
        expectedFlowRate: "15"
      });

      console.log("Request Parameters:", requestParameters);

      const request = await requestClient.createRequest(requestParameters);
      setDialogMessage("Request Created Successfully! Confirming Request...");
      

      const confirmedRequestData = await request.waitForConfirmation();
      setDialogMessage("Request Confirmed");

      console.log(confirmedRequestData.requestId);
      
      setLinkState(`https://wavein.vercel.app/confirm-wavein/${confirmedRequestData.requestId}`);

        // Create invoice in Supabase
        const response = await fetch('/api/post-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId: confirmedRequestData.requestId,
            payeeDetails,
            payerDetails,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create invoice');
        }
    
        setDialogMessage("Request Created Successfully");
        setIsConfirmed(true);
        setLoading(false)

    } catch(error: any) {
        console.log(error)
      setDialogMessage(`Error: ${error.message}`);
      setLoading(false)
    } finally {

    //   setIsConfirmed(false);
    }
  };

  useEffect(() => {
    console.log(dueDate);
  }, [dueDate]);

  return (
    <>
      <ShimmerButton onClick={handleClick} className=" mt-0" disabled={loading}>
        {loading ? "Loading..." : "Create Invoice"}
      </ShimmerButton>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConfirmed ? "Request created" : "Creating Request"}</DialogTitle>
          </DialogHeader>
          {loading === true && isConfirmed === false &&
           <div className="flex flex-col items-center justify-center p-4">
          
           <Spinner className="mb-4" />
           <p>{dialogMessage}</p>
         </div>  
        }

          {isConfirmed === true &&
           <div className="flex flex-col items-center justify-center p-4">
          
             <RequestConfirmed />
           
         </div>  
        }
       
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRequestButton;