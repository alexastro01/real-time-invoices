import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, DollarSignIcon } from "lucide-react"

type Gig = {
  id: string
  createdDate: Date
  clientAvatar: string
  clientName: string
  freelancerAvatar: string
  freelancerName: string
  progress: number
  amountStreaming: number
  endDate: Date
  status: 'in cliff' | 'rejected' | 'canceled' | 'streaming' | 'settled'
}

const gigs: Gig[] = [
  {
    id: '1',
    createdDate: new Date('2023-09-01'),
    clientAvatar: '/placeholder.svg?height=40&width=40',
    clientName: 'Alice Johnson',
    freelancerAvatar: '/placeholder.svg?height=40&width=40',
    freelancerName: 'Bob Smith',
    progress: 75,
    amountStreaming: 1500,
    endDate: new Date('2023-10-15'),
    status: 'streaming',
  },
  {
    id: '2',
    createdDate: new Date('2023-08-15'),
    clientAvatar: '/placeholder.svg?height=40&width=40',
    clientName: 'Carol Davis',
    freelancerAvatar: '/placeholder.svg?height=40&width=40',
    freelancerName: 'David Wilson',
    progress: 30,
    amountStreaming: 800,
    endDate: new Date('2023-11-30'),
    status: 'in cliff',
  },
  {
    id: '3',
    createdDate: new Date('2023-09-10'),
    clientAvatar: '/placeholder.svg?height=40&width=40',
    clientName: 'Eve Brown',
    freelancerAvatar: '/placeholder.svg?height=40&width=40',
    freelancerName: 'Frank Miller',
    progress: 100,
    amountStreaming: 2000,
    endDate: new Date('2023-10-01'),
    status: 'settled',
  },
]

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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

export default function GigsInProgress() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Gigs in Progress</h1>
      <div className="border rounded-lg">
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
                      <AvatarImage src={gig.clientAvatar} alt={gig.clientName} />
                      <AvatarFallback>{gig.clientName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {gig.clientName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={gig.freelancerAvatar} alt={gig.freelancerName} />
                      <AvatarFallback>{gig.freelancerName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {gig.freelancerName}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}