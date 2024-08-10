
'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, UserCircle, FileText, DollarSignIcon } from "lucide-react"
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/create-invoice", icon: FileText, label: "Create Invoice" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
    { href: "/mint-tusdc", icon: DollarSignIcon, label: "Get test usdc"}
  ]

  return (
    <header className="fixed left-0 top-0 flex flex-col h-screen w-64 shrink-0 bg-background border-r border-accent p-4">
      <Link href="/" className="flex items-center mb-6">
        <Image src="/logo_cropped.png" width={48} height={48} alt="Stream Bill logo"/>
        <span className="ml-2 font-semibold">StreamBill</span>
      </Link>
      <nav className="flex-1">
        <ul className="flex flex-col gap-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                  pathname === item.href ? 'bg-accent text-accent-foreground' : 'bg-background'
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <ConnectButton accountStatus="address" chainStatus={"icon"} showBalance={false}/>
      </div>
    </header>
  )
}