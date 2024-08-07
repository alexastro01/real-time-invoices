import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { SessionWrapper } from "@/components/SessionWrapper";
import { Analytics } from '@vercel/analytics/react';
import Navbar from "@/components/Navbar";
import OCConnectWrapper from "@/components/OCConnectWrapper";

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

const opts = {
  redirectUri: 'http://localhost:3000/redirect', // Adjust this URL
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <OCConnectWrapper opts={opts} sandboxMode={true}>

          <SessionWrapper>
            <div className="flex">
              <Navbar /> {/* Add the Navbar here */}
              <main className="flex-1 ml-64 p-4">
                {children}
                <Analytics />
              </main>
            </div>
            <Toaster />
          </SessionWrapper>
          </OCConnectWrapper>
        </Providers>
      </body>
    </html>
  );
}
