/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ac0kWm2CqXf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { ShimmerButtonDemo } from "./ShimmerButtonDemo"
import { Button } from "./ui/button"
import LoomDemo from "./LoomDemo"

export default function Hero() {
  return (
    <section className="w-full pt-12 md:pt-24 lg:pt-32">
      <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-1 lg:gap-12">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-center">
              Real time invoices
            </h1>
            <p className="text-muted-foreground md:text-xl text-center">
              Real time invoicing for students, teachers, freelancers and more ! Using Sablier and Request Network
            </p>
          </div>

          <ShimmerButtonDemo />

        
      
       
        </div>
      {/* <LoomDemo /> */}
      </div>
    </section>
  )
}