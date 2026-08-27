// ============================================================
// WelcomeAnimation.tsx
// Fullscreen intro screen that types the title character by
// character, then calls onComplete() so App can show the calc.
// ============================================================
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [text, setText] = useState("");
  const fullText = "SCIENTIFIC CALCULATOR";

  useEffect(() => {
    let index = 0;
    // Type one character every 50 ms
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        // Small pause after typing finishes, then dismiss
        setTimeout(onComplete, 600);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Scan-line glow bar that sweeps down */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-x-0 h-full rounded"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0,160,255,0.15), transparent)",
            borderTop: "2px solid rgba(0,160,255,0.8)",
            transformOrigin: "top",
          }}
        />

        {/* Typing title */}
        <h1
          className="relative z-10 text-3xl md:text-5xl tracking-[0.35em] text-primary"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(0,160,255,0.8), 0 0 40px rgba(0,160,255,0.4)",
          }}
        >
          {text}
          {/* Blinking cursor */}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
          >
            _
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="text-xs tracking-[0.5em] text-primary/60 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Developed by Shaik Mohammed Mustak
        </motion.p>
      </div>
    </motion.div>
  );
}
