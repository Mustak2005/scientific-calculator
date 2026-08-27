// ============================================================
// HistoryPanel.tsx
// Shows every calculation that has been performed, tagged by
// type (Basic / Scientific / Equation / LCM / HCF).
// Each entry has a copy button and a timestamp.
// ============================================================
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Clock } from "lucide-react";
import type { HistoryEntry, HistoryType } from "@/pages/Calculator";

interface HistoryPanelProps {
  history: HistoryEntry[];
  clearHistory: () => void;
}

// Visual config per type
const TYPE_CONFIG: Record<
  HistoryType,
  { label: string; color: string; border: string; accent: string }
> = {
  basic:      { label: "Basic",       color: "text-cyan-400",    border: "border-cyan-500/40",    accent: "bg-cyan-500"   },
  scientific: { label: "Scientific",  color: "text-indigo-400",  border: "border-indigo-500/40",  accent: "bg-indigo-500" },
  equation:   { label: "Equation",    color: "text-emerald-400", border: "border-emerald-500/40", accent: "bg-emerald-500"},
  lcm:        { label: "LCM",         color: "text-amber-400",   border: "border-amber-500/40",   accent: "bg-amber-500"  },
  hcf:        { label: "HCF",         color: "text-rose-400",    border: "border-rose-500/40",    accent: "bg-rose-500"   },
};

export function HistoryPanel({ history, clearHistory }: HistoryPanelProps) {
  const handleCopy = (entry: HistoryEntry) => {
    const cfg = TYPE_CONFIG[entry.type];
    navigator.clipboard.writeText(
      `[${cfg.label}] ${entry.expression} = ${entry.result}`
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3
          className="text-primary text-sm tracking-wider flex items-center gap-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <Clock className="w-4 h-4" />
          Calculation History
        </h3>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            data-testid="btn-clear-history"
            className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-xs uppercase tracking-wider transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Count */}
      {history.length > 0 && (
        <p className="text-[10px] text-muted-foreground/40 mb-3 font-mono tracking-widest uppercase">
          {history.length} calculation{history.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Scrollable list */}
      <div
        className="flex-1 overflow-y-auto pr-1 space-y-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,160,255,0.2) transparent" }}
      >
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-40 flex flex-col items-center justify-center text-muted-foreground/40 text-sm italic text-center gap-2"
            >
              <Clock className="w-8 h-8 opacity-30" />
              <span>No calculations yet</span>
              <span className="text-xs">Start computing!</span>
            </motion.div>
          ) : (
            history.map((entry, i) => {
              const cfg = TYPE_CONFIG[entry.type];
              return (
                <motion.div
                  key={`${entry.timestamp}-${i}`}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-black/30 border ${cfg.border} rounded-lg p-3 group hover:bg-black/50 transition-all relative overflow-hidden`}
                >
                  {/* Coloured left accent stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg ${cfg.accent}`} />

                  <div className="pl-3">
                    {/* Type badge + timestamp */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] tracking-widest uppercase ${cfg.color} px-1.5 py-0.5 rounded border ${cfg.border} bg-black/20`}
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40 font-mono">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Expression */}
                    <div className="text-xs text-muted-foreground/70 font-mono mt-1 truncate">
                      {entry.expression}
                    </div>

                    {/* Result */}
                    <div className="text-base text-foreground mt-0.5">
                      ={" "}
                      <span className={entry.result === "Undefined" ? "text-amber-400" : "text-white"}>
                        {entry.result}
                      </span>
                    </div>
                  </div>

                  {/* Copy button — appears on hover */}
                  <button
                    onClick={() => handleCopy(entry)}
                    title="Copy"
                    data-testid={`btn-copy-history-${i}`}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
