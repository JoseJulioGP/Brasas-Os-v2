import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { ProblemSolution } from "./ProblemSolution";
import { FeaturesSection } from "./FeaturesSection";
import { ImpactMetrics } from "./ImpactMetrics";
import { Differentiator } from "./Differentiator";
import { LandingFooter } from "./LandingFooter";

export const LandingPage = () => (
  <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
    <LandingNavbar />
    <HeroSection />
    <ProblemSolution />
    <FeaturesSection />
    <ImpactMetrics />
    <Differentiator />
    <LandingFooter />
  </div>
);
