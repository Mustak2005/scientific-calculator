// ============================================================
// ScientificGrid.tsx
// Extended button layout for the Scientific tab.
// Adds trig, log, sqrt, power, constants, and a DEG/RAD toggle.
// ============================================================
import { useEffect } from "react";
import { motion } from "framer-motion";

interface ScientificGridProps {
  onKeyPress: (key: string) => void;
  isDegrees: boolean;
  setIsDegrees: (val: boolean) => void;
}

// Top row: scientific function buttons
const sciButtons: { label: string }[] = [
  { label: "sin"   },
  { label: "cos"   },
  { label: "tan"   },
  { label: "sin⁻¹" },
  { label: "cos⁻¹" },
  { label: "tan⁻¹" },
  { label: "log"   },
  { label: "ln"    },
  { label: "√"     },
  { label: "^"     },
  { label: "π"     },
  { label: "e"     },
];

// Bottom rows: shared with basic calculator
const basicButtons: { label: string; type: string; span?: number }[] = [
  { label: "AC",  type: "danger" },
  { label: "DEL", type: "danger" },
  { label: "(",   type: "operator" },
  { label: ")",   type: "operator" },
  { label: "7",   type: "number" },
  { label: "8",   type: "number" },
  { label: "9",   type: "number" },
  { label: "÷",   type: "operator" },
  { label: "4",   type: "number" },
  { label: "5",   type: "number" },
  { label: "6",   type: "number" },
  { label: "×",   type: "operator" },
  { label: "1",   type: "number" },
  { label: "2",   type: "number" },
  { label: "3",   type: "number" },
  { label: "−",   type: "operator" },
  { label: "0",   type: "number" },
  { label: ".",   type: "number" },
  { label: "Ans", type: "func" },
  { label: "+",   type: "operator" },
  { label: "=",   type: "primary", span: 4 },
];

export function ScientificGrid({
  onKeyPress,
  isDegrees,
  setIsDegrees,
}: ScientificGridProps) {
  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key;
      if (key === "Enter")     key = "=";
      if (key === "Escape")    key = "AC";
      if (key === "Backspace") key = "DEL";
      if (key === "*")         key = "×";
      if (key === "/")         key = "÷";
      if (key === "-")         key = "−";

      const valid = [
        "0","1","2","3","4","5","6","7","8","9",
        ".","+" ,"−","×","÷","%","=","AC","DEL","(",")",
      ];
      if (valid.includes(key)) {
        e.preventDefault();
        onKeyPress(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className="flex flex-col gap-3">
      {/* DEG / RAD toggle */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Angle
        </span>
        <button
          onClick={() => setIsDegrees(!isDegrees)}
          data-testid="btn-deg-rad"
          className="flex items-center bg-black/40 rounded-full p-1 border border-primary/20 w-16 relative"
        >
          <motion.div
            className="absolute h-5 w-7 bg-primary rounded-full"
            animate={{ left: isDegrees ? 4 : 34 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <span className="z-10 text-[10px] w-1/2 text-center font-bold text-white mix-blend-difference">
            DEG
          </span>
          <span className="z-10 text-[10px] w-1/2 text-center font-bold text-white mix-blend-difference">
            RAD
          </span>
        </button>
      </div>

      {/* Scientific function buttons */}
      <div className="grid grid-cols-4 gap-2">
        {sciButtons.map((btn, i) => (
          <motion.button
            key={`sci-${i}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onKeyPress(btn.label)}
            data-testid={`btn-${btn.label}`}
            className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md py-2 text-xs tracking-wider hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-colors"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      <div className="h-px bg-primary/20 my-1 w-full" />

      {/* Shared basic buttons */}
      <div className="grid grid-cols-4 gap-2">
        {basicButtons.map((btn, i) => (
          <motion.button
            key={`basic-${i}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onKeyPress(btn.label)}
            data-testid={`btn-${btn.label}`}
            className={[
              "relative overflow-hidden rounded-lg text-sm tracking-wider transition-colors",
              btn.span ? `col-span-${btn.span}` : "",
              btn.type === "danger"
                ? "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] py-2"
                : "",
              btn.type === "operator"
                ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,160,255,0.4)] py-2"
                : "",
              btn.type === "number"
                ? "bg-white/5 text-foreground border border-white/10 hover:bg-white/10 hover:border-white/20 py-2"
                : "",
              btn.type === "func"
                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 py-2"
                : "",
              btn.type === "primary"
                ? "bg-primary text-white border border-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,160,255,0.6)] py-2"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
