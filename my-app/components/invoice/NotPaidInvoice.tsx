import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface NotPaidInvoiceProps {
  requestId: string;
}

const NotPaidInvoice: React.FC<NotPaidInvoiceProps> = ({ requestId }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareInvoice = () => {
    const link = `http://localhost:3000/pay-invoice/${requestId}`;
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The invoice link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 3000); // Reset after 3 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "There was an error copying the link. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p className="text-center text-lg font-semibold">
          The invoice has not been paid yet
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={handleShareInvoice}
          disabled={isCopied}
        >
          {isCopied ? "Link Copied!" : "Share invoice to payer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotPaidInvoice;