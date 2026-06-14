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
the System text reads on top; the app fades the bottom edge into the panel.

| File | Gate name | Trains | Scene prompt (append the global negative prompt) |
|------|-----------|--------|--------------------------------------------------|
| `push.webp` | Crimson Forge | chest · shoulders · triceps | `A dark fantasy forge-arena gate glowing with crimson and ember-orange fire, anvils and molten cracks, heat haze, cinematic, no characters, no text. 16:7 wide.` |
| `pull.webp` | Iron Abyss | back · rear delts · biceps | `A vast dark chasm gate with hanging iron chains descending into a glowing teal-green abyss, cold mist, cinematic depth, no characters, no text. 16:7 wide.` |
| `legs.webp` | Titan's Foothold | quads · hams · glutes · calves | `A colossal stone titan's foot and mountain foothold gate, amber torchlight, dust and scale, monumental and heavy, cinematic, no characters, no text. 16:7 wide.` |

---

## 3. Decorative overlays (optional, high polish)  ·  `public/assets/fx/`

These are transparent PNGs layered as effects. Optional — the app looks complete without
them — but they push the "magic UI" feel further. **Export as PNG with real transparency.**

| File | Size | Purpose | Prompt |
|------|------|---------|--------|
| `magic-circle.png` | 1024×1024 | spins slowly behind the ceremony / status hero | `A glowing arcane summoning circle, concentric rings of runic glyphs, thin bright violet-white lines on a fully transparent background, top-down, symmetrical, no fill, no text in a real language. PNG transparent.` |
| `rune-corner.png` | 512×512 | ornament tucked into panel corners | `A single ornate glowing rune corner flourish, thin violet line-art, transparent background, one corner only. PNG transparent.` |
| `particles.png` | 512×512 | tiling ember/dust overlay | `Scattered soft glowing dust motes and embers on a fully transparent background, seamless tileable, faint. PNG transparent.` |

> If you generate `magic-circle.png`, tell me and I'll wire it behind the ceremony + status
> window (slow rotation, screen-blend) — that's a ~10-line change.

---

## 4. Brand & app icons (optional)  ·  `public/assets/brand/` + `public/icons/`

The header wordmark is **already in** (`public/assets/brand/arise-wordmark.png`, the logo you
made — composited with a `screen` blend so its dark plate melts into the void). Optional extras:

| File | Size | Purpose | Prompt |
|------|------|---------|--------|
| `icon-source.png` | 1024×1024 | replace the procedural PWA icon | `An app icon for "Arise": a glowing violet arcane sigil / stylized monarch crown mark on a near-black rounded-square background, centered, bold, no text. 1:1.` |

If you make `icon-source.png`, hand it over and I'll regenerate the 192/512/maskable PWA
icons from it (the pipeline — `npm run icons` — already exists).

---

## Priority order (if you only generate a few)
1. **`tier-8.webp`, `tier-3.webp`, `tier-1.webp`** — the tiers you'll actually see soon; proves the per-threshold background swap.
2. **`gates/push.webp`** (Crimson Forge) — you train push first; biggest "wow" on the dashboard.
3. The rest of the tier backgrounds, then the other two gates.
4. Decorative overlays + custom app icon last.

When you've dropped any of these in, ping me and I'll verify they load and tune the blur /
opacity / fade to taste.
