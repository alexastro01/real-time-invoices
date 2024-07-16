import { DotPatternDemo } from "@/components/DotPatternDemo";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    </main>
  );
}
