# 08 — Asset Generation Guide

This is the shopping list + prompts for every image asset that makes Arise look its
best. **You generate them from an image model and drop the files into the paths below
— no code changes needed.** Each slot is a graceful "drop-in": until the file exists the
app falls back to its procedural look (aura placeholders, the living void), so you can
add assets one at a time and watch the app upgrade.

> **Character art is NOT in this list.** Per the project's locked decision, the per-level
> character images come from your own separate AI pipeline (`/assets/characters/lvl_NN.webp`,
> driven by `tiers.json`). This doc is only the *environment / UI / brand* art.

---

## How to use this doc

1. Generate each asset with the prompt given. Keep the **aspect ratio** and **subject** as
   specified — most are atmospheric backplates with **no characters** and **no text**, so
   the System UI can sit on top.
2. Export, then **convert to `.webp`** (smaller, and what the app expects). Any converter
   works; target < 250 KB per image.
3. Save it to the exact path under `arise/public/` shown for that asset. Create the folders
   if they don't exist.
4. Reload `npm run dev` — the asset appears. That's it.

### Global art direction (applies to everything)
- **Mood:** dark, holographic, "magic System UI" — a fitness RPG inspired by the rise from
  weakest to monarch. Original aesthetic; **do not depict any copyrighted character, name,
  or logo.**
- **Palette:** each tier has its own aura color (listed below). Backgrounds should lean into
  that color over a near-black base (`#07090E`).
- **Composition for backgrounds:** keep the center and lower-middle **calm and uncluttered**
  (UI panels overlay there). Detail/energy belongs at the edges and top. No text, no faces,
  no characters, no watermark.
- **Negative prompt (paste into the "avoid" field):** `text, words, letters, watermark,
  signature, logo, people, face, character, ui, frame, border, low-res, jpeg artifacts,
  busy center, cluttered`.

---

## 1. Per-tier backgrounds  ·  `public/assets/backgrounds/tier-N.webp`

A blurred, atmospheric backdrop that **changes every tier (~every 10 levels)** — the visual
"threshold passed." The app already blurs + dims them (so even a sharp image works), but
softer/atmospheric reads best. **Portrait 1080×1920** (9:16), dark, color-themed.

| File | Tier (levels) | Aura color | One-line scene |
|------|---------------|-----------|----------------|
| `tier-1.webp` | E-Rank Awakening (1–10) | faint white `#C9D4E0` | bare grey dungeon dawn |
| `tier-2.webp` | D-Rank Vanguard (11–20) | light blue `#7FB3E8` | pale-blue mist gate |
| `tier-3.webp` | C-Rank Assassin (21–30) | cobalt `#2E7CD6` | deep cobalt cavern |
| `tier-4.webp` | B-Rank Elite (31–40) | cobalt-flame `#2B55E0` | rune-lit blue forge |
| `tier-5.webp` | A-Rank Vanguard (41–50) | violet `#7B3FE4` | violet storm threshold |
| `tier-6.webp` | S-Rank Necromancer (51–60) | shadow-violet `#8E3BF0` | shadow vortex hall |
| `tier-7.webp` | Shadow Lord (61–70) | purple flame `#9D4DFF` | purple-flame throne mist |
| `tier-8.webp` | Monarch Candidate (71–80) | bright violet `#AE5CFF` | reality-warp void rift |
| `tier-9.webp` | Cosmic Sovereign (81–90) | lavender galaxy `#B98CFF` | purple star nebula |
| `tier-10.webp` | Absolute God of Shadows (91–100) | white-on-void `#C9A2FF` | infinite white-crown void |

