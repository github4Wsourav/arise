# 07 — System UI: The Holographic Overhaul

**Status:** in progress (branch `ui-glow-pass`). This is the visual-identity pass that
makes Arise *look the part* — a Solo-Leveling-style "System" interface. It is purely a
presentation layer: **no engine, event, or game-state changes**. Every effect is driven by
the existing tier-bound aura tokens, so the whole interface recolors as the Hunter ranks up.

Read this doc first when resuming the overhaul. It is the single source of truth for the
visual direction, the token vocabulary, the per-component checklist, and the invariants.

---

## 1. The concept

Everything the user sees is a **hologram the System projects into the void**. Not a website —
a magical heads-up display summoned out of the dark. Three layers, back to front:

1. **The Void** — a living background: a slow-drifting aura glow field, a faint scan-grid,
   floating motes, and a vignette. Fixed behind everything. Pulses with the tier color.
2. **System Windows** — glass panels (translucent + blur) with an **animated glowing aura
   border** and **HUD corner brackets** (`⌐ ¬ / L ⌐`). They *materialize* on mount with a
   staggered rise + a scanline sweep, as if being rendered by the System.
3. **Content** — typographic, monospace-accented system text; glowing numerals and bars;
   tactile controls that flare on press.

The feeling target: opening the app should feel like the System *booting up around you*.

---

## 2. Aesthetic invariants (do not violate)

- **Aura-bound, always.** Never hardcode the accent. Glows, borders, shimmers all derive from
  `--aura` / `--aura-hi` / `--aura-deep` (set per-tier by `manifest.applyTierTheme`). Verify a
  high-tier seed (`window.arise.seed(70)`) still looks cohesive — violet/void aura, not blue.
- **Two chromatic systems stay separate** (tokens.css header): the **heat ramp** is body-map
  only; the **aura ramp** is power/UI. The overhaul only touches the aura ramp.
- **`prefers-reduced-motion: reduce` disables all non-essential motion.** Atmosphere freezes,
  entrances become instant, only opacity/transform-free states remain. This is a hard rule.
- **Performance budget:** GPU-cheap effects only (transform/opacity/filter, a few blurs). No
  per-frame JS animation loops for ambient effects — CSS keyframes only. JS bundle stays under
  the 350 KB budget (currently ~144 KB gz; this pass should add ~0 KB JS).
- **Phone-first, but scales up.** Layout column is `--max-w` (560px) centered; on wide screens
  the void gets ambient side-glow rather than stretching the column. Respect safe-area insets.
- **No regressions:** `npm test` (114), `npm run build`, and all three smokes stay green. The
  smokes fail on console errors/unexpected 404s — keep effects error-free.

---

## 3. Token vocabulary (tokens.css)

Added in the `glow + motion` block. Use these — never inline magic numbers.

| Token | Purpose |
|---|---|
| `--glow-soft / --glow-mid / --glow-hard` | layered box-shadow recipes from `--aura` |
| `--text-glow` | text-shadow for glowing numerals/labels |
| `--panel-glass` | translucent panel fill so the void shows through |
| `--blur-panel` | backdrop-blur radius for glass |
| `--hud` | corner-bracket / frame line color (aura-mixed) |
| `--scan` | scanline tint |
| `--ease-system` / `--ease-out` | the two motion curves |
| `--t-fast / --t-mid / --t-slow` | 120 / 260 / 600 ms timings |

---

## 4. Effect catalogue (system-fx.css)

A dedicated layer, imported after app.css. Keyframes + the reusable effect classes.

- **`aura-breathe`** — the void glow field slowly expands/contracts + drifts.
- **`scan-drift`** — the scan-grid creeps; **`scan-sweep`** — a one-shot light bar crossing a
  panel as it materializes.
- **`border-pulse`** — the panel aura border breathes (opacity/intensity).
- **`shimmer`** — a moving highlight sweep (XP bar, CTAs).
- **`rise-in`** — entrance: translateY + opacity + slight blur-in; staggered per panel.
- **`hud-flicker`** — rare, subtle bracket flicker for "live hologram" feel (very restrained).
- **HUD brackets** — `.system-window::before`, a masked inset border showing only the four
  corner L's. `::after` remains the (now pulsing) full aura border.
- **Glass** — `.system-window` gets `--panel-glass` + `backdrop-filter: blur(--blur-panel)`.
- **Micro-interactions** — `.cta:active` flare+scale; chip/row hover glows; `LOG`/claim pulse.

---

## 5. Component checklist

Track progress here. `[x]` = done & verified in a smoke/screenshot.

- [x] **Foundation:** tokens, system-fx.css, void background, global glass+glow+brackets on
      `.system-window`, entrance stagger, button micro-interactions, reduced-motion guard.
      *Verified: dashboard (tier 1 + tier 8), profile/endgame, all smokes green. Note: entrance
      is gated behind `prefers-reduced-motion: no-preference` so the visible state is the default;
      smoke-system waits 1s for entrance to settle before the profile capture.*
