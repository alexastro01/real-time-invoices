import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '../ui/badge'
import { Clock, DollarSign } from 'lucide-react'
import GigCreatorPreview from '../gigs/GigCreatorPreview'

interface GigDetailsProps {
    title: string;
    description: string;
    delivery_time: number;
    totalAmount: number;
    creator: string;
    isRejected: boolean;
}

const GigDetails: React.FC<GigDetailsProps> = ({
    title,
    description,
    delivery_time,
    totalAmount,
    creator,
    isRejected
}: GigDetailsProps) => {
    return (
        <Card className="border-none shadow-lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {isRejected ? "This gig has been rejected" : `Delivery Time: ${delivery_time} days`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
                {!isRejected && (
                    <>
                        <p className="mt-4">Total Amount: {totalAmount} tUSDC</p>
                        <p>Creator: {creator}</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default GigDetails