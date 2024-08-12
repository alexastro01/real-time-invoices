'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, UserCircle, FileText, DollarSignIcon } from "lucide-react"
import { usePathname } from 'next/navigation'
import { Badge } from "./ui/badge"
import { useEffect } from 'react';
import LoginButton from "./edu-connect/LoginButton"
//@ts-ignore
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useAccount } from 'wagmi'
import UserProfileCard from "./edu-connect/UserProfileEdu"


export default function Navbar() {
  const pathname = usePathname()
  const { authState: eduConnectAuthState, ocAuth } = useOCAuth();
  const { chain } = useAccount()

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/create-invoice", icon: FileText, label: "Create Invoice" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
    { href: "/mint-tusdc", icon: DollarSignIcon, label: "Get test usdc"}
  ]

  useEffect(() => {
    console.log(eduConnectAuthState);
  }, [eduConnectAuthState]);

  const renderOCAuth = () => {
    if (chain?.id !== 656476) {
      return null; // Don't render anything if not on the correct chain
    }

    if (eduConnectAuthState.error) {
      return <div>Error: {eduConnectAuthState.error.message}</div>;
    }
    
    if (eduConnectAuthState.isLoading) {
      return <div>Loading...</div>;
    }

    if (eduConnectAuthState.isAuthenticated) {
      const authInfo = ocAuth.getAuthInfo();
      return (
        <UserProfileCard 
          eduUsername={authInfo.edu_username}
          ethAddress={authInfo.eth_address}
        />
      );
    } else {
      return <LoginButton />;
    }
  };

  return (
    <header className="fixed left-0 top-0 flex flex-col h-screen w-64 shrink-0 bg-background border-r border-accent p-4">
      <Link href="/" className="flex items-center mb-6">
        <Image src="/logo_cropped.png" width={48} height={48} alt="Stream Bill logo"/>
        <span className="ml-2 font-semibold">StreamBill<span className="text-gray-400 text-xs ml-1">testnet</span></span>
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
      <div className="mt-auto space-y-4">
        {renderOCAuth()}
        <ConnectButton accountStatus="address" chainStatus={"icon"} showBalance={false}/>
      </div>
    </header>
  )
}