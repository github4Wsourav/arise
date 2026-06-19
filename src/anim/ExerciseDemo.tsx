/**
 * Exercise demo slot. Prefers a looping video clip (`/assets/demos/{id}.mp4` by default,
 * or a remote bucket/CDN when configured); if the clip is missing or fails to load, it
 * silently falls back to the ported procedural FK animation.
 *
 * Either path plays only while mounted, visible, and the tab is foregrounded
 * (battery discipline carried over from Shift + Lift), and honors reduced-motion.
 */
import { useEffect, useRef, useState } from 'react';
import type { PoseId } from '../data/types';
import { DEMOS } from './poses';
import { DemoAnimator } from './animator';
import { demoVideoUrl } from './demoVideo';

interface Props {
  /** exercise id — the remote clip's filename key */
  id: string;
  /** pose key — drives the procedural fallback animation */
  pose: PoseId;
  playing: boolean;
}

export function ExerciseDemo({ id, pose, playing }: Props) {
  const url = demoVideoUrl(id);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  if (!videoUnavailable) {
    return (
      <DemoVideo
        key={url}
        src={url}
        playing={playing}
        onUnavailable={() => setVideoUnavailable(true)}
      />
    );
  }
  return <DemoAnimation pose={pose} playing={playing} />;
}

/** Looping muted clip, gated on visibility + foreground like the animation. */
function DemoVideo({
  src,
  playing,
  onUnavailable,
}: {
  src: string;
  playing: boolean;
  onUnavailable: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!playing || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      return;
    }
    const play = () => void v.play().catch(() => {});
    const visible = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) play();
      else v.pause();
    });
    visible.observe(v);
    const onVis = () => (document.hidden ? v.pause() : play());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      visible.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      v.pause();
    };
  }, [playing, src]);

  return (
    <video
      ref={ref}
      className="demo-canvas demo-video"
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      onError={onUnavailable}
      aria-label="Exercise demonstration video"
    />
  );
}

/** The original procedural FK demo animator wrapped for React. */
function DemoAnimation({ pose, playing }: { pose: PoseId; playing: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const anim = useRef<DemoAnimator | null>(null);

  useEffect(() => {
    if (!host.current) return;
    host.current.innerHTML = '';
    const demo = DEMOS[pose];
    anim.current = new DemoAnimator(host.current, demo, demo.label);
    return () => {
      anim.current?.stop();
      anim.current = null;
    };
  }, [pose]);

  useEffect(() => {
    if (!anim.current || !host.current) return;
    if (!playing) {
      anim.current.stop();
      return;
    }
    const visible = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) anim.current?.start();
      else anim.current?.stop();
    });
    visible.observe(host.current);
    const onVis = () => (document.hidden ? anim.current?.stop() : anim.current?.start());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      visible.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      anim.current?.stop();
    };
  }, [playing]);

  return <div ref={host} className="demo-canvas" />;
}
