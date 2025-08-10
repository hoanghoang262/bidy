import React from "react";
import AboutHero from "../../components/ui/AboutHero";
import Vision from "../../components/ui/Vision";
import FAQ from "../../components/ui/FAQ";
import News from "../../components/home/News";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen">
      <AboutHero />
      <div
        className="w-full"
        style={{
          background: `linear-gradient(50deg, 
          var(--background) 0%, 
          var(--accent-foreground) 40%, 
          var(--accent-gold-light) 50%, 
          var(--accent-foreground) 60%, 
          var(--background) 100%)`,
        }}
      >
        <Vision />
        <FAQ />
        <News />
      </div>
    </div>
  );
}
