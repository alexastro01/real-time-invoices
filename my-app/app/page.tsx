import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";

export default function Home() {
  return (
    <main className="">
    <Navbar />
    <Hero />
    <Benefits />
    <Features />
    <HowItWorks />
    </main>
  );
}