**Prompt template** (swap the bracketed bits per row):
```
A dark, atmospheric vertical background for a fantasy RPG interface. [SCENE], lit almost
entirely by [AURA COLOR] energy glowing from the edges and top. Near-black base, volumetric
haze, faint floating embers/particles, subtle magic-circle glow far in the background. The
center and lower area are calm and empty (negative space for UI). Cinematic, moody, depth,
high detail at the edges only. No characters, no text, no logos. 9:16 vertical.
```
Per-tier `[SCENE]` / `[AURA COLOR]`:
1. `a vast empty stone dungeon at first light` / `faint cold white`
2. `a quiet gate wreathed in pale mist` / `light sky-blue`
3. `a deep underground cavern with glowing veins` / `cobalt blue`
4. `a dark forge with burning runes in the rock` / `electric cobalt-blue`
5. `a cracked threshold under a gathering storm` / `vivid violet`
6. `a cathedral hall folding into a shadow vortex` / `deep shadow-violet`
7. `a misty throne dais crowned in cold flame` / `purple flame`
8. `a fractured rift where reality warps and bends` / `bright neon violet`
9. `an endless field of stars and purple nebulae` / `lavender and starlight`
10. `an infinite black void with a single white crown of light` / `pure white over deep void`

---

## 2. Gate art (workout banners)  ·  `public/assets/gates/<id>.webp`

A banner shown on the dashboard "today" panel and as the hero inside each gate. **Landscape
~1200×525 (16:7)**, themed to the muscle group as a "dungeon gate / arena." Keep it dark so
the System text reads on top; the app fades the **bottom edge** into the panel, so keep the
lower third quiet and the focal energy upper-centre.

**Prompt template** (fill `[GATE SCENE]` + `[COLOR]`, then append the global negative prompt):
```
A wide cinematic dungeon-gate / arena establishing shot: [GATE SCENE], lit almost entirely by
[COLOR] energy, volumetric haze, drifting embers and sparks, deep atmospheric perspective. The
lower third is darker and calm (negative space for UI); the glow concentrates in the upper
centre. Dark fantasy, moody, high detail. No characters, no people, no text, no logos. 16:7 wide.
```