- [x] **App header / title** — wordmark glow + nav hover. *(SyncDot states done too.)*
- [x] **CharacterCard / status window** — glass + glow + brackets + level-numeral glow + tier
      name **decode effect** (`DecodeText`, scramble→resolve on mount, reduced-motion safe).
- [x] **XPBar** — shimmer fill + glowing leading edge + **segmented tick power-meter**.
- [x] **RosterStrip** — chip glow states + today-pulse (foundation).
- [x] **Today / Gate panel** — gate banner frame (Art) + CTA flare.
- [x] **Daily Quests** — quest ◇→◆ claim pop, manual CLAIM flare.
- [x] **Gate view** — gate hero frame, boss banner pulse, set-logger LOG flash, grade chip
      glow, gate-progress shimmer, CLEAR GATE charge-up pulse. *Verified in gate smoke.*
- [x] **Tally screen** — numeric count-up (`CountUp`, reduced-motion safe), staggered lines,
      HUD glass + brackets, glowing total. *gate smoke waits for the count-up to settle.*
- [x] **Ceremony** — aura burst behind the reveal + screen flash + LV numeral slam.
- [x] **Profile** — stat-cell glow + hover, relic grid hover lift, tier gallery hover, current
      tier aura inner-glow, sparkline drop-shadow glow. *Verified in system smoke.*
- [x] **Responsive pass** — wide-screen void glow boost + wordmark scale; column stays
      phone-width (correct for a gym PWA); safe-area already handled. *Landscape/large-text TODO.*
- [x] **Custom assets + content (round 3):** original SVG icon set (`src/ui/icons.tsx`,
      stat icons STR/VIT/AGI/REC + gate/flame, `currentColor` → aura, MIT, no third-party
      art) wired into both stat panels; **streak made visual** as a 13-week training heatmap
      (`src/ui/StreakCalendar.tsx`, derived from `trainingDates` + roster, on dashboard +
      profile); filmic grain overlay + card top-corner sheen; tokens-driven **breathing-room
      pass** (`--panel-pad`/`--panel-gap`, wider gutter + max-w). *Verified: 114 tests, build,
      3 smokes; cohesive tiers 1/3/8.*
- [x] **Brand + atmosphere (round 4):** real **ARISE logo** wired as the header
      (`public/assets/brand/arise-wordmark.png`, `screen` blend + edge mask so the dark plate
      melts into the void; text fallback if absent). **Per-tier blurred backgrounds** — drop-in
      `public/assets/backgrounds/tier-1..10.webp` keyed on `html[data-tier]`, behind the void
      (body now transparent, base color on `html`); the backdrop changes every tier/threshold.
      **Pulse → slow shimmer** everywhere: panels get a 13s travelling sheen (replaced the
      breathing border), CTAs + the today chip get a slow sheen sweep, CLEAR GATE/boss use a
      steady glow (no pulsing). **Airier spacing** (`--panel-pad` 22 / `--panel-gap` 22 / gutter
      18). **Asset-generation guide** for Karan: `docs/08-ASSETS.md` (prompts + paths + names
      for all backgrounds/gates/overlays; character art excluded — separate pipeline).
- [x] **Edit past days' workouts (functional):** the roster strip is now interactive — tap any
      day (today or earlier; future locked) → a **gate picker** (any of the 3 gates, for shift
      swaps) → opens `/gate/$sessionId?date=YYYY-MM-DD`. GateView derives its state from
      `reduce(events, cfg, date)` (the engine already buckets sessions by date — no new engine
      code), SetLogger writes the chosen `sessionDate`, and a past-day clear **saves quietly**
      (no tally/ceremony). 3 new engine tests + `npm run smoke:edit` (UI: pick past day → log →
      XP credited). *Decisions per Karan: pick-any-gate-per-day + quiet save.*
- [x] **Final:** merged to main + tagged **v0.6.0**; HANDOFF Phase 6 entry written; user guide
      `docs/10-USER-GUIDE.md`. *Lighthouse re-run still deferred (do before heavy reliance).*

---

## 6. How to work / verify

- `npm run dev` is the source of truth (no service worker). **Never** judge changes from
  `npm run preview` without accepting the SW update prompt first.
- Before any session: kill stray dev servers (ports 5173–5176) so the smoke tests current code.
- `window.arise.seed(n)` to preview any tier's aura; `window.arise.state()` for assertions;
  `window.arise.reset()` to clear.
- Verify each component at **two tiers** (e.g. seed 5 and seed 70) — cohesion is the bar.
- Run `npm run smoke` / `:gate` / `:system` after each component; they screenshot to
  `screenshots/`. Keep them green.

---

## 7. Decisions

- **CSS-first, no animation library.** The aesthetic is achievable with CSS keyframes +
  transforms; adding Motion/framer-motion would cost bundle for orchestration we don't need.
  Revisit only if a specific sequence (e.g. tally count-up choreography) demands it.
- **Effects are additive over the existing design system** (docs/04). The restrained dark
  base, the Unbounded/Sora/Martian-Mono type, and the aura tokens are kept — we are amplifying,
  not replacing.
