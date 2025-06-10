import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { SuccessStories } from "@/components/home/success-stories";
import { Pricing } from "@/components/home/pricing";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-rose-50 to-white">
      <Hero />
      <Features />
      <HowItWorks />
      <SuccessStories />
      <Pricing />
    </div>
  );
}
