# 🧠 MindVault

> AI-driven mental health companion — secured with **Web3 & blockchain** for true cyber resilience.
> Built for the *"Beyond the Horizon: AI-Driven Digital Innovation"* theme · **Health & Wellbeing Technology**.

MindVault is a calming, highly-personalised "safe haven" for mental wellbeing. It pairs an
empathetic AI with a privacy-first, patient-controlled data model: every journal entry is
encrypted on-device and anchored to the blockchain, so your inner world stays yours alone.

---

## ✨ Features

| Area | What it does |
| --- | --- |
| **Dynamic Theming** | Global CSS-variable engine with three ready-to-use palettes — **One Dark** (cool night), **Gruvbox** (warm vintage), **Material** (clean light). Switch live from the top bar. |
| **Dashboard & Sentiment Aura** | Personalised greeting, a prominent *Web3 Secure* badge, and an animated CSS/SVG **mood "Aura"** that breathes slowly when *Calm* and turns fast/sharp/warm when *Anxious*. |
| **Adaptive Journaling** | A smooth switch between **AI Chat Mode** (empathetic conversation) and **Zen Mode** (distraction-free, auto-expanding writing with a pixel-art companion pet and a flashing *"Encrypting & saving to blockchain…"* indicator). |
| **Anti-OVT Panic Mode** | A persistent **Panic Button** + AI auto-trigger that dims everything and offers three interventions: **Box Breathing** (4-4-4-4), **Grounding 5-4-3-2-1** carousel, and **Brain Dump** (each sentence fades away after 5s). Ends with a Calm Badge + EXP cool-down. |
| **Gamification & Quests** | AI "Game Master" daily quests across **Social Anxiety**, **Specific Phobia**, and **Burnout** tracks, satisfying confetti on completion, and a **Rewards Hub** to spend EXP on companion cosmetics, teleconsult vouchers, or charity donations. |
| **Teleconsultation & Web3 Privacy** | Psychiatrist directory with availability badges and a **Smart Contract Consent** modal — explicitly authorise a doctor to read your 7-day AI journal summary, signed on-chain and revocable. |

---

## 🚀 Getting started

```bash
npm install      # install React + Vite
npm run dev      # start the app at http://localhost:5173
```

That's it — the prototype runs fully on local seed data, no backend required.

### Optional: run the API scaffold

```bash
npm run server   # zero-dependency Node API on http://localhost:4000
# then set USE_MOCK = false in src/lib/api.js
```

Or run both together: `npm run dev:all`.

---

## 🏗️ Architecture

```
mindvault/
├─ index.html
├─ src/
│  ├─ main.jsx              # entry + providers
│  ├─ App.jsx              # app shell / view routing / zen layout
│  ├─ context/            # ThemeContext, AppContext (mood, EXP, panic, toasts)
│  ├─ components/         # Aura, Sidebar, Topbar, PanicMode, QuestCard, Modal, …
│  ├─ pages/              # Dashboard, Journal, Quests, Teleconsult
│  ├─ lib/                # api.js (REST client), data.js (seed), web3.js (chain sim)
│  └─ styles/             # themes.css · global.css · features.css
└─ server/
   ├─ index.js            # Node.js reference API (matches src/lib/api.js routes)
   └─ prisma/schema.prisma# Prisma data model (User, JournalEntry, Quest, Consent, …)
```

**Designed for integration:** the frontend already talks to the backend through a single
`src/lib/api.js` client whose function signatures match the `server/` routes and Prisma
models. Moving from mock data to a live Node.js + Prisma database is a per-endpoint swap,
not a rewrite.

## 🎨 Design system notes

- **Typography:** Inter (UI) + Press Start 2P (pixel companion).
- **Shape & motion:** 12–16px border radii, soft drop shadows, CSS micro-interactions on every
  interactive element, and `prefers-reduced-motion` support throughout.
- **Theming:** every colour is a CSS variable scoped to `[data-theme]`, so palettes swap with a
  single attribute change and zero re-render cost.
- **Responsive:** mobile-first; the sidebar collapses to an off-canvas drawer on small screens.

> ⚠️ This is a high-fidelity **prototype**. The AI replies, encryption, and blockchain anchoring
> are simulated for demonstration. It is not a medical device and does not provide medical advice.
