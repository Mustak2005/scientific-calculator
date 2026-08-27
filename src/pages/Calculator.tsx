// ============================================================
// Calculator.tsx — Main container with tab state and history
// ============================================================
import { useState } from "react";
import { Display } from "@/components/Display";
import { ButtonGrid } from "@/components/ButtonGrid";
import { ScientificGrid } from "@/components/ScientificGrid";
import { EquationSolver } from "@/components/EquationSolver";
import { LcmHcf } from "@/components/LcmHcf";
import { HistoryPanel } from "@/components/HistoryPanel";
import { evaluateExpression, UNDEFINED_RESULT } from "@/lib/calculator";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// ── Types ──────────────────────────────────────────────────

/** The tab/source a history entry came from */
export type HistoryType = "basic" | "scientific" | "equation" | "lcm" | "hcf";

/** One entry in the calculation history list */
export type HistoryEntry = {
  type: HistoryType;
  expression: string;
  result: string;
  timestamp: number;
};

// ── Component ─────────────────────────────────────────────

export function Calculator() {
  const [activeTab, setActiveTab] = useState("basic");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isDegrees, setIsDegrees] = useState(true); // DEG / RAD toggle
  const [ans, setAns] = useState("0");             // last answer

  // ── Add to history ──────────────────────────────────────
  /** Called by any tab after a successful calculation */
  const addToHistory = (
    type: HistoryType,
    expr: string,
    res: string
  ) => {
    setHistory((prev) => [
      { type, expression: expr, result: res, timestamp: Date.now() },
      ...prev,
    ]);
  };

  // ── Calculate ──────────────────────────────────────────
  const handleCalculate = () => {
    if (!expression) return;
    try {
      const res = evaluateExpression(expression, isDegrees);
      const resStr = String(res);
      setResult(resStr);
      setAns(resStr);
      addToHistory(
        activeTab === "basic" ? "basic" : "scientific",
        expression,
        resStr
      );
    } catch (e: unknown) {
      const msg = (e as Error).message || "Error";
      setResult(msg);
      // Undefined is a valid math result — still log it
      if (msg === UNDEFINED_RESULT) {
        addToHistory(
          activeTab === "basic" ? "basic" : "scientific",
          expression,
          UNDEFINED_RESULT
        );
      }
    }
  };

  // ── Button / keyboard handler ───────────────────────────
  const handleKeyPress = (key: string) => {
    if (key === "AC") { setExpression(""); setResult(""); return; }
    if (key === "DEL") { setExpression((p) => p.slice(0, -1)); return; }
    if (key === "=")   { handleCalculate(); return; }
    if (key === "Ans") { setExpression((p) => p + ans); return; }

    setExpression((prev) => {
      // Trig / log / sqrt buttons auto-append an opening bracket
      const funcKeys = [
        "sin", "cos", "tan",
        "sin⁻¹", "cos⁻¹", "tan⁻¹",
        "log", "ln", "√",
      ];
      return funcKeys.includes(key) ? prev + key + "(" : prev + key;
    });
  };

  // ── Live result preview while typing ───────────────────
  useEffect(() => {
    if (!expression) return;
    try {
      const res = evaluateExpression(expression, isDegrees);
      setResult(String(res));
    } catch (e: unknown) {
      if ((e as Error).message === UNDEFINED_RESULT) setResult(UNDEFINED_RESULT);
      // Ignore other parse errors while the user is mid-expression
    }
  }, [expression, isDegrees]);

  // ── Tab config ─────────────────────────────────────────
  const tabs = [
    { id: "basic",      label: "Basic" },
    { id: "scientific", label: "Scientific" },
    { id: "equation",   label: "Equation" },
    { id: "lcm-hcf",   label: "LCM/HCF" },
    { id: "history",    label: "History" },
  ];

  return (
    <div className="w-full max-w-md bg-[#0a0d18]/60 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-[0_0_50px_rgba(0,160,255,0.1)] overflow-hidden flex flex-col z-10 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-primary/20 overflow-x-auto no-scrollbar p-1 relative z-10 bg-black/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-display tracking-wider transition-all whitespace-nowrap relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/70"
            }`}
            data-testid={`tab-${tab.id}`}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(0,160,255,0.8)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="p-5 flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[400px]"
          >
            {/* Basic / Scientific share the Display + grid */}
            {(activeTab === "basic" || activeTab === "scientific") && (
              <>
                <Display expression={expression} result={result} />
                {activeTab === "basic" ? (
                  <ButtonGrid onKeyPress={handleKeyPress} />
                ) : (
                  <ScientificGrid
                    onKeyPress={handleKeyPress}
                    isDegrees={isDegrees}
                    setIsDegrees={setIsDegrees}
                  />
                )}
              </>
            )}

            {activeTab === "equation" && (
              <EquationSolver addToHistory={addToHistory} />
            )}
            {activeTab === "lcm-hcf" && (
              <LcmHcf addToHistory={addToHistory} />
            )}
            {activeTab === "history" && (
              <HistoryPanel
                history={history}
                clearHistory={() => setHistory([])}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
