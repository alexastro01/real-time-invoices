import { useEffect, useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import GigTableRow from "./GigTableRow"
import GigsTableSkeleton from "./GigTableSkeleton"


export type Gig = {
  id: string
  createdDate: string
  clientName: string
  clientEmail: string
  freelancerName: string
  freelancerEmail: string
  progress: number
  amountStreaming: number
  endDate: string
  status: 'in cliff' | 'rejected' | 'canceled' | 'streaming' | 'settled'
  requestId: string
  streamId: number
  chainId: number
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const getStatusColor = (status: Gig['status']) => {
  switch (status) {
    case 'in cliff':
      return 'bg-yellow-500'
    case 'rejected':
      return 'bg-red-500'
    case 'canceled':
      return 'bg-gray-500'
    case 'streaming':
      return 'bg-blue-500'
    case 'settled':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

export default function GigsTable() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/get-paid-gigs-of-freelancer')
        if (!response.ok) {
          throw new Error('Failed to fetch gig data')
        }
        const data: Gig[] = await response.json()
        setGigs(data)
      } catch (error) {
        console.error('Error fetching gig data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGigs()
  }, [])

  const handleSeeGig = (gigId: string) => {
    console.log(`Viewing gig with ID: ${gigId}`)
    // In a real application, you would navigate to a detailed view of the gig here
  }

  const shortenAddress = (address: string) => {
    if (address.startsWith('0x') && address.length === 42) {
      return `${address.slice(0, 4)}...${address.slice(-2)}`
    }
    return address
  }


  if (isLoading) {
    return <GigsTableSkeleton />
  }

  return (
    <div className="mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Gigs in Progress</h1>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created Date</TableHead>
              <TableHead>Client</TableHead>

              <TableHead>Amount Streaming</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gigs.map((gig) => (
              <GigTableRow key={gig.id} gig={gig} formatDate={formatDate} formatCurrency={formatCurrency} getStatusColor={getStatusColor} shortenAddress={shortenAddress} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}