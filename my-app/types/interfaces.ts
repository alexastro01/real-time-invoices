import { Types, Utils } from "@requestnetwork/request-client.js";
import { SupportedNetwork } from "./types";

export interface IRequestCreateParameters {

  requestInfo: {
  currency: {
    type: Types.RequestLogic.CURRENCY.ERC777;
    value: string;
    network: SupportedNetwork;
  };

  // The expected amount as a string, in parsed units, respecting `decimals`
  // Consider using `parseUnits()` from ethers or viem
  expectedAmount: string;

  // The payee identity. Not necessarily the same as the payment recipient.
  payee: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS;
    value: string;
  };

  // The payer identity. If omitted, any identity can pay the request.
  payer: {
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS;
    value: string;
  };

  timestamp: number;

  // The paymentNetwork is the method of payment and related details.
  paymentNetwork: {
    id: Types.Extension.PAYMENT_NETWORK_ID.ERC777_STREAM;
    parameters: {
      paymentNetworkName: SupportedNetwork;
      paymentAddress: string;
      feeAddress: string;
      feeAmount: string;
    };
  }
   
    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason: string;
      dueDate: string;
    };

    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS;
      value: string;
    };
  }
  
}
