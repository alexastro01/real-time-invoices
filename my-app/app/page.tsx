import Navbar from "@/components/Navbar";

import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import { MarqueeDemo } from "@/components/landing-page/MarqueePeople";
import PeopleShowcase from "@/components/landing-page/PeopleShowcase";

export default function Home() {
  return (
    <main className="">
    <Navbar />
    <Hero />
    {/* <Benefits /> */}
    <Features />
     <PeopleShowcase />
    </main>
  );
}
