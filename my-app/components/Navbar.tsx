'use client';

import React from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, UserCircle, FileText, DollarSign, Menu } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
// @ts-ignore
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LoginButton from "./edu-connect/LoginButton";
import UserProfileCard from "./edu-connect/UserProfileEdu";
import { ModeToggle } from './mode-toggle';




const chainIdToStablecoinLink: { [key: number]: string } = {
  //Morph holesky
  2810: "https://testnet.bulbaswap.io/swap", // Morph holesky
  //Arbitrum sepolia
  421614: "/mint-tusdc", // Mint arbitrum sepolia tusdc
  //Base sepolia
  84532: "/mint-tusdc", // Mint base sepolia tusdc
  //Edu chain
  656476: "/mint-tusdc", // Mint edu chain tusdc
};


export default function Navbar() {


  const {chainId} = useAccount();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/create-invoice", icon: FileText, label: "Create Invoice" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
    { href: '/mint-tusdc', icon: DollarSign, label: "Get test stablecoin" }
  ];


  const pathname = usePathname();
  const { authState: eduConnectAuthState, ocAuth } = useOCAuth();
  const { chain } = useAccount();

  useEffect(() => {
    // console.log(eduConnectAuthState);
  }, [eduConnectAuthState]);

  const renderOCAuth = () => {
    if (chain?.id !== 656476) {
      return null;
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

  const NavContent = () => (
    <>
      <Link href="/" className="flex items-center mb-6">
        <Image src="/logo_cropped.png" width={48} height={48} alt="Stream Bill logo"/>
        <span className="ml-2 font-semibold">StreamBill<span className="text-gray-400 text-xs ml-1">testnet</span></span>
      </Link>
      <nav className="lg:flex-1">
        <ul className="flex flex-col gap-4">
          {navItems.map((item) => (
            <li key={item.label}>
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
        <div className='hidden lg:block'>
          <ModeToggle />
        <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false}/>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Navbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-background border-b border-accent p-4 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center">
          <Image src="/logo_cropped.png" width={32} height={32} alt="Stream Bill logo"/>
          <span className="ml-2 font-semibold">StreamBill</span>
        </Link>
        <ConnectButton  accountStatus='avatar' chainStatus="icon" showBalance={false} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <header className="hidden lg:flex fixed left-0 top-0 lg:flex-col h-screen w-64 shrink-0 bg-background border-r border-accent p-4">
        <NavContent />
      </header>
    </>
  );
}