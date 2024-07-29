/**
 * v0 by Vercel.
 * @see https://v0.dev/t/iPmURCa2xQk
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { CircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 ">
      <Link href="/" className="mr-6 flex items-center" >
       <Image src={"/logo_cropped.png"} width={48} height={48} alt="Stream Bill logo"/>
        <span className="ml-2 font-semibold">StreamBill</span>
      </Link>
      <nav className="hidden lg:flex">
        <ul className="flex items-center gap-4">
        <li>
            <Link
              href="/create-invoice"
              className="inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            
            >
              Create Invoice
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard"
              className="inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
     
            >
              Dashboard
            </Link>
          </li>
      
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-2">
       <ConnectButton  accountStatus="address" /> 
      </div>
    </header>
  )
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}