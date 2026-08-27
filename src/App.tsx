// Root application component
// Renders the WelcomeAnimation on first load, then shows the Calculator
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Calculator } from "@/pages/Calculator";

export default function App() {
  // Controls whether the welcome screen is still showing
  const [welcomed, setWelcomed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#050810] text-white overflow-hidden relative">
      {/* Animated floating particle background */}
      <ParticleBackground />

      {/* Welcome animation — fades out after ~2 seconds */}
      <AnimatePresence>
        {!welcomed && (
          <WelcomeAnimation onComplete={() => setWelcomed(true)} />
        )}
      </AnimatePresence>

      {/* Main calculator — shown after welcome */}
      {welcomed && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-start py-6 px-4">
          {/* Page title */}
          <h1
            className="font-display text-primary text-xs tracking-[0.4em] uppercase mb-6 opacity-60"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Scientific Calculator
          </h1>

          {/* Calculator card */}
          <Calculator />

          {/* Footer */}
          <footer className="mt-8 text-[11px] font-mono text-muted-foreground/40 tracking-widest uppercase text-center">
            Developed by Shaik Mohammed Mustak
          </footer>
        </div>
      )}
    </div>
  );
}
