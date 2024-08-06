import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, UserCircle, DockIcon } from "lucide-react"

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 flex flex-col h-screen w-64 shrink-0 bg-background border-r border-accent p-4">
      <Link href="/" className="flex items-center mb-6">
        <Image src="/logo_cropped.png" width={48} height={48} alt="Stream Bill logo"/>
        <span className="ml-2 font-semibold">StreamBill</span>
      </Link>
      <nav className="flex-1">
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/dashboard"
              className="flex w-full items-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/create-invoice"
              className="flex w-full items-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              <DockIcon className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex w-full items-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <ConnectButton accountStatus="address" />
      </div>
    </header>
  )
}