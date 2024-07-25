import Navbar from "@/components/Navbar";

import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import { MarqueeDemo } from "@/components/landing-page/MarqueePeople";

export default function Home() {
  return (
    <main className="">
    <Navbar />
    <Hero />
    {/* <Benefits /> */}
    <Features />
    <MarqueeDemo />
    </main>
  );
}
