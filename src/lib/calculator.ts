// ============================================================
// calculator.ts — All math logic for the Scientific Calculator
//
// Contains:
//   - evaluateExpression()  basic + scientific expression eval
//   - solveEquation()       step-by-step linear equation solver
//   - computeLCM()          LCM with working steps
//   - computeHCF()          HCF/GCD with Euclidean steps
// ============================================================

// Sentinel string returned / thrown when a value is mathematically
// undefined (e.g. tan 90°).
export const UNDEFINED_RESULT = "Undefined";

// ── Helpers ────────────────────────────────────────────────

/**
 * Round a number to 10 significant figures to eliminate
 * floating-point noise (e.g. sin(180°) → 0, not 1.2e-16).
 * Also snaps values that are within 1e-9 of an integer to
 * that exact integer, so sin(30°) = 0.5 exactly.
 */
function precise(x: number): number {
  const rounded = parseFloat(x.toPrecision(10));
  const int = Math.round(rounded);
  if (Math.abs(rounded - int) < 1e-9) return int;
  return rounded;
}

/** Convert degrees to radians */
function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ── Degree / Radian aware trig ─────────────────────────────

/**
 * Build a set of trig functions that respect the current angle mode.
 * Inverse functions (asin / acos / atan) return degrees when in degree mode.
 */
function makeTrigFns(isDeg: boolean) {
  const conv     = isDeg ? toRad    : (x: number) => x;
  const convBack = isDeg
    ? (r: number) => r * (180 / Math.PI)
    : (x: number) => x;

  // sin — always defined
  const sin = (x: number): number => precise(Math.sin(conv(x)));

  // cos — always defined
  const cos = (x: number): number => precise(Math.cos(conv(x)));

  // tan — undefined at 90°, 270° and equivalents
  const tan = (x: number): number => {
    if (isDeg) {
      const normalized = ((x % 360) + 360) % 360;
      if (
        Math.abs(normalized - 90) < 1e-9 ||
        Math.abs(normalized - 270) < 1e-9
      ) {
        throw new Error(UNDEFINED_RESULT);
      }
    } else {
      // Radian mode: undefined when cos ≈ 0
      if (Math.abs(Math.cos(x)) < 1e-10) throw new Error(UNDEFINED_RESULT);
    }
    return precise(Math.tan(conv(x)));
  };

  const asin = (x: number): number => precise(convBack(Math.asin(x)));
  const acos = (x: number): number => precise(convBack(Math.acos(x)));
  const atan = (x: number): number => precise(convBack(Math.atan(x)));

  return { sin, cos, tan, asin, acos, atan };
}

// ── Expression Evaluator ───────────────────────────────────

/**
 * Safely evaluate a math expression string.
 *
 * Strategy: replace all function names / symbols with
 * double-underscore prefixed placeholders, then inject the
 * real implementations as named parameters into a new Function.
 * This avoids eval() and keeps the sandbox tight.
 *
 * Throws Error("Undefined")      — for mathematically undefined results
 * Throws Error("Division by zero") — for ÷0
 * Throws Error("Error")          — for any other invalid expression
 */
export function evaluateExpression(
  expression: string,
  isDegrees: boolean = true
): number {
  if (!expression || expression.trim() === "") return 0;

  const { sin, cos, tan, asin, acos, atan } = makeTrigFns(isDegrees);
  const ln    = (x: number) => precise(Math.log(x));
  const log10 = (x: number) => precise(Math.log10(x));
  const sqrt  = (x: number) => precise(Math.sqrt(x));

  try {
    let expr = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/π/g, String(Math.PI))
      // Standalone 'e' only (word boundary avoids matching 'sin', 'cos' etc.)
      .replace(/\be\b/g, String(Math.E))
      // Inverse trig — MUST come before plain trig replacements
      .replace(/sin⁻¹/g, "__asin")
      .replace(/cos⁻¹/g, "__acos")
      .replace(/tan⁻¹/g, "__atan")
      // Plain trig
      .replace(/sin/g, "__sin")
      .replace(/cos/g, "__cos")
      .replace(/tan/g, "__tan")
      // Logarithms
      .replace(/\bln\b/g, "__ln")
      .replace(/\blog\b/g, "__log10")
      // Square root symbol
      .replace(/√/g, "__sqrt");

    // Power operator: a^b  →  Math.pow(a, b)
    expr = expr.replace(
      /(\w+|\([^)]+\))\^([0-9.]+)/g,
      "Math.pow($1, $2)"
    );

    // Safety guard — only allow chars that can appear in a valid expression
    if (!/^[0-9+\-*/().\sMatha-zA-Z_,]+$/.test(expr)) {
      throw new Error("Invalid expression");
    }

    // Inject all helper functions as named parameters — no global access needed
    const fn = new Function(
      "__sin", "__cos", "__tan",
      "__asin", "__acos", "__atan",
      "__ln", "__log10", "__sqrt",
      `"use strict"; return (${expr});`
    );

    const result: number = fn(
      sin, cos, tan,
      asin, acos, atan,
      ln, log10, sqrt
    );

    if (typeof result !== "number") throw new Error("Error");
    if (!isFinite(result)) throw new Error("Division by zero");

    return precise(result);
  } catch (e: unknown) {
    const msg = (e as Error).message;
    // Re-throw Undefined so caller can display it (not an "Error" state)
    if (msg === UNDEFINED_RESULT) throw e;
    throw new Error(
      msg === "Division by zero" ? "Division by zero" : "Error"
    );
  }
}

