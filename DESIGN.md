---
name: MindVault
description: A calming, privacy-first mental health sanctuary — Web3-secured, AI-driven.
colors:
  # Canonical palette = the default theme (One Dark). Gruvbox & Material are
  # documented in the Colors prose; all three are full CSS-variable palettes.
  primary: "#61afef"
  primary-strong: "#4d9ce0"
  accent: "#c678dd"
  success: "#98c379"
  warning: "#e5c07b"
  danger: "#e06c75"
  bg: "#21252b"
  surface: "#282c34"
  surface-2: "#2c313a"
  card: "#2b3038"
  border: "#3a414c"
  ink: "#d7dce5"
  ink-strong: "#f2f4f8"
  ink-muted: "#8a93a3"
  ink-faint: "#5c6573"
typography:
  display:
    fontFamily: "Inter, SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 4vw, 2.2rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  pixel:
    fontFamily: "Press Start 2P, monospace"
    fontSize: "0.74rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "12px"
  md: "14px"
  lg: "16px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  field:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  badge-web3:
    backgroundColor: "{colors.success}"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: "6px 11px"
---

# Design System: MindVault

## 1. Overview

**Creative North Star: "The Safe Haven"**

MindVault is a sanctuary before it is software. Every screen exists to lower the user's heart
rate, not raise it — because the person using it may be anxious, low, or in genuine distress. The
system is built from breathing room, soft light, and warm reassurance: a place to exhale. Layout is
unhurried and uncluttered; one primary action leads each screen; depth is revealed only when asked
for. Motion breathes rather than darts — the one deliberate exception is the **Anxious Aura state**,
which mirrors distress on purpose so that calm can be *felt* as its contrast.

Trust is the second pillar, and it is shown rather than claimed. Privacy and cyber-resilience speak
through quiet, consistent signals — a steady "Web3 Secure" badge, a flashing *"Encrypting & saving
to blockchain…"* line, consent the user actively signs — never through walls of reassurance copy.
Security here is comfort, not a feature brag.

This system explicitly rejects three neighbours. It is **not clinical medical / EHR software**: no
sterile hospital blue-and-white, no dense data-entry forms, nothing that reads as a patient record.
It is **not cold corporate SaaS**: no dashboard-cream default, no hero-metric template, no endless
identical icon-heading-text card grids. And it is **not crypto/Web3 hype**: no neon, no 3D coins, no
glowing hype-bro energy — Web3 here is quiet, user-owned trust. Lighthearted, supportive
gamification (the pixel companion, gentle rewards) is welcome; manipulative or childish gamification
is not.

**Key Characteristics:**
- Sanctuary-first: generous spacing, soft drop shadows, 12–16px rounded corners everywhere.
- Three full theme palettes (One Dark, Gruvbox, Material) driven entirely by CSS variables.
- Breathing, organic motion; the mood Aura is the system's living heartbeat.
- Quiet trust signals over loud reassurance.
- Calm by default; agitation only when deliberately mirroring the user's anxious state.

## 2. Colors

The palette is a calm, low-saturation field anchored by a single soothing blue, with warm/cool
accents reserved for mood and state. MindVault ships **three complete, swappable palettes** selected
via a `[data-theme]` attribute on `<html>`; the frontmatter above documents the default (**One
Dark**). Each theme defines the same CSS-variable contract, so colors are never hardcoded.

### Primary
- **Serene Sky Blue** (`#61afef`, One Dark): the soothing anchor — primary buttons, active nav,
  links, focus rings, the calm Aura. Cool and low-stress by design.
- Theme equivalents: **Amber Hearth** (`#fabd2f`, Gruvbox) and **Trust Indigo** (`#4361ee`,
  Material) carry the same primary role in their palettes.

### Secondary
- **Soft Orchid** (`#c678dd`, One Dark accent): a gentle violet for EXP/rewards, the gamification
  layer, and secondary gradients. Warmth without weight.

### Tertiary (state colors, used sparingly and meaningfully)
- **Reassuring Green** (`#98c379`): success, the "Web3 Secured" badge, the Calm Badge, the encryption
  lock — the color of safety.
- **Gentle Amber** (`#e5c07b`): warnings and "in session" states.
- **Soft Coral** (`#e06c75`): danger, the Panic Button, and the warm pole of the **Anxious Aura**.
  Never alarmist red — coral keeps even distress humane.

