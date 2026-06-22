# MindVault

AI-driven mental health web app (React + Vite) with a CSS-variable theming engine, Web3/blockchain
trust signals, and a Node.js + Prisma backend scaffold. See `README.md` for run/build commands and
architecture.

## Design Context

This project has impeccable design context. **Read these before any UI work:**

- **`PRODUCT.md`** — strategy: register (`product`), users, purpose, brand personality
  (*serene · trustworthy · encouraging*), anti-references, and design principles.
- **`DESIGN.md`** — the visual system: Creative North Star (**"The Safe Haven"**), the three theme
  palettes (One Dark / Gruvbox / Material), typography, elevation, components, and Do's & Don'ts.
  Token frontmatter is normative; `.impeccable/design.json` carries ramps, motion, and snippets.

**Core principles (full text in PRODUCT.md):**
1. **Calm is the feature** — every screen lowers heart rate (Anxious Aura is the one exception).
2. **Safety you can feel, not read** — privacy via quiet signals, not reassurance copy.
3. **The user is always in control** — revocable consent, "stop anytime," user-set pace.
4. **Progressive disclosure under load** — one primary action per screen; relief one tap away.
5. **Warmth without weight** — supportive gamification, never childish or manipulative.

**Hard guardrails:** all color through CSS variables (never hardcode hex); body/muted text ≥4.5:1 in
every theme; soft coral (`#e06c75`) for distress, never harsh red; full `prefers-reduced-motion`
support; no clinical-EHR, cold-SaaS, or crypto-hype aesthetics; no >1px colored side-stripe accents.
