// ============================================================
// ButtonGrid.tsx
// Basic calculator button layout (4-column grid).
// Also wires up keyboard listeners for number/operator keys.
// ============================================================
import { useEffect } from "react";
import { motion } from "framer-motion";

interface ButtonGridProps {
  onKeyPress: (key: string) => void;
}

// Button definitions — label + visual type
const buttons: { label: string; type: string; span?: number }[] = [
  { label: "AC",  type: "danger" },
  { label: "DEL", type: "danger" },
  { label: "%",   type: "operator" },
  { label: "÷",   type: "operator" },
  { label: "7",   type: "number" },
  { label: "8",   type: "number" },
  { label: "9",   type: "number" },
  { label: "×",   type: "operator" },
  { label: "4",   type: "number" },
  { label: "5",   type: "number" },
  { label: "6",   type: "number" },
  { label: "−",   type: "operator" },
  { label: "1",   type: "number" },
  { label: "2",   type: "number" },
  { label: "3",   type: "number" },
  { label: "+",   type: "operator" },
  { label: "0",   type: "number" },
  { label: ".",   type: "number" },
  { label: "(",   type: "operator" },
  { label: ")",   type: "operator" },
  { label: "=",   type: "primary", span: 4 },
];

export function ButtonGrid({ onKeyPress }: ButtonGridProps) {
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
    <div className="grid grid-cols-4 gap-3">
      {buttons.map((btn, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onKeyPress(btn.label)}
          data-testid={`btn-${btn.label}`}
          className={[
            "relative overflow-hidden rounded-lg text-lg tracking-wider transition-colors py-3",
            btn.span ? `col-span-${btn.span}` : "",
            btn.type === "danger"
              ? "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
              : "",
            btn.type === "operator"
              ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,160,255,0.4)]"
              : "",
            btn.type === "number"
              ? "bg-white/5 text-foreground border border-white/10 hover:bg-white/10 hover:border-white/20"
              : "",
            btn.type === "primary"
              ? "bg-primary text-white border border-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,160,255,0.6)]"
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
  );
}
