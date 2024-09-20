import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import Gig from "./Gig"
import AddGigCard from "./AddGigCard"


interface Gig {
  title: string
  description: string
  link: string
  deliveryTime: string
  price: number
}

interface GigsProps {
  profilePicture?: string
  evmAddress?: string
  name?: string
  gigs?: Gig[]
}

export default function Gigs({
  profilePicture = "/placeholder.svg?height=100&width=100",
  evmAddress = "0x1234...5678",
  name = "Anonymous",
  gigs = [
    { 
      title: "Web Development", 
      description: "Full-stack web development using modern technologies.",
      link: "/gig-payment/1",
      deliveryTime: "2 weeks",
      price: 1000,
    },
    { 
      title: "Landing Page Design", 
      description: "Create stunning and conversion-optimized landing pages.",
      link: "https://example.com/landing-page",
      deliveryTime: "5 days",
      price: 500,
    },
    { 
      title: "Smart Contract Development", 
      description: "Develop secure and efficient smart contracts for blockchain applications.",
      link: "https://example.com/smart-contracts",
      deliveryTime: "1 week",
      price: 1500
    },
  ]
}: GigsProps) {
  const initials = name.split(' ').map(n => n[0]).join('')

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profilePicture} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground break-all">{evmAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-2xl font-semibold mb-4">Gigs</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {gigs.map((gig, index) => (
          <Gig 
            key={index} 
            id={index} 
            title={gig.title} 
            description={gig.description} 
            deliveryTime={gig.deliveryTime} 
            link={gig.link} 
            price={gig.price} 
            viewGig={true}  
          />
        ))}
        <AddGigCard /> {/* Add the AddGigCard as the last element */}
      </div>
    </div>
  )
}