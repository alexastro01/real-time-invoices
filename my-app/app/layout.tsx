import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { SessionWrapper } from "@/components/SessionWrapper";
import { Analytics } from '@vercel/analytics/react';
import PlausibleProvider from 'next-plausible'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://streambill.xyz'),
  title: "StreamBill.xyz",
  description: "StreamBill.xyz - Streaming invoices onchain.",
  openGraph: {
    title: "Join StreamBill.xyz Waitlist",
    description: "StreamBill.xyz - Streaming invoices onchain.",
    url: "https://streambill.xyz",
    siteName: "StreamBill.xyz",
    images: [
      {
        url: "https://www.streambill.xyz/waitlist.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join StreamBill.xyz Waitlist",
    description: "StreamBill.xyz - Revolutionizing payments for teachers using blockchain technology.",
    site: "@_alexastro",
    creator: "@_alexastro",
    images: ["https://www.streambill.xyz/waitlist.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mx-2`}>
      <Providers>
      <PlausibleProvider domain="streambill.xyz">
        <SessionWrapper>
      <main>
        {children}
        <Analytics />
       </main>
       <Toaster />
       </SessionWrapper>
       </PlausibleProvider>
       </Providers> 
        </body>
    </html>
  );
}
