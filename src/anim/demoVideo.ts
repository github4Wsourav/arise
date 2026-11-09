/**
 * Source for the looping exercise demo clips. Each file is named after the exercise `id`
 * — e.g. `bench.mp4`, `pulldown.mp4`.
 *
 * Resolution order (first hit wins):
 *   1. VITE_DEMO_VIDEO_BASE — an explicit base URL (any CDN or bucket you point it at).
 *   2. VITE_SUPABASE_URL    — the project's Supabase Storage public bucket `demos`.
 *   3. default              — the clips bundled at `public/assets/demos/` (served same-origin).
 *
 * Whichever base resolves, a per-file load error still falls back to the procedural skeleton
 * animation in the card, so a missing clip never breaks the screen.
 *
 * Extension defaults to `mp4`; override with VITE_DEMO_VIDEO_EXT=webm for smaller WebM clips.
 */

const ext =
  (import.meta.env.VITE_DEMO_VIDEO_EXT as string | undefined)?.replace(/^\./, '') || 'mp4';

function resolveBase(): string {
  const explicit = import.meta.env.VITE_DEMO_VIDEO_BASE as string | undefined;
  if (explicit) return explicit.replace(/\/+$/, '');

  const sb = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (sb && sb.startsWith('https://') && !sb.includes('YOUR-PROJECT')) {
    return `${sb.replace(/\/+$/, '')}/storage/v1/object/public/demos`;
  }
  const base = import.meta.env.BASE_URL ?? '/';
  return base.endsWith('/') ? `${base}assets/demos` : `${base}/assets/demos`;
}

const BASE = resolveBase();

/** Full URL of an exercise's demo clip. */
export function demoVideoUrl(exerciseId: string): string {
  return `${BASE}/${exerciseId}.${ext}`;
}
