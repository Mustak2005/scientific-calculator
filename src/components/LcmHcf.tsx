// ============================================================
// LcmHcf.tsx
// Two calculators:
//   LCM — Least Common Multiple with working steps
//   HCF — Highest Common Factor / GCD with Euclidean steps
// Results are automatically added to History.
// ============================================================
import { useState } from "react";
import { computeLCM, computeHCF } from "@/lib/calculator";
import { motion } from "framer-motion";
import type { HistoryType } from "@/pages/Calculator";

interface LcmHcfProps {
  addToHistory: (type: HistoryType, expression: string, result: string) => void;
}

export function LcmHcf({ addToHistory }: LcmHcfProps) {
  const [inputsLcm, setInputsLcm] = useState("");
  const [inputsHcf, setInputsHcf] = useState("");
  const [resultLcm, setResultLcm] = useState<{ result: number; steps: string[] } | null>(null);
  const [resultHcf, setResultHcf] = useState<{ result: number; steps: string[] } | null>(null);

  // Parse comma-separated positive integers
  const parseNums = (raw: string): number[] =>
    raw
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

  const handleLcm = () => {
    const nums = parseNums(inputsLcm);
    if (nums.length < 2) return;
    const res = computeLCM(nums);
    setResultLcm(res);
    addToHistory("lcm", `LCM(${nums.join(", ")})`, String(res.result));
  };

  const handleHcf = () => {
    const nums = parseNums(inputsHcf);
    if (nums.length < 2) return;
    const res = computeHCF(nums);
    setResultHcf(res);
    addToHistory("hcf", `HCF(${nums.join(", ")})`, String(res.result));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── LCM Section ── */}
      <div className="space-y-4">
        <label
          className="text-sm text-amber-400 tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          LCM Calculator
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputsLcm}
            onChange={(e) => setInputsLcm(e.target.value)}
            placeholder="e.g. 12, 15, 20"
            className="flex-1 bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all placeholder:text-muted-foreground/50"
            data-testid="input-lcm"
            onKeyDown={(e) => e.key === "Enter" && handleLcm()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLcm}
            data-testid="btn-calc-lcm"
            className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-4 py-2 rounded-lg tracking-wider hover:bg-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all text-sm"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            LCM
          </motion.button>
        </div>

        {resultLcm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 border border-amber-500/20 rounded-lg p-4 font-mono text-sm space-y-1.5"
          >
            {resultLcm.steps.map((step, i) => (
              <div
                key={i}
                className={step.startsWith("►") ? "text-amber-400 font-bold mt-1" : "text-amber-300/70"}
              >
                {step}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="h-px bg-primary/20 w-full" />

      {/* ── HCF Section ── */}
      <div className="space-y-4">
        <label
          className="text-sm text-rose-400 tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          HCF / GCD Calculator
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputsHcf}
            onChange={(e) => setInputsHcf(e.target.value)}
            placeholder="e.g. 24, 36"
            className="flex-1 bg-black/40 border border-rose-500/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30 transition-all placeholder:text-muted-foreground/50"
            data-testid="input-hcf"
            onKeyDown={(e) => e.key === "Enter" && handleHcf()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHcf}
            data-testid="btn-calc-hcf"
            className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-4 py-2 rounded-lg tracking-wider hover:bg-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all text-sm"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            HCF
          </motion.button>
        </div>

        {resultHcf && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 border border-rose-500/20 rounded-lg p-4 font-mono text-sm space-y-1.5"
          >
            {resultHcf.steps.map((step, i) => (
              <div
                key={i}
                className={step.startsWith("►") ? "text-rose-400 font-bold mt-1" : "text-rose-300/70"}
              >
                {step}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
