/**
 * System Audio Engine for Arise.
 * Built with the Web Audio API — zero external files, 100% offline, works on phones and laptops.
 * Provides:
 * 1. Procedural "Shadow Gate" Dark Ambient Music (drone, resonant pads, and harmonic breath).
 * 2. Holographic System SFX (Solo Leveling quest notification chime, set logged blip, level-up fanfare, rest timer alarm).
 */

class SystemAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active ambient nodes
  private ambientOscillators: OscillatorNode[] = [];
  private ambientLfo: OscillatorNode | null = null;
  private isAmbiencePlaying = false;

  // Settings
  private musicVolume = 0.4;
  private sfxVolume = 0.6;
  private isMusicEnabled = false;
  private isSfxEnabled = true;

  constructor() {
    try {
      this.isMusicEnabled = localStorage.getItem('arise_music_enabled') === 'true';
      this.isSfxEnabled = localStorage.getItem('arise_sfx_enabled') !== 'false';
      const mVol = localStorage.getItem('arise_music_vol');
      if (mVol) this.musicVolume = parseFloat(mVol);
      const sVol = localStorage.getItem('arise_sfx_vol');
      if (sVol) this.sfxVolume = parseFloat(sVol);
    } catch {
      // localStorage may not be available in SSR/unit test
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMusicEnabled ? this.musicVolume : 0;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isSfxEnabled ? this.sfxVolume : 0;
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  public getSfxEnabled(): boolean {
    return this.isSfxEnabled;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;
    try {
      localStorage.setItem('arise_music_enabled', String(enabled));
    } catch {}

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime, 0.2);
    }

    if (enabled && !this.isAmbiencePlaying) {
      this.startAmbience();
    } else if (!enabled && this.isAmbiencePlaying) {
      this.stopAmbience();
    }
  }

  public setSfxEnabled(enabled: boolean): void {
    this.isSfxEnabled = enabled;
    try {
      localStorage.setItem('arise_sfx_enabled', String(enabled));
    } catch {}

    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime, 0.1);
    }
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('arise_music_vol', String(this.musicVolume));
    } catch {}

    if (this.musicGain && this.ctx && this.isMusicEnabled) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.1);
    }
  }

  public setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('arise_sfx_vol', String(this.sfxVolume));
    } catch {}

    if (this.sfxGain && this.ctx && this.isSfxEnabled) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.1);
    }
  }

  /** Start procedural "Shadow Gate" dark ambient soundtrack */
  public startAmbience(): void {
    const ctx = this.initContext();
    if (!ctx || !this.musicGain || this.isAmbiencePlaying) return;

    this.isAmbiencePlaying = true;
    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Root Drone (55 Hz / A1)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.exponentialRampToValueAtTime(0.35, now + 4);
    subOsc.connect(subGain);
    subGain.connect(this.musicGain);
    subOsc.start(now);
    this.ambientOscillators.push(subOsc);

    // 2. Harmonic Pad with Low-Pass Resonance (110 Hz / A2 + 165 Hz / E3 fifth)
    const padOsc1 = ctx.createOscillator();
    padOsc1.type = 'sawtooth';
    padOsc1.frequency.setValueAtTime(110, now);

    const padOsc2 = ctx.createOscillator();
    padOsc2.type = 'sawtooth';
    padOsc2.frequency.setValueAtTime(164.8, now); // Just fifth for dark medieval/fantasy feel

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);
    filter.Q.setValueAtTime(4, now);

    // Modulate filter frequency slowly with LFO to create living "breathing" aura
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, now); // 12.5s cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    this.ambientLfo = lfo;

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.001, now);
    padGain.gain.exponentialRampToValueAtTime(0.18, now + 5);

    padOsc1.connect(filter);
    padOsc2.connect(filter);
    filter.connect(padGain);
    padGain.connect(this.musicGain);

    padOsc1.start(now);
    padOsc2.start(now);
    this.ambientOscillators.push(padOsc1, padOsc2);

    // 3. Ethereal Shimmer Bell Pulse (880 Hz / A5 soft sine)
    const shimmerOsc = ctx.createOscillator();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(880, now);

    const shimmerTremolo = ctx.createOscillator();
    shimmerTremolo.type = 'sine';
    shimmerTremolo.frequency.setValueAtTime(0.3, now); // Gentle slow pulse

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.015, now);
    shimmerTremolo.connect(shimmerGain.gain);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(this.musicGain);

    shimmerOsc.start(now);
    shimmerTremolo.start(now);
    this.ambientOscillators.push(shimmerOsc, shimmerTremolo);
  }

  /** Stop background soundtrack */
  public stopAmbience(): void {
    if (!this.ctx || !this.isAmbiencePlaying) return;
    const now = this.ctx.currentTime;

    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(0.001, now, 0.8);
    }

    setTimeout(() => {
      this.ambientOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      this.ambientOscillators = [];
      if (this.ambientLfo) {
        try {
          this.ambientLfo.stop();
          this.ambientLfo.disconnect();
        } catch {}
        this.ambientLfo = null;
      }
      this.isAmbiencePlaying = false;
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
      }
    }, 1000);
  }

  /**
   * Solo Leveling System Notification Chime (Crystal Bell)
   * The signature sound played when "The System" alerts the hunter.
   */
  public playSystemChime(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Dual-tone high harmonic crystal chime (C6 -> G6)
    const freqs = [1046.5, 1567.98];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  /** Set Logged Confirmation Sound: crisp holographic sci-fi blip */
  public playSetLogged(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /** Level Up / Rank Up Fanfare: sub-bass drop + ascending 5-note imperial chord */
  public playLevelUp(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // 1. Deep Sub Drop
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(45, now + 0.6);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 0.85);

    // 2. Ascending heroic arpeggio (C4, E4, G4, B4, D5)
    const notes = [261.63, 329.63, 392.0, 493.88, 587.33];
    notes.forEach((freq, i) => {
      const startTime = now + 0.12 + i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, startTime);
      filter.Q.setValueAtTime(3, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  }

  /** Rest Timer Completion Alarm: urgent double chime + vibration */
  public playRestDone(): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([180, 80, 180, 80, 300]);
    }

    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    [0, 0.22, 0.44].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.3, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  }
}

export const systemAudio = new SystemAudioEngine();
