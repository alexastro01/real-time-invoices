import Navbar from "@/components/Navbar";

import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import { MarqueeDemo } from "@/components/landing-page/MarqueePeople";
import PeopleShowcase from "@/components/landing-page/PeopleShowcase";
import { MagicTweet } from "@/components/landing-page/MagicTweet";
import FollowTheJourney from "@/components/landing-page/FollowTheJourney";
import JoinWaitlistForm from "@/components/landing-page/JoinWaitlistForm";

export default function Home() {
  return (
    <main className="">
    <Navbar />
    <Hero />
    {/* <Benefits /> */}
    <Features />
     <PeopleShowcase />
 
     <FollowTheJourney />
    </main>
  );
}