// ── Equation Solver ───────────────────────────────────────

/**
 * Solve a simple linear equation of the form:  ax + b = c
 *
 * Returns an array of human-readable steps and the final answer.
 *
 * Examples:
 *   "2x + 5 = 15"  →  x = 5
 *   "3x = 9"       →  x = 3
 *   "x - 4 = 10"   →  x = 14
 */
export function solveEquation(
  equation: string
): { steps: string[]; answer: string } {
  const steps: string[] = [];

  try {
    steps.push(`Step 1: Write the equation: ${equation}`);

    // Split on '=' to get left and right sides
    const parts = equation.replace(/\s+/g, "").split("=");
    if (parts.length !== 2) throw new Error();

    const right = parseFloat(parts[1]);
    if (isNaN(right)) throw new Error();

    const left = parts[0];

    // Match pattern: (coefficient)x(optional constant)
    // e.g. "2x+5", "-x-3", "x"
    const match = left.match(
      /^(-?[0-9]*\.?[0-9]*)x([+-][0-9]*\.?[0-9]*)?$/
    );
    if (!match) throw new Error();

    const a =
      match[1] === "" ? 1 : match[1] === "-" ? -1 : parseFloat(match[1]);
    const b = match[2] ? parseFloat(match[2]) : 0;

    if (b !== 0) {
      // Step: move constant to right side
      const rightNew = right - b;
      const op = b > 0 ? "Subtract" : "Add";
      steps.push(
        `Step 2: ${op} ${Math.abs(b)} from both sides: ${a}x = ${rightNew}`
      );
      if (a !== 1) {
        const answer = rightNew / a;
        steps.push(`Step 3: Divide both sides by ${a}: x = ${answer}`);
        return { steps, answer: String(answer) };
      } else {
        steps.push(`Step 3: Solution: x = ${rightNew}`);
        return { steps, answer: String(rightNew) };
      }
    } else {
      if (a !== 1) {
        const answer = right / a;
        steps.push(`Step 2: Divide both sides by ${a}: x = ${answer}`);
        return { steps, answer: String(answer) };
      } else {
        steps.push(`Step 2: Solution: x = ${right}`);
        return { steps, answer: String(right) };
      }
    }
  } catch {
    return {
      steps: [
        "Error: Unsupported format. Please use simple linear forms like: 2x + 5 = 15",
      ],
      answer: "",
    };
  }
}

// ── LCM ───────────────────────────────────────────────────

/** Greatest common divisor (Euclidean algorithm) */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm2(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Compute LCM for 2 or more positive integers.
 * Returns the result and a list of human-readable working steps.
 */
export function computeLCM(
  numbers: number[]
): { result: number; steps: string[] } {
  if (numbers.length < 2) {
    return { result: 0, steps: ["Please provide at least 2 numbers"] };
  }

  const steps: string[] = [];
  steps.push(`Numbers: ${numbers.join(", ")}`);
  steps.push("Method: Successive LCM");

  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    const prev = result;
    result = lcm2(result, numbers[i]);
    steps.push(`LCM(${prev}, ${numbers[i]}) = ${result}`);
  }

  steps.push(`► LCM = ${result}`);
  return { result, steps };
}

// ── HCF ───────────────────────────────────────────────────

/**
 * Compute HCF/GCD for 2 or more positive integers.
 * Shows each Euclidean division step.
 */
export function computeHCF(
  numbers: number[]
): { result: number; steps: string[] } {
  if (numbers.length < 2) {
    return { result: 0, steps: ["Please provide at least 2 numbers"] };
  }

  const steps: string[] = [];
  steps.push(`Numbers: ${numbers.join(", ")}`);
  steps.push("Method: Euclidean Algorithm");

  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    let a = result;
    let b = numbers[i];
    while (b !== 0) {
      steps.push(
        `GCD(${a}, ${b}): ${a} = ${Math.floor(a / b)} × ${b} + ${a % b}`
      );
      const t = b;
      b = a % b;
      a = t;
    }
    result = a;
    steps.push(`GCD at this step = ${result}`);
  }

  steps.push(`► HCF = ${result}`);
  return { result, steps };
}