### Neutral
- **Deep Calm** (`#21252b`, One Dark bg): the page field — a restful dark blue-grey, never pure black.
- **Surface** (`#282c34`) / **Card** (`#2b3038`): tonal layers that lift content gently off the field.
- **Hairline** (`#3a414c`): borders and dividers, always whisper-quiet.
- **Ink** (`#d7dce5`) / **Ink Strong** (`#f2f4f8`): body and heading text.
- **Ink Muted** (`#8a93a3`) / **Ink Faint** (`#5c6573`): secondary and tertiary text — held to AA
  contrast, never dropped to decorative light-gray.

### Named Rules
**The Three-Haven Rule.** Every color is a CSS variable scoped to `[data-theme]`. Never hardcode a
hex value in a component — if it can't be themed, it doesn't ship. All three palettes must clear the
same contrast bar.

**The Coral-Not-Red Rule.** Distress, danger, and the anxious state use soft coral (`#e06c75`), never
a harsh emergency red. The interface must stay humane even when it mirrors panic.

**The Meaningful-State Rule.** Green means safe, amber means caution, coral means stop/distress.
State colors are never decorative; reserve them for genuine state.

## 3. Typography

**Display / Body Font:** Inter (with SF Pro, Roboto, system-ui fallbacks)
**Pixel/Accent Font:** Press Start 2P (companion pet, on-chain tx hashes only)

**Character:** One warm, highly-legible humanist sans carries the entire UI across weights — clean
and friendly, never clinical. The only contrasting face is an 8-bit pixel font, used as a deliberate
spark of playful humanity (the companion) and as a "machine/ledger" texture (transaction hashes).

### Hierarchy
- **Display** (800, `clamp(1.7rem, 4vw, 2.2rem)`, 1.2, `-0.03em`): page titles ("Welcome back").
  Deliberately restrained — a sanctuary doesn't shout.
- **Headline** (700, `1.25rem`, 1.2): section headings.
- **Title** (700, `~1.02rem`): card and component titles.
- **Body** (400, `0.95rem`, 1.55): primary reading text; cap prose at 65–75ch.
- **Label** (700, `0.72rem`, `0.14em`, uppercase): the `.eyebrow` kicker and small meta — used as a
  restrained accent, not stamped above every section.
- **Pixel** (Press Start 2P, `~0.74rem`): companion speech and tx hashes only.

### Named Rules
**The Quiet-Display Rule.** Display type never exceeds ~2.2rem. Big shouting headlines belong to
marketing pages, not a calming product surface.

**The Pixel-Sparingly Rule.** Press Start 2P appears only on the companion and on-chain hashes. It is
seasoning, never a body or heading face.

## 4. Elevation

A soft, layered system — depth conveyed through tonal layering (bg → surface → card) and gentle,
diffuse drop shadows, never hard or dark ones. Surfaces float a few pixels off their background; on
hover, interactive cards lift further and the shadow deepens slightly. Shadow opacity is tied to the
theme via `--shadow-color`, so elevation stays soft in light themes and subtle in dark ones. Glass
(backdrop-filter blur) is used only on the sticky sidebar and top bar to let content drift beneath
them — purposeful, not decorative.

### Shadow Vocabulary
- **Resting** (`--shadow-sm`: `0 1px 2px / 0 2px 6px var(--shadow-color)`): cards and badges at rest.
- **Lifted** (`--shadow`: `0 4px 14px / 0 1px 3px`): buttons on hover, popovers.
- **Floating** (`--shadow-lg`: `0 18px 50px / 0 6px 16px`): modals, toasts, hovered cards.

### Named Rules
**The Soft-Shadow Rule.** Shadows are diffuse and low-opacity — comfort, not drama. If a shadow looks
crisp or dark, it's wrong for this system.

**The Glass-With-Purpose Rule.** Backdrop blur is reserved for sticky chrome (sidebar, top bar) and
modal backdrops. Never apply glassmorphism decoratively to content cards.

## 5. Components

### Buttons
- **Shape:** gently rounded (12px / `--radius-sm`).
- **Primary:** blue gradient (`--primary` → `--primary-strong`) on white text, `11px 18px` padding.
- **Hover / Focus:** lifts `-2px` with a soft glow shadow; `:active` settles to `scale(0.98)`.
  Visible focus ring via `0 0 0 3px var(--primary-soft)`.
