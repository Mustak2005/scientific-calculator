# Scientific Calculator

A modern futuristic Scientific Calculator built with React + Vite + TypeScript.

**Developed by Shaik Mohammed Mustak**

---

## Features

- **Basic Tab** — arithmetic with keyboard support (+ − × ÷ % brackets)
- **Scientific Tab** — sin, cos, tan (+ inverses), log, ln, √, powers, π, e · DEG/RAD toggle · standard 12th-grade trig table values · `Undefined` for tan(90°) etc.
- **Equation Solver** — step-by-step linear equations (e.g. `2x + 5 = 15`) + formula reference
- **LCM/HCF Tab** — LCM and HCF calculators with full working steps shown
- **History Tab** — every calculation logged with type badge, timestamp, and copy button
- Animated particle background · glassmorphism UI · welcome typewriter animation · neon blue cyberpunk theme

---

## Requirements

| Tool       | Version        |
|------------|---------------|
| Node.js    | **v20 or v22** (LTS recommended) |
| npm        | v10+ (bundled with Node 20/22) |

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.
> ```bash
> nvm install 20
> nvm use 20
> ```

---

## Getting Started

### 1. Open the project in VS Code

```
File → Open Folder → select sci-calc-standalone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app opens automatically at **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

---

## Project Structure

```
sci-calc-standalone/
├── index.html                  ← HTML shell, loads Google Fonts
├── package.json                ← Dependencies and scripts
├── vite.config.ts              ← Vite + Tailwind CSS v4 config
├── tsconfig.json               ← TypeScript config
├── README.md
└── src/
    ├── main.tsx                ← Entry point (mounts React)
    ├── App.tsx                 ← Root: welcome → calculator
    ├── index.css               ← Global CSS, CSS variables, Tailwind v4
    ├── lib/
    │   └── calculator.ts       ← ALL math logic (trig, eval, LCM, HCF, solver)
    ├── pages/
    │   └── Calculator.tsx      ← Main component: tabs + history state
    └── components/
        ├── Display.tsx         ← Calculator screen
        ├── ButtonGrid.tsx      ← Basic tab button grid + keyboard listener
        ├── ScientificGrid.tsx  ← Scientific tab buttons + DEG/RAD toggle
        ├── EquationSolver.tsx  ← Step-by-step solver + formula reference
        ├── LcmHcf.tsx          ← LCM & HCF calculators
        ├── HistoryPanel.tsx    ← Scrollable history list
        ├── WelcomeAnimation.tsx← Fullscreen typewriter intro
        └── ParticleBackground.tsx ← Animated canvas particles
```

---

## Keyboard Shortcuts (Basic & Scientific tabs)

| Key          | Action         |
|--------------|----------------|
| `0–9`, `.`   | Input digits   |
| `+`, `-`, `*`, `/` | Operators  |
| `Enter`      | Calculate `=`  |
| `Backspace`  | Delete (DEL)   |
| `Escape`     | Clear (AC)     |
| `(`, `)`     | Brackets       |
| `%`          | Percentage     |

---

## Troubleshooting

**`npm install` fails** — Make sure you are on Node 20 or 22:
```bash
node --version   # should print v20.x.x or v22.x.x
```

**Port already in use** — Change the port in `vite.config.ts`:
```ts
server: { port: 3000 }
```

**Fonts not loading** — Requires an internet connection (Google Fonts CDN). To use offline, download the font files and update `index.html` and `src/index.css`.
