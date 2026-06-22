# Comprehensive Project Brief: MindVault - AI-Driven Mental Health Web App

## 1. Project Context & Objectives
**Application Name:** MindVault
[cite_start]**Target Theme:** "Beyond the Horizon: AI-Driven Digital Innovation with Web3 & Blockchain for Cyber Resilience" [cite: 16]
[cite_start]**Target Sub-theme:** Health & Wellbeing Technology [cite: 31, 32]
**Goal:** Generate a high-fidelity, interactive frontend prototype using HTML/CSS/JS or a modern component-based framework like React, Vue, or Svelte. The architecture must be structured so it can eventually be integrated with a Node.js API and a Prisma-managed database.
**Core Philosophy:** The UI/UX must balance clinical safety, empathetic micro-interactions, and cutting-edge Web3 security without overwhelming a user who might be experiencing mental distress.

## 2. Global Design System & Theming
**Visual Identity:** The application must feel like a safe haven. It should be calming, modern, uncluttered, and highly personalized.
**Dynamic Theming Engine:** The frontend MUST implement a global CSS-variable based theme toggle. Include three specific, ready-to-use palettes. "Gruvbox" providing warm, vintage, and cozy earth tones. "One Dark" providing cool, soothing blue-greys specifically designed to reduce eye strain during nighttime use. "Material Design" providing a clean, high-contrast, minimalist light/dark structure.
**Typography:** Utilize clean, highly legible, and rounded sans-serif fonts such as Inter, Roboto, or SF Pro.
**UI Elements:** Employ progressive disclosure to keep navigation simple. Implement soft drop shadows, border radiuses between 12px and 16px, and seamless CSS micro-interactions on all clickable elements.

## 3. Detailed Component & Page Specifications

### A. Main Dashboard & Sentiment Visualizer
**Header Section:** Display a personalized user greeting alongside a prominent but minimalist "Web3 Secure" badge to establish trust in data encryption immediately.
**Dynamic Aura (Mental Health Tracker):** Do not use static pie charts or bar graphs. Create a central, animated CSS/SVG "Aura" or "Blob" that serves as a visual representation of the user's aggregated mood.
**Aura States:** Build JavaScript logic to toggle the Aura's state for the prototype. State "Anxious" triggers fast, sharp, and warm-colored animations. State "Calm" triggers slow, rounded, and cool-colored breathing animations.

### B. Adaptive Journaling (Dual Mode)
**The Mode Switcher:** Provide a smooth, prominent toggle switch at the top of the page to transition between "AI Chat Mode" and "Zen Mode".
**AI Chat Mode:** Design a clean conversational interface where the user interacts with an empathetic AI. Clearly differentiate user message bubbles from AI message bubbles using color and alignment.
**Zen Mode (Distraction-Free):** Design a full-width, auto-expanding text area for manual, unguided writing. Hide unnecessary navigation bars when this mode is active.
**Pixel Companion Element:** Place a fixed container in the bottom corner of the Zen Mode screen featuring an 8-bit/pixel-art animated pet (e.g., a cat or dog). Apply a subtle CSS "idle breathing" animation to the asset to provide a calming virtual presence.
**Status Indicator:** Add a minimalist "Encrypting & Saving to Blockchain..." text indicator that flashes periodically to reinforce the decentralized security concept.

### C. Emergency Intervention: Anti-OVT Mode
**Access Triggers:** Create a persistently visible "Panic Button" (e.g., a lifebuoy or cloud icon) in the global navigation. Also, design a gentle modal pop-up representing an auto-trigger from the AI when panic patterns are detected.
**Visual Override:** Upon activation, trigger a full-screen CSS transition that dims the entire background, muting all other UI elements to completely eliminate visual distractions.
**Intervention Option 1 - Box Breathing:** Build an interactive SVG circle in the center of the screen. Program it to expand for 4 seconds, hold for 4 seconds, contract for 4 seconds, and hold for 4 seconds, accompanied by synchronized guiding text.
**Intervention Option 2 - Grounding (5-4-3-2-1):** Build a smooth card carousel prompting the user to list sensory items (e.g., 5 things you see, 4 you touch). Include a simple "Done" button on each card that smoothly transitions to the next.
**Intervention Option 3 - Brain Dump:** Create a blank text area styled like worn paper. Apply a specific JS/CSS effect where every sentence typed gradually fades to 0% opacity and disappears entirely after 5 seconds, simulating the psychological release of intrusive thoughts.
**Cool Down Phase:** Design a resolution screen that fades the UI back to normal brightness, displays a reassuring text prompt, and awards the user a "Calm Badge" or EXP.

### D. Adaptive Gamification & Quest System
**AI Game Master UI:** Create a "Daily Quests" section on the dashboard presented as an engaging horizontal scroll of cards.
**Quest Tracks:** Design distinct visual tags or card styles for different mental health paths. "Social Anxiety" focuses on exposure therapy steps. "Specific Phobia" focuses on systematic desensitization. "Burnout/Physical" focuses on digital detoxes or sleep targets.
**Completion Micro-interactions:** Build a satisfying CSS confetti particle effect and a smooth color transition when a user clicks a "Complete Mission" button.
**Endgame Rewards Hub:** Create a modal showing the user's accumulated EXP balance. Provide UI cards for redeeming points on "Companion Cosmetics" (visual upgrades for the pixel pet), "Teleconsultation Vouchers" (medical discounts), and "Smart Society Donations" (converting points to charity funds).

### E. Teleconsultation & Web3 Privacy
**Psychiatrist Directory:** Design a professional grid layout displaying doctors, their specialties, availability status badges, and a primary "Book Session" button.
**Smart Contract Consent Modal:** When booking is clicked, trigger a secure-looking modal dialogue.
**Consent UI:** The text must explicitly ask, "Allow Dr. [Name] to access your AI Journal Summary for the last 7 days via Smart Contract?". Include an interactive toggle switch and a "Sign & Authorize" button to clearly demonstrate the cyber resilience and patient-controlled data flow of the application.

## 4. Execution Directives for the Agent
**Responsiveness:** Ensure absolute mobile-first responsiveness that scales elegantly to tablet and desktop viewports without breaking the layout.
**Modularity:** Keep CSS clean, semantic, and component-based. Use CSS variables extensively for the color palettes to allow seamless theme switching.
**Interactivity:** The generated HTML/JS must have functional toggles, modals, layout shifts, and animations to effectively demonstrate the full user flow and logic during a live presentation.