- **Ghost:** transparent with a hairline border, for secondary actions.
- **Danger:** soft-coral fill — the Panic Button and destructive intents.
- **Icon button:** 40px square, muted by default, brightens and lifts on hover.

### Chips / Badges
- **Style:** pill-shaped (`--radius-pill`), small (`0.76rem`), tinted background of their own hue.
- **Web3 Secured:** green-tinted with a softly pulsing dot — the signature trust signal.
- **Track badges:** social = blue, phobia = orchid, burnout = green; color-coded by mental-health track.
- **Availability:** available = green, in-session = amber, offline = faint neutral.

### Cards / Containers
- **Corner Style:** 16px (`--radius-lg`).
- **Background:** `--card` over the page field; hairline `--border-soft` border.
- **Shadow Strategy:** Resting at rest; `.card--hover` lifts to Floating on hover (`-4px`).
- **Internal Padding:** `--space-5` (24px) via `.card--pad`.
- **Rule:** cards are used where they're the genuine affordance, not as a default wrapper. Never nest cards.

### Inputs / Fields
- **Style:** `--surface-2` fill, hairline border, 12px radius.
- **Focus:** border shifts to `--primary` plus a `3px` `--primary-soft` glow ring — calm, unmistakable.
- **Placeholder:** `--text-faint`, held to the same contrast bar as body (no washed-out placeholders).

### Navigation
- **Sidebar:** sticky, glass-blurred, with grouped nav items that tint to `--primary-soft` when active
  and nudge `+2px` on hover. Collapses to an off-canvas drawer with a scrim under 900px.
- **Top bar:** sticky greeting + EXP/Web3 badges + theme switcher + panic shortcut.

### Signature Component — The Mood Aura
A central animated CSS/SVG blob representing aggregated mood. **Calm:** slow, rounded, cool, breathing
(7–13s morph + breathe loops). **Anxious:** fast, sharp, warm, jittering (1–1.7s stepped loops). It is
the emotional heartbeat of the dashboard and the system's defining visual — mood made visible, not
charted. (Explicitly *not* a pie chart or bar graph.)

### Signature Component — Anti-OVT Panic Mode
A full-screen calm override that dims all other UI to remove distraction, offering Box Breathing
(4-4-4-4), 5-4-3-2-1 Grounding, and a fading-text Brain Dump, resolving in a Calm Badge + EXP
cool-down. The fastest path to relief, always one tap away.

## 6. Do's and Don'ts

### Do:
- **Do** drive every color through CSS variables scoped to `[data-theme]`; keep all three palettes
  (One Dark, Gruvbox, Material) at AA contrast.
- **Do** keep body and muted text at ≥4.5:1 (large text ≥3:1) — bump muted toward ink before sacrificing it.
- **Do** use soft, diffuse, low-opacity shadows and 12–16px radii everywhere.
- **Do** keep motion slow, rounded, and breathing; pair every animation with a non-motion cue and a
  full `prefers-reduced-motion` alternative (already in place).
- **Do** communicate security with quiet, consistent signals (Web3 badge, encryption indicator, signed consent).
- **Do** keep one primary action per screen; use progressive disclosure to protect a distressed user.
- **Do** use soft coral (`#e06c75`) for distress/danger — humane, never alarmist.

### Don't:
- **Don't** make it look like clinical medical / EHR software — no sterile hospital blue-and-white,
  no dense data-entry forms, nothing that reads as a patient record.
- **Don't** make it look like cold corporate SaaS — no dashboard-cream default, no hero-metric
  template (big number + tiny label + gradient), no endless identical icon-heading-text card grids.
- **Don't** use the crypto/Web3 hype aesthetic — no neon gradients, 3D coins, or glowing hype styling.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored stripe accent on cards or
  list items (the current `.quest-card::before` 4px stripe is exactly this and should be reworked).
- **Don't** use gradient text (`background-clip: text`) or decorative glassmorphism on content.
- **Don't** use harsh emergency red, flashing patterns, or time pressure — the user may be in distress.
- **Don't** let gamification become childish or manipulative; keep streaks/rewards gentle and supportive.
- **Don't** shout: display type stays ≤~2.2rem; this is a sanctuary, not a billboard.
