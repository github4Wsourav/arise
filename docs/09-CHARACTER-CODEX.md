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

### The fixed facts
- **Tool:** Gemini Nano Banana 2.
- **Size:** 1024 × 1280 (4:5 portrait); **three-quarter-length crop** — head to mid-thigh, not
  full-body — standing, centred.
- **Background:** each image is a **full painted fantasy scene** — a rich atmospheric environment
  around the figure (it should suit his rank/aura; optional per-tier settings are listed in §5).
  Keep it **dark and moody** so the figure and aura stay the focus. *(No gym settings — no
  weights, racks, treadmills, locker rooms, etc.)* In the app the aura **particles drift in front**
  of the scene, so the image itself needs no UI.
- **Files:** save each as `lvl_001.webp` … `lvl_100.webp` in `public/assets/characters/`. PNG is
  fine to start — hand them over and I'll batch-convert to webp.
- **Do these 11 first** (one per tier, so every tier looks distinct right away): levels **1, 11,
  21, 31, 41, 51, 61, 71, 81, 91, 100**. Fill the in-between levels whenever.
- **Stay consistent:** make level 1, then for every later level **attach the previous level's
  image as a reference** and tell the model *"same character and style — change only: «that
  level's line»."*

### How to build ONE prompt — glue 4 parts together, in this order
1. **Character Core** — copy the block in §2, and **replace `[AURA]`** with this tier's colour
   (the colour list is at the bottom of §2).
2. **This tier's apparel & accessories** — pull the tier's items from the upgrade rows in §2
   (mantle, armor, crown, gauntlets, soul-shard, footwear), or the quick *Look:* line in §3.
3. **This level's change** — the single `Lv N —` line in §3.
4. **Style Suffix** — copy the block in §2 as-is.

Parts **1 and 4 never change** (except swapping the aura colour each new tier). You only swap
parts **2 and 3** as you climb. That's the whole system.

### ✅ Worked example — the FULL prompt for **Level 1** (copy this shape)
> A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties,
> with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes
> that glow **pale ash-white**, pale skin, a faint old scar through the left eyebrow. The same
> exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh,
> not full-body), standing, slight three-quarter angle, centred. **He wears a torn ash-grey
> travelling cloak over simple dark garb, hollow-cheeked but
> with hardening resolve.** **Almost no aura yet — a single thin wisp of pale-white light at the
> chest; hunched, wary, worn.** Masterfully hand-painted dark-fantasy character art — traditional
> painterly digital painting with confident visible brushwork, luminous glazes and exquisite
> rendering of light, gallery-quality concept art in the manner of a master oil painter. Dramatic
> volumetric rim-light from the aura, deep atmosphere, cinematic, radiating aura. Set him within a complete,
> atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the
> aura glowing as the key light across the whole scene. No text or logos. No modern clothing,
> no held objects. Portrait 4:5, 1024×1280.

*(Bold just shows you which parts came from where: normal = Character Core + Style Suffix,
**first bold** = the tier Look, **second bold** = the level line. Don't actually bold anything —
just paste it as plain text.)*

### ✅ Worked example — the FULL prompt for **Level 47** (tier 5, violet)
> A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties,
> with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes
> that glow **vivid violet**, pale skin, a faint old scar through the left eyebrow. The same exact
> face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred.
> **He wears sleek violet-trimmed black armor with a torn battle-mantle catching the aura-wind.**
> **Violet energy coils up both arms like serpents of light.** Masterfully hand-painted
> dark-fantasy character art — traditional painterly digital painting with confident visible
> brushwork, luminous glazes and exquisite rendering of light, gallery-quality concept art in the
> manner of a master oil painter. Dramatic volumetric rim-light from the aura, deep atmosphere,
> cinematic, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully
> hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key
> light across the whole scene. No modern clothing, no held objects, no text or logos. Portrait
> 4:5, 1024×1280.

For any other level: keep the first and last sentences identical, change the eye-glow colour only
when you enter a new tier, and swap in that tier's Look + that level's line. Done.

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
> face, build and features in every image. Three-quarter-length crop — framed from the head to
> mid-thigh (not full-body), standing with a confident grounded stance, slight three-quarter
> angle, centred.

**STYLE SUFFIX — paste at the END of every prompt:**

> Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting
> with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of
> light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a
> master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep
> atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a
> complete, masterfully hand-painted fantasy environment that befits his rank and aura — a full
> scene, the aura the key light glowing across it (the character's environment, NOT a gym). No
> text, logos or UI. The character wears no modern clothing and holds no mundane objects (only
> aura-formed constructs where noted).
> Portrait 4:5, 1024×1280.

### Apparel & accessories — the upgrade path

**Seven recurring "slots." Each is the SAME item at every level, but it levels up with you** —
climbing through **materials** (cloth → leather → obsidian → living shadow → cosmos → void),
**luxury** (rags → ornate → regal → divine), **power** (dull → glowing → blazing) and **mystery**
(mundane → runic → otherworldly). Two things **never change**: the **ash-white hair streak** and
the **eyebrow scar**. Use a tier's row in a prompt for instant distinction between thresholds.

**① Mantle / cloak** (defines the silhouette)
T1 torn ash-grey travelling cloak, frayed and dust-stained → T2 mended into a fitted slate-blue
coat → T3 a hooded dark-leather mantle, half-hood up → T4 a heavy obsidian-scaled mantle with
rune-stitched trim and a shoulder clasp → T5 a torn violet battle-mantle fraying into ribbons of
light → T6 a living cloak of dark smoke, hem dissolving into shadow → T7 a regal black mantle that
becomes vast shadow-wings at the shoulders → T8 a mantle of folding, fracturing space → T9 a
mantle woven of nebula and constellations → T10 vestments of pure void veined with white starlight.

**② Body armor / garment**
T1 simple rough dark garb, a worn leather chest-strap → T2 a fitted dark tunic with faint
light-veins beneath → T3 a lean dark-leather combat harness of buckles and straps → T4 obsidian
plate, rune-lines igniting across the chestplate → T5 sleek sculpted violet-trimmed black armor →
T6 layered shadow-robes over dark plate, shadow seeping between the seams → T7 regal filigreed
black-and-violet armor → T8 ornate monarch's armor etched with shifting glyphs → T9 dark
star-metal armor with a cosmos set into the plating → T10 armor and being become one — pure void
and white light.

**③ Crown / headpiece** (forms slowly — the mark of rank)
T1 none, bare brow → T2 none, brow clearer, eyes brightening → T3 a half-hood shadowing the face,
eyes burning beneath → T4 a thin dark circlet begins to form, one rune-gem at the brow → T5 a
sharp violet-edged circlet with a single violet gem → T6 a dark crown-band wreathed in shadow,
points beginning → T7 a full crown of purple flame, each point tipped with fire → T8 a
free-floating ring-crown of void-fire hovering above the head → T9 a crown of seven stars → T10 a
crown of blazing white fire, like a small sun.

**④ Gauntlets / hands**
T1 bare hands, knuckles wrapped in grey cloth → T2 fingerless dark gloves → T3 leather bracers and
gloves → T4 rune-etched metal gauntlets, blue light in the seams → T5 violet-lit armored gauntlets
→ T6 gauntlets wreathed in shadow that drips from the fingertips → T7 regal gauntlets with claws
of purple flame → T8 gauntlets where space bends around the fingers → T9 hands gloved in living
starlight → T10 hands of pure radiance over void.

**⑤ The Soul-Shard** (one recurring mystery object — the Gate-fragment that should have killed him)
T1 a dull cracked grey stone shard on a frayed cord → T2 the shard glows faint blue at its core →
T3 cut and set in a small cobalt rune-stone amulet → T4 an electric-blue sigil-disc, runes slowly
rotating → T5 a violet gem cracked with inner light → T6 a shard of solid shadow that swallows
light → T7 a crowned sigil, the shard now a heart of purple flame → T8 a void-jewel that warps the
air around it → T9 a tiny captured star pulsing at his chest → T10 a white singularity — the shard
become a point of pure light.

**⑥ Footwear / base**
T1 worn, mud-caked travelling boots → T2 reinforced dark boots → T3 lightweight, soundless armored
boots → T4 rune-greaves, blue light at each step → T5 violet-edged sabatons → T6 boots
half-dissolved, trailing shadow → T7 he hovers a hand's breadth above the ground, feet wreathed in
flame → T8 he stands on warped, cracking space → T9 he stands on a disc of constellation-light →
T10 feet dissolve into void and white light — he no longer stands, he simply *is*.

> **To use:** for any level, pull that tier's items from the rows above into the prompt's wardrobe
> sentence. The 11 keyframes in §5 already bundle each tier's mantle + armor + crown + soul-shard.

**[AURA] colour by tier** (fill the Core's `[AURA]` token). These are also the exact aura
colours the **app binds as its live theme** — `tiers.json` recolours the whole UI to match the
art at each tier, so keep new art on-palette: T1 luminous teal-jade · T2 sapphire blue · T3
bright azure · T4 electric indigo · T5 vivid violet · T6 deep amethyst · T7 orchid purple-flame ·
T8 bright magenta-violet · T9 cosmic lavender-starlight · T10 radiant white over violet-void.

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
- **Size:** 1024×1280 (4:5 portrait); a full painted fantasy scene (dark/atmospheric);
  three-quarter-length crop (head to mid-thigh), centered.
- **Display:** shown on the dashboard status window + the level-up ceremony, over the spinning
  magic circle and aura. The card stage is portrait-friendly (300 px tall) — tell me once a few
  land and I'll fine-tune cropping/scale to your actual art.
- **Convert:** PNG → webp (I can batch-convert with `sharp`, like the backgrounds/fx — just drop
  the PNGs in and ping me).
- **Extending past 100:** append tiers/levels to `public/assets/characters/tiers.json` (no code
  change); reuse this codex's structure for the new tiers.

---

## 5. Ready-to-paste keyframe prompts (one per tier)

Fully assembled — **copy a whole block and paste it straight into Nano Banana 2**. Each one is a
**full masterfully hand-painted scene**; the model paints an environment that fits his rank and
aura. Save each as the filename shown. Do these 11 first; for the in-between levels, take the
nearest block and swap its one "aura/level" sentence for that level's line in §3.

**Want to pin a specific environment?** Optional — add the matching line below into the prompt
(right after the aura sentence). Otherwise the model invents a fitting one.

| Tier | Optional setting to paste in |
|------|------------------------------|
| 1 E-Rank | a ruined frontier outpost at cold grey first light, beside a dormant cracked-stone Gate; rubble and thin mist |
| 2 D-Rank | a quiet stone Gate-threshold wreathed in pale-blue dawn mist |
| 3 C-Rank | a deep underground cavern, faint cobalt light glowing in veins through the rock |
| 4 B-Rank | a dark forge-cavern, blue runes burning in the carved stone, cracks of glowing light underfoot |
| 5 A-Rank | a cracked stone threshold beneath a gathering violet storm, forks of distant lightning |
| 6 S-Rank | a vast ruined cathedral hall dissolving at its edges into a slow vortex of shadow |
| 7 Shadow Lord | a misty ruined throne-dais wreathed in cold purple flame, tattered banners of shadow |
| 8 Monarch | a fractured rift where reality warps and bends, shards of shattered space and violet-white cracks |
| 9 Cosmic Sovereign | an endless field of stars and deep purple nebulae — a personal cosmos |
| 10 God of Shadows | an infinite black void rimmed in faint white light, distant galaxies and a throne of darkness |

**Lv 1 — Tier 1, E-Rank** → save as `lvl_001.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow pale ash-white, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a torn ash-grey travelling cloak over simple dark garb with a worn leather chest-strap, his knuckles wrapped in grey cloth and mud-caked travelling boots, and a single dull cracked grey stone shard (his soul-shard) hanging on a frayed cord at his chest; hollow-cheeked but with hardening resolve. Almost no aura yet — a single thin wisp of pale-white light at the chest; he stands hunched, wary, worn. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects. Portrait 4:5, 1024x1280.
```

**Lv 11 — Tier 2, D-Rank** → save as `lvl_011.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow pale sky-blue, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a mended fitted slate-blue coat over a dark tunic with faint blue light-veins glowing beneath the skin, fingerless dark gloves and reinforced dark boots, the soul-shard at his chest now glowing faint blue at its core; his stance straighter and steadier. His aura has turned pale sky-blue at the core while a white halo still surrounds his body. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects. Portrait 4:5, 1024x1280.
```

**Lv 21 — Tier 3, C-Rank** → save as `lvl_021.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow cobalt blue, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a hooded dark-leather mantle with the half-hood up over a lean combat harness of buckles and straps, leather bracers and soundless armored boots, the soul-shard now cut and set in a small cobalt rune-stone amulet; a sharper, bladelike silhouette, cobalt eyes burning beneath the hood. His aura has condensed into hard-edged cobalt light that traces his outline like a drawn blade. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects. Portrait 4:5, 1024x1280.
```

**Lv 31 — Tier 4, B-Rank** → save as `lvl_031.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow electric cobalt-blue, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a heavy obsidian-scaled mantle clasped at one shoulder over rune-igniting obsidian plate, rune-etched metal gauntlets and greaves with blue light in the seams, a thin dark circlet beginning to form at his brow with a single rune-gem, and the soul-shard now an electric-blue sigil-disc with slowly rotating runes. His cobalt aura ignites into electric-blue flame, the first rune-lines burning on the chestplate. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects. Portrait 4:5, 1024x1280.
```

**Lv 41 — Tier 5, A-Rank** → save as `lvl_041.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow vivid violet, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a torn violet battle-mantle fraying into ribbons of light over sleek sculpted violet-trimmed black armor, violet-lit armored gauntlets and violet-edged sabatons, a sharp violet-edged circlet with a single violet gem at his brow, the soul-shard now a violet gem cracked with inner light. His aura erupts vivid violet from within the old blue, surging far past every previous limit. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects. Portrait 4:5, 1024x1280.
```

**Lv 51 — Tier 6, S-Rank** → save as `lvl_051.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow deep shadow-violet, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a living cloak of dark smoke whose hem dissolves into shadow over layered shadow-robes and dark plate, gauntlets wreathed in shadow that drips from the fingertips, a dark crown-band wreathed in shadow with its first points beginning, the soul-shard now a shard of solid shadow that swallows light. His violet aura churns into a slow vortex of shadow-violet around him, faceless summoned shadow-figures (energy, not gore) gathering silently at his back. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects (only aura-formed shadow constructs). Portrait 4:5, 1024x1280.
```

**Lv 61 — Tier 7, Shadow Lord** → save as `lvl_061.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow purple flame, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a regal black mantle that becomes vast wings of living shadow at the shoulders over filigreed black-and-violet armor, regal gauntlets with claws of purple flame, a full crown of purple flame with each point tipped in fire above his brow, the soul-shard now a crowned sigil holding a heart of purple flame. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects (only aura-formed constructs). Portrait 4:5, 1024x1280.
```

**Lv 71 — Tier 8, Monarch Candidate** → save as `lvl_071.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow bright void-violet, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a mantle of folding, fracturing space over ornate monarch's armor etched with shifting glyphs, gauntlets where space bends around the fingers, a free-floating ring-crown of void-fire hovering just above his head, the soul-shard a void-jewel warping the air around it; space itself frays and ripples at his edges in bright void-violet energy. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects (only aura-formed constructs). Portrait 4:5, 1024x1280.
```

**Lv 81 — Tier 9, Cosmic Sovereign** → save as `lvl_081.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow with lavender starlight, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears a mantle woven of nebula and constellations over dark star-metal armor with a cosmos set into the plating, hands gloved in living starlight, a crown of seven stars above his brow, the soul-shard now a tiny captured star pulsing at his chest. His aura has become a swirling lavender galaxy, stars and tiny worlds wheeling slowly around his body. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects (only aura-formed constructs). Portrait 4:5, 1024x1280.
```

**Lv 91 — Tier 10, Absolute God of Shadows** → save as `lvl_091.webp`
```
A single consistent character — the Ashbound: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow radiant white, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. He wears vestments of pure void veined with white starlight (armor and being nearly one), hands of pure radiance, a crown of blazing white fire above his brow, the soul-shard now a white singularity at his chest — utterly composed, already a deity. His aura splits into two layers: an inner white radiance over an outer endless black void. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects (only aura-formed constructs). Portrait 4:5, 1024x1280.
```

**Lv 100 — Tier 10, the final form** → save as `lvl_100.webp`
```
A single consistent character — the Ashbound, now a god: a lean, sharp-featured young man, mid-twenties, with tousled jet-black hair carrying one streak of ash-white, calm and unshakable piercing eyes that glow radiant white, pale skin, a faint old scar through the left eyebrow. The same exact face, build and features in every image. Three-quarter-length crop (head to mid-thigh, not full-body), standing, slight three-quarter angle, centred. The final form: a calm figure of pure white light enthroned in infinite black, robed in vestments of pure void veined with white starlight, crowned in blazing white fire, the soul-shard a white singularity burning at his chest, wings of pure white light spread against the absolute dark, his hands and feet dissolving into void and radiance — overwhelming yet utterly serene, the absolute end of the climb. Masterfully hand-painted dark-fantasy character art — a traditional painterly digital painting with confident visible brushwork, rich texture and luminous glazes, exquisite rendering of light and form, exceptional draftsmanship, gallery-quality concept art in the manner of a master oil painter and classical illustrator. Dramatic volumetric rim-light from the aura, deep atmospheric depth, cinematic and powerful, radiating overwhelming aura. Set him within a complete, atmospheric, masterfully hand-painted fantasy environment that befits his rank and aura, the aura glowing as the key light across the whole scene. No text, logos or UI. The character wears no modern clothing and holds no objects (only aura-formed constructs). Portrait 4:5, 1024x1280.
```
