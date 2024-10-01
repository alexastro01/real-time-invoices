import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, DollarSignIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

type Gig = {
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

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch('/api/get-paid-gigs-of-freelancer')
        if (!response.ok) {
          throw new Error('Failed to fetch gig data')
        }
        const data: Gig[] = await response.json()
        setGigs(data)
      } catch (error) {
        console.error('Error fetching gig data:', error)
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
  

  return (
    <div className="mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Gigs in Progress</h1>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Freelancer</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Amount Streaming</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gigs.map((gig) => (
              <TableRow key={gig.id}>
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
                    {shortenAddress(gig.clientName) }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{gig.freelancerName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {shortenAddress(gig.freelancerName) }
                  </div>
                </TableCell>
                <TableCell>
                  <Progress value={gig.progress} className="w-[60%]" />
                  <span className="ml-2 text-sm text-muted-foreground">{gig.progress}%</span>
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
              <Link href={`/gig-status/${gig.requestId}`} >
                <Button
    
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <ExternalLinkIcon className="mr-2 h-4 w-4" />
                  See Gig
                </Button>
              </Link>
            </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}