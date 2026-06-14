# 09 — Character Codex: Lore + 100 Level Prompts

The portrait that levels up with you. This doc is the worldbuilding and the image-generation
brief for the Hunter's 100-level evolution — a single **consistent character** whose **aura
grows** as you train (the "aura farming" arc). No gym imagery: no shorts, no dumbbells, no
treadmills, no equipment of any kind. The power *is* the aura. Dark-fantasy, logical,
escalating from mortal ash to a god of the void.

> Generated images drop into `public/assets/characters/` as `lvl_001.webp … lvl_100.webp`
> (zero-padded, webp). The app shows `lvl_NNN.webp` for the current level on top of the
> procedural aura placeholder — so you can fill them in any order and each one only upgrades
> the card. You can extend past 100 later by appending to `tiers.json` (PRD G8).

---

## 0. How to generate (read first)

- **Tool:** Gemini Nano Banana 2. The hard part of 100 images is **consistency** — solve it
  with **reference images**: generate `lvl_001` from the prompt, then for every next level feed
  the **previous level's image as a reference** and say *"same character and style, evolve only
  as follows: …"*. Re-anchor to a tier "keyframe" every 10 levels so drift doesn't accumulate.
- **Two pieces clip onto every prompt:** the **Character Core** (§2) at the start and the
  **Style Suffix** (§2) at the end. The per-level lines in §3 are just the *delta* — what's new
  at that level.
- **Background:** ask for a **transparent** background. If the model won't do clean alpha, use
  **pure black (#000000)** — it blends into the app's near-black stage and the magic-circle /
  aura show around the figure. Never a scene/floor/room behind the character.
- **Dimensions:** **1024 × 1280 (4:5 portrait)**. Full-body, standing, centered, three-quarter
  angle. Export PNG → convert to **webp** (tell me and I'll batch-convert like the fx assets).
- **Priority order:** generate the **tier keyframes first** — levels **1, 11, 21, 31, 41, 51,
  61, 71, 81, 91** (and 100). That's 11 images that make every tier look distinct immediately;
  fill the in-between levels later. Within a tier the changes are gradual, so missing ones fall
  back to the nearest tier look + the procedural aura.

---

## 1. The World

Aura cannot be given. It can only be **earned**.

When the **Gates** first tore open between the waking world and the dark beneath it, the
**System** appeared — not a god, but an impartial ledger that watches who enters the Gates and
what they truly do inside. To the honest it grants **Aura**: a visible manifestation of refined
will, burning at the edges of the body, its colour and density charting the soul's ascent. It
cannot be bought, inherited, or faked. Every wisp of it is a debt the world paid back for work
that was actually done.

Most who Awaken settle. They reach a comfortable rank and stop returning to the Gates. A
vanishingly rare few do the opposite: they go back, and back, and back — each clear tempering
the body, deepening the aura, rewriting what they are. The ranks (**E** through **S**, and the
nameless tiers beyond) measure only one thing: how much aura a person has **farmed**.

Our character begins as **the Ashbound** — once the weakest Awakened alive, written off as
burnt-out ash, left at the mouth of the first Gate to die. They didn't. They walked in again
the next day, and the day after that. This codex is the record of that climb: ten tiers, one
hundred levels, from a flicker of pale light to a crown of white fire over an endless void.

*(This is the same honesty the app is built on — the aura is the event log made visible. It
only ever reflects what was real.)*

---

## 2. The Character (consistency core)

**CHARACTER CORE — paste at the START of every prompt** *(swap features if you prefer a
different Hunter — just keep them identical across all 100)*:

> A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties,
> with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing
> eyes that glow [AURA], pale skin, a faint old scar through the left eyebrow. The same exact
> face, build and features in every image. Full-body, standing, confident grounded stance,
> three-quarter view, centered.

**STYLE SUFFIX — paste at the END of every prompt:**

> Dark-fantasy character splash art, painterly semi-realism, dramatic volumetric rim-light from
> the aura, intricate rendering, cinematic and powerful, "radiating overwhelming aura". Plain
> fully-transparent or pure-black background — no scenery, floor, room, text, logos or UI. The
> character carries no mundane objects (only aura-formed constructs where noted) and wears no
> modern clothing. Portrait 4:5, 1024×1280.

**Wardrobe arc (so the silhouette evolves logically):** torn ash-grey travelling cloak over
simple dark garb (T1) → cleaner fitted dark coat with faint light-veins (T2) → a lean
dark-leather combat array, hood (T3) → obsidian plate with ignited rune-lines (T4) → sleek
violet-trimmed black armor + torn battle-mantle (T5) → layered shadow-robes, the mantle now a
living cloak (T6) → regal black-and-violet armor, a forming flame-crown + shadow-wings (T7) →
ornate monarch's armor, reality fraying at the edges (T8) → a mantle woven of stars and nebula
(T9) → vestments of pure void and white starlight, a crown of white fire (T10). Keep the
ash-white hair streak and scar in **every** tier.

**[AURA] colour by tier** (fill the Core's `[AURA]` token): T1 pale ash-white · T2 pale sky
blue · T3 cobalt blue · T4 electric cobalt-blue · T5 vivid violet · T6 deep shadow-violet ·
T7 purple flame · T8 bright void-violet · T9 lavender-starlight · T10 white over violet-void.

---

## 3. The Ten Tiers — per-level prompts

Each tier: its lore, the tier's overall look, then ten one-line **deltas** (Core + delta +
Suffix = the full prompt). The aura escalates across the ten, and the last level of each tier
hints at the next colour.

### Tier 1 · E-Rank — The Awakening · Lv 1–10 · aura: pale ash-white
*The Ashbound at the first Gate, dismissed by everyone, flickering with the faintest light.
The System opens one eye.* **Look:** torn ash-grey cloak, hollow-cheeked but hardening resolve,
a barely-there white mist.
- **Lv 1** — almost no aura: a single thin wisp of pale white at the chest; hunched, wary, worn.
- **Lv 2** — the faint glow steadies low at the sternum; the head lifts slightly.
- **Lv 3** — pale mist rises to shoulder height; the stance straightens.
- **Lv 4** — thin white threads of light trail from the fingertips.
- **Lv 5** — a soft white halo flickers behind the head for the first time.
- **Lv 6** — the aura forms a faint full-body outline of light.
- **Lv 7** — pale white embers begin to drift upward around the figure.
- **Lv 8** — the glow brightens enough to cast pale light on the unseen ground.
- **Lv 9** — the aura settles into a clean, steady white silhouette of contained power.
- **Lv 10** — the white aura peaks and its edges cool to the first hint of blue; chin level, eyes calm.

### Tier 2 · D-Rank — The Vanguard · Lv 11–20 · aura: pale sky blue
*The ash-white cools to blue as the soul tempers. Others on the frontline start to ask what
changed; the honest answer is "every session."* **Look:** the cloak mended into a fitted dark
coat, faint blue light-veins under the skin.
- **Lv 11** — the aura turns pale blue at the core while white still haloes the body.
- **Lv 12** — cool blue light gathers cleanly around both hands.
- **Lv 13** — fine blue veins of light trace up the forearms.
- **Lv 14** — the drifting embers shift from white to soft blue.
- **Lv 15** — a low blue ground-glow pools beneath the figure.
- **Lv 16** — the coat edges lift faintly in an aura-wind.
- **Lv 17** — the eyes glow a clearer blue; expression composed, certain.
- **Lv 18** — the aura sharpens into defined blue flame-licks at the shoulders.
- **Lv 19** — a confident full blue corona surrounds the body.
- **Lv 20** — the blue deepens toward cobalt at the edges; the posture is now a vanguard's.

### Tier 3 · C-Rank — The Bladed Shadow · Lv 21–30 · aura: cobalt blue
*The glow no longer flickers. They enter Gates not to survive but to clear them, moving like a
drawn blade.* **Look:** lean dark-leather combat array, a half-hood, sharper silhouette.
- **Lv 21** — the aura condenses into hard-edged cobalt that traces the body's outline like a blade.
- **Lv 22** — thin cobalt after-images ghost at the figure's edges, hinting at speed.
- **Lv 23** — the hood goes up; cobalt light burns in the shadow beneath it.
- **Lv 24** — twin curved arcs of cobalt aura sweep from the shoulders.
- **Lv 25** — the ground beneath fractures with faint cobalt light in the cracks.
- **Lv 26** — sharp cobalt sparks scatter from the heels and hands.
- **Lv 27** — the aura forms two faint blade-shapes of pure energy at the hips (aura constructs).
- **Lv 28** — a colder, denser cobalt corona; the gaze is lethal-calm.
- **Lv 29** — the cobalt intensifies, edged now with electric white-blue.
- **Lv 30** — the aura crackles, on the verge of igniting into flame-blue.

### Tier 4 · B-Rank — The Rune-Marked Elite · Lv 31–40 · aura: electric cobalt-flame
*Runes burn along dark armor; the ground cracks where they plant their feet. The System stops
issuing warnings and starts issuing challenges.* **Look:** obsidian plate over the leathers,
glowing rune-lines awakening across it.
- **Lv 31** — the cobalt aura ignites into electric blue flame; first rune-lines glow on the chestplate.
- **Lv 32** — runes spread to the pauldrons, pulsing in time with the aura.
- **Lv 33** — blue fire wreathes both forearms.
- **Lv 34** — cracks of blue light spider out across the ground in a ring.
- **Lv 35** — a rising column of electric-blue flame haloes the figure.
- **Lv 36** — floating rune-glyphs orbit slowly around the body.
- **Lv 37** — the armor is fully rune-lit; eyes blaze electric blue.
- **Lv 38** — arcs of blue lightning leap between the orbiting glyphs.
- **Lv 39** — the flame-aura roars upward, edges bleeding faint violet.
- **Lv 40** — the blue strains at its limit, the first violet sparks breaking through.

### Tier 5 · A-Rank — The Violet Eruption · Lv 41–50 · aura: vivid violet
*Blue gives way to violet — the colour of something the rankings were never built to measure.
Every guild keeps their file open.* **Look:** sleek violet-trimmed black armor, a torn
battle-mantle catching the aura-wind.
- **Lv 41** — the aura erupts violet from within the blue, surging past the old limit.
- **Lv 42** — the mantle ignites at its torn edges with violet fire.
- **Lv 43** — violet shockwave-rings pulse outward from the figure.
- **Lv 44** — the rune-glyphs recolour to violet and multiply.
- **Lv 45** — a tall violet flame-aura towers over the head.
- **Lv 46** — the ground glows molten-violet in a wide circle.
- **Lv 47** — violet energy coils up both arms like serpents of light.
- **Lv 48** — the eyes are pure violet stars; expression sovereign-calm.
- **Lv 49** — the violet aura turns dense and smoke-like, beginning to writhe.
- **Lv 50** — the violet darkens at its heart toward shadow — something is waking beneath it.

### Tier 6 · S-Rank — The Shadow-Caller · Lv 51–60 · aura: deep shadow-violet vortex
*The shadows answer now. Every Gate ever cleared marches silently behind them — the work was
never lost, it was enlisted.* **Look:** layered shadow-robes, the mantle a living cloak of dark
smoke; faceless shadow-shapes gathering at the figure's back. *(Shadows as summoned aura, not
gore.)*
- **Lv 51** — the violet aura churns into a slow vortex of shadow-violet smoke around the body.
- **Lv 52** — two faint faceless shadow-silhouettes rise behind the shoulders.
- **Lv 53** — the cloak dissolves at its hem into drifting shadow.
- **Lv 54** — a ring of dim violet eyes opens in the dark behind the figure.
- **Lv 55** — several shadow-soldiers stand half-formed at the back, edged in violet.
- **Lv 56** — the vortex tightens; the figure is the calm eye of a storm of shadow.
- **Lv 57** — tendrils of shadow-violet lift from the ground toward the hands.
- **Lv 58** — a small legion of shadow-shapes looms, all bowed toward the figure.
- **Lv 59** — the aura blackens, lit from within by violet veins.
- **Lv 60** — a single point of violet fire kindles just above the head — a crown beginning.

### Tier 7 · Shadow Lord — The Crowned · Lv 61–70 · aura: purple flame, winged
*A crown of purple flame forms above the head; wings of shadow stretch where a tired figure
once stood. The System addresses them differently now.* **Look:** regal black-and-violet armor,
a forming flame-crown, vast shadow-wings.
- **Lv 61** — a thin crown of purple flame settles above the brow; small shadow-wings unfurl.
- **Lv 62** — the wings spread wider, feathered in living shadow and violet fire.
- **Lv 63** — the crown gains points, each tipped with violet flame.
- **Lv 64** — the armor blackens to regal obsidian with violet filigree.
- **Lv 65** — full shadow-wings arch high above the head; aura immense.
- **Lv 66** — purple flame sheets off the wing-edges like banners.
- **Lv 67** — the figure hovers a hand's breadth off the ground in a halo of fire.
- **Lv 68** — the crown blazes full; eyes like twin violet suns.
- **Lv 69** — the wings and aura merge into one towering wall of purple flame.
- **Lv 70** — reality dims around the silhouette — the air itself begins to bend.

### Tier 8 · Monarch Candidate — The Reality-Bender · Lv 71–80 · aura: bright void-violet
*Reality bends politely out of their way. There are only a handful of beings at this altitude,
and none arrived by accident.* **Look:** ornate monarch's armor, space fraying and warping at
the figure's edges.
- **Lv 71** — the space around the silhouette visibly warps and ripples with bright void-violet.
- **Lv 72** — cracks of white-violet light open in the air beside the shoulders.
- **Lv 73** — the wings become geometric, made of folding fractured space.
- **Lv 74** — gravity bends: dust and shards orbit the figure in slow rings.
- **Lv 75** — the crown floats free above the head, a ring of pure void-fire.
- **Lv 76** — the armor is regal and absolute, etched with shifting glyphs.
- **Lv 77** — twin rifts of starlight open behind the figure.
- **Lv 78** — the aura swallows nearby light, edged in blinding violet-white.
- **Lv 79** — the figure stands in a small collapsing bubble of warped reality.
- **Lv 80** — the warped space begins to fill with distant stars — a cosmos opening.

### Tier 9 · Cosmic Sovereign — The Starcrowned · Lv 81–90 · aura: lavender-starlight galaxy
*Their aura is no longer a glow; it is a weather system of stars. The gates that once tested
them now open in deference.* **Look:** a mantle woven of nebula and constellations, a crown of
starlight.
- **Lv 81** — the aura becomes a swirling lavender galaxy, stars wheeling around the body.
- **Lv 82** — the mantle resolves into a cloak of living nebula and constellations.
- **Lv 83** — small planets and points of starlight orbit the figure.
- **Lv 84** — a band of galaxy-light rings the head like a halo.
- **Lv 85** — the figure stands at the centre of a personal cosmos, vast and calm.
- **Lv 86** — nebula-clouds pour from the shoulders in slow cosmic tides.
- **Lv 87** — the eyes hold entire star-fields; expression serene, divine.
- **Lv 88** — a crown of seven stars ignites above the brow.
- **Lv 89** — the galaxy-aura brightens, its core whitening.
- **Lv 90** — the colours begin to fall away toward pure white and pure void.

### Tier 10 · Absolute God of Shadows — The Voidcrowned · Lv 91–100 · aura: white over violet-void
*There is no rank above this. There is only the void, the white crown, and the quiet certainty
of a body built one honest session at a time.* **Look:** vestments of pure void and white
starlight, a crown of white fire; a deity, utterly composed.
- **Lv 91** — the aura splits into two: an inner white radiance over an outer endless black void.
- **Lv 92** — a crown of white fire forms; the void-cloak drinks all surrounding light.
- **Lv 93** — white starlight cracks run through the void-robes like veins of dawn.
- **Lv 94** — the figure stands in a perfect sphere of black void rimmed in white.
- **Lv 95** — wings return as pure white light against the absolute black.
- **Lv 96** — galaxies and shadow-soldiers alike kneel faintly at the edge of the dark.
- **Lv 97** — the white crown blazes like a small sun over the void.
- **Lv 98** — the figure is half-silhouette, half-radiance — being and un-being at once.
- **Lv 99** — reality is just a faint outline around an ocean of white-crowned void.
- **Lv 100** — the Ashbound, now a god: a calm figure of pure white light enthroned in infinite
  black, crowned in white fire — overwhelming, serene, absolute. The climb's final form.

---

## 4. Technical recap
- **Path / name:** `public/assets/characters/lvl_001.webp` … `lvl_100.webp` (3-digit, webp).
- **Size:** 1024×1280 (4:5 portrait); transparent or pure-black background; full-body centered.
- **Display:** shown on the dashboard status window + the level-up ceremony, over the spinning
  magic circle and aura. The card stage is portrait-friendly (300 px tall) — tell me once a few
  land and I'll fine-tune cropping/scale to your actual art.
- **Convert:** PNG → webp (I can batch-convert with `sharp`, like the backgrounds/fx — just drop
  the PNGs in and ping me).
- **Extending past 100:** append tiers/levels to `public/assets/characters/tiers.json` (no code
  change); reuse this codex's structure for the new tiers.