| File | Gate · trains | `[GATE SCENE]` | `[COLOR]` |
|------|---------------|----------------|-----------|
| `push.webp` | Crimson Forge · chest/shoulders/triceps | `a molten forge-arena gateway, anvils and cracked lava channels, rising heat shimmer` | `crimson and ember-orange fire` |
| `pull.webp` | Iron Abyss · back/rear delts/biceps | `a vast chasm gateway with massive hanging iron chains descending into the deep` | `cold teal-green abyssal light` |
| `legs.webp` | Titan's Foothold · quads/hams/glutes/calves | `a colossal stone titan's foot planted on a mountain foothold, monumental scale, dust` | `warm amber torchlight` |

---

## 3. Decorative overlays (optional, high polish)  ·  `public/assets/fx/`

Transparent PNGs layered as effects. Optional — the app is complete without them — but they
push the "magic UI" feel. The single hardest requirement: a **truly transparent** background
(alpha), or they'll show as dark boxes.

### 3a. Ornate panel frame  ·  `public/assets/fx/panel-frame.png`  ← do this one next

This is the asset that gives the panels true riveted-metal corners (the reference look). It
drives a CSS `border-image`, so it must be built as a **9-slice frame**: ornate corners, thin
connecting edges, **fully transparent center and exterior**. When you drop it in, I'll wire
`border-image` on `.system-window` and tune the slice to your asset (~5-line change).

- **Dimensions:** **600 × 600 px**, square, PNG with real alpha.
- **Layout (critical for border-image):** four **identical ornate corner pieces** mirrored into
  each corner, each occupying about the outer **150 px** of its corner. The four **edges**
  between corners are a thin, simple, horizontally/vertically **repeatable** rail (or fully
  transparent). The entire **center is transparent** (the panel content shows through). Nothing
  in the middle.

**Prompt:**
```
A square UI panel frame for a dark-fantasy game, on a FULLY TRANSPARENT background (alpha). Four
identical ornate corner brackets, one in each corner, mirrored symmetrically: angular
riveted-metal / dark-obsidian corner plates with a violet neon energy edge-glow, sharp fantasy
points. The corners are connected by a thin simple straight metal rail along each edge. The
entire centre is empty and transparent — only the border frame is drawn, no panel fill, no
background, no text, no characters, no watermark. Crisp, high-contrast, game-UI HUD style.
600x600 square, transparent PNG.
```

### 3b. Other overlays

**Prompt template** (fill `[MOTIF]`, then append the global negative prompt):
```
[MOTIF], rendered as thin bright glowing line-art with a soft outer glow, on a FULLY
TRANSPARENT background (alpha channel, nothing behind it), centred and symmetrical, no solid
fill, no text or letters in any real language, no watermark. Export PNG with transparency.
```

| File | Size | `[MOTIF]` | Purpose in-app |
|------|------|-----------|----------------|
| `magic-circle.png` | 1024×1024 | `a top-down arcane summoning circle: concentric rings of invented runic glyphs and a geometric star, violet-white` | rotates slowly behind the ceremony / status hero |
| `rune-corner.png` | 512×512 | `a single ornate corner flourish of one violet rune bracket (top-left corner only)` | tucked into panel corners |
| `particles.png` | 512×512 | `scattered soft glowing dust motes and embers, faint, evenly spread, seamlessly tileable` | drifting overlay on the void |

> Generate `magic-circle.png` first — tell me and I'll wire it behind the ceremony + status
> window (slow rotation, screen-blend), ~10 lines.

---

## 4. Brand & app icon  ·  `public/assets/brand/` + `public/icons/`

### 4a. Header wordmark banner  ·  `public/assets/brand/arise-wordmark.png` (overwrite)

The header is a **full-width 3:1 banner card**. The current logo's wordmark sits too large and
its opaque plate doesn't frame cleanly. Generate a replacement built as a **banner** (not a
floating logo): the dark field bleeds to all four edges and the wordmark sits centred with
breathing room, so it fills the card with no seam and nothing gets cropped.

- **Dimensions:** **1500 × 500 px (3:1)**, landscape. Same filename, so it just drops in.
- **Critical:** the word must read exactly **A-R-I-S-E** (image models often misspell — call it
  out and check the result).

**Prompt:**
```
A wide 3:1 title banner for a dark-fantasy fitness RPG. The single word "ARISE" (exactly five
letters: A R I S E) centred in the frame, in a bold, jagged, cracked-obsidian-and-chrome metal
typeface with sharp spiky points, fractured cracks across the letters, and an intense violet
energy glow / aura radiating around them. The wordmark occupies roughly the centre 55% of the
width, with comfortable empty margin on the left, right, top and bottom. Background: a seamless
near-black field (#07060E) with faint purple energy cracks and a soft dark vignette, extending
all the way to every edge — no border, no frame, no panel. High contrast so it pops on a dark
screen. No other text, no characters, no people, no watermark, no UI. 1500x500, 3:1 landscape.
```

> If your model can export a **transparent PNG** (alpha), even better — generate the same
> wordmark on a transparent background instead of the dark field, name it the same, and tell me;
> I'll drop the card frame and float it directly on the void.

### 4b. App / PWA icon (optional)  ·  `public/icons/`

A custom app/PWA icon to replace the procedural one.

**Prompt template** (fill `[MARK]`):
```
A mobile app icon: [MARK], centred on a near-black (#07090E) rounded-square background, bold,
high contrast, subtle outer glow, no text, no letters. Flat, iconic, readable at small sizes.
1:1 square. Keep the mark within the centre 80% (safe area for the maskable crop).
```

| File | Size | `[MARK]` |
|------|------|----------|
| `icon-source.png` | 1024×1024 | `a glowing violet arcane sigil / stylised monarch crown mark in cracked-stone-and-neon style, matching the ARISE logo` |

Hand over `icon-source.png` and I'll regenerate the 192/512/maskable icons (`npm run icons`).

---

## Status & priority

- [x] **Tier backgrounds `tier-1…10.webp`** — all 10 in and verified loading. ✅
- [x] **Gate art `gates/push|pull|legs.webp`** — all 3 in and verified (Crimson Forge hero looks great). ✅
- [ ] **`fx/panel-frame.png`** (§3a) — ornate riveted-metal panel corners; ping me and I'll wire `border-image`. ← next
- [ ] `fx/magic-circle.png` (then ping me to wire it), other overlays.
- [x] **`icon-source.png`** — crown sigil app icon in; `npm run icons` regenerated the
      192/512/maskable/apple set. (Source is 256² — a 1024² re-export would sharpen the 512.)
- [ ] `brand/arise-wordmark.png` banner (§4a) — only if you ever want an image hero back; the text wordmark is the current header.

Drop any of these in `public/assets/...` and ping me — I'll verify they load and tune
blur / opacity / fade / blend to taste.
