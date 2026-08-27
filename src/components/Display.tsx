// ============================================================
// Display.tsx
// The calculator screen — shows the current expression on top
// and the live result below in large Orbitron font.
// ============================================================

interface DisplayProps {
  expression: string;
  result: string;
}

export function Display({ expression, result }: DisplayProps) {
  return (
    <div className="bg-[#020408]/80 backdrop-blur-md border border-primary/30 rounded-xl p-4 mb-6 shadow-inner relative overflow-hidden flex flex-col items-end justify-end h-32">
      {/* Subtle bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

      {/* Expression being typed (smaller, muted) */}
      <div
        data-testid="display-expression"
        className="text-muted-foreground text-sm font-medium tracking-wider h-6 overflow-hidden w-full text-right opacity-80"
      >
        {expression}
      </div>

      {/* Result / answer (large, glowing) */}
      <div
        data-testid="display-result"
        className="text-foreground text-4xl font-bold tracking-wider w-full text-right mt-2 overflow-hidden"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          textShadow: "0 0 8px rgba(0,160,255,0.5)",
        }}
      >
        {result || "0"}
      </div>
    </div>
  );
}
