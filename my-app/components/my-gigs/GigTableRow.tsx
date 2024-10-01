import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CalendarIcon, DollarSignIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Gig } from './GigsTable'; // Make sure to export the Gig type from GigsTable



interface GigTableRowProps {
  gig: Gig;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: Gig['status']) => string;
  shortenAddress: (address: string) => string;
}

const GigTableRow: React.FC<GigTableRowProps> = ({ 
  gig, 
  formatDate, 
  formatCurrency, 
  getStatusColor, 
  shortenAddress 
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {formatDate(gig.createdDate)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{gig.clientName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          {shortenAddress(gig.clientName)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {formatCurrency(gig.amountStreaming)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {formatDate(gig.endDate)}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusColor(gig.status)} text-white`}>
          {gig.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Link href={`/gig-status/${gig.requestId}`}>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            See Status
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default GigTableRow;