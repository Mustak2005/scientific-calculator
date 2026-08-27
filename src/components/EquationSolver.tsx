// ============================================================
// EquationSolver.tsx
// Step-by-step linear equation solver + formula reference.
// Accepts addToHistory to log equation results in History tab.
// ============================================================
import { useState } from "react";
import { solveEquation } from "@/lib/calculator";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import type { HistoryType } from "@/pages/Calculator";

interface EquationSolverProps {
  addToHistory: (type: HistoryType, expression: string, result: string) => void;
}

// Common math formulas shown as a reference card grid
const FORMULAS = [
  {
    title: "Area of a Circle",
    formula: "A = πr²",
    note: "r = radius",
  },
  {
    title: "Pythagorean Theorem",
    formula: "a² + b² = c²",
    note: "right triangle sides",
  },
  {
    title: "Quadratic Formula",
    formula: "x = (−b ± √(b²−4ac)) / 2a",
    note: "for ax² + bx + c = 0",
  },
  {
    title: "Simple Interest",
    formula: "I = P × R × T / 100",
    note: "P = principal, R = rate, T = time",
  },
];

export function EquationSolver({ addToHistory }: EquationSolverProps) {
  const [equation, setEquation] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);

  const handleSolve = () => {
    if (!equation.trim()) return;
    const { steps: solvedSteps, answer } = solveEquation(equation);
    setSteps(solvedSteps);
    const hasError = solvedSteps[0]?.startsWith("Error");
    setIsError(hasError);
    // Log successful solutions to history
    if (!hasError && answer) {
      addToHistory("equation", equation, `x = ${answer}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Solver Section ── */}
      <div className="space-y-4">
        <label
          className="text-sm text-primary tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Linear Equation Solver
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g. 2x + 5 = 15"
            className="flex-1 bg-black/40 border border-primary/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            data-testid="input-equation"
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSolve}
            data-testid="btn-solve"
            className="bg-primary text-white px-4 py-2 rounded-lg tracking-wider hover:shadow-[0_0_15px_rgba(0,160,255,0.5)] transition-all flex items-center gap-2 text-sm"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <Calculator className="w-4 h-4" />
            SOLVE
          </motion.button>
        </div>

        {/* Step-by-step result */}
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-4 font-mono text-sm space-y-2 ${
              isError
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-black/30 border-emerald-500/20 text-emerald-300/90"
            }`}
          >
            {steps.map((step, i) => (
              <div key={i} className={step.startsWith("Error") ? "text-destructive" : ""}>
                {step}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="h-px bg-primary/20 w-full" />

      {/* ── Formula Reference ── */}
      <div className="space-y-4">
        <label
          className="text-sm text-primary tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Formula Reference
        </label>
        <div className="grid gap-3">
          {FORMULAS.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-primary/20 transition-colors"
            >
              <div
                className="text-primary text-xs mb-1 tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {f.title}
              </div>
              <div className="font-mono text-sm text-foreground">{f.formula}</div>
              <div className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">
                {f.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
