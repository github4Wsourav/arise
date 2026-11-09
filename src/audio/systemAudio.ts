/**
 * System Audio Engine for Arise.
 * High-Energy Motivating Gym Soundtrack & Holographic Sound Effects.
 * 100% Procedural Web Audio API — zero heavy downloads, 0 network lag, 100% offline.
 */

export type MusicTrack = 'cyber_drive' | 'shadow_phonk';

class SystemAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // Music sequencer state
  private isMusicPlaying = false;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private current16th = 0;
  private nextNoteTime = 0;
  private tempo = 126; // 126 BPM workout drive
  private activeTrack: MusicTrack = 'cyber_drive';

  // Cached noise buffer for crisp percussion
  private noiseBuffer: AudioBuffer | null = null;

  // Settings
  private musicVolume = 0.35;
  private sfxVolume = 0.55;
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
      const track = localStorage.getItem('arise_music_track');
      if (track === 'shadow_phonk' || track === 'cyber_drive') this.activeTrack = track;
    } catch {
      // localStorage may not be available in tests/SSR
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master Compressor for cohesive workout mix
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);
      this.compressor.connect(this.ctx.destination);

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.compressor);

      // Music sub-mix
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMusicEnabled ? this.musicVolume : 0;
      this.musicGain.connect(this.masterGain);

      // SFX sub-mix
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isSfxEnabled ? this.sfxVolume : 0;
      this.sfxGain.connect(this.masterGain);

      // Generate 1-second white noise buffer for snappy gym drums
      const bufferSize = this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
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

  public getTrack(): MusicTrack {
    return this.activeTrack;
  }

  public setTrack(track: MusicTrack): void {
    this.activeTrack = track;
    this.tempo = track === 'shadow_phonk' ? 130 : 126;
    try {
      localStorage.setItem('arise_music_track', track);
    } catch {}
  }

  public setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;
    try {
      localStorage.setItem('arise_music_enabled', String(enabled));
    } catch {}

    const ctx = this.initContext();
    if (this.musicGain && ctx) {
      this.musicGain.gain.setTargetAtTime(enabled ? this.musicVolume : 0, ctx.currentTime, 0.1);
    }

    if (enabled && !this.isMusicPlaying) {
      this.startMusic();
    } else if (!enabled && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  public setSfxEnabled(enabled: boolean): void {
    this.isSfxEnabled = enabled;
    try {
      localStorage.setItem('arise_sfx_enabled', String(enabled));
    } catch {}

    const ctx = this.initContext();
    if (this.sfxGain && ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? this.sfxVolume : 0, ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('arise_music_vol', String(this.musicVolume));
    } catch {}

    const ctx = this.initContext();
    if (this.musicGain && ctx && this.isMusicEnabled) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, ctx.currentTime, 0.05);
    }
  }

  public setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('arise_sfx_vol', String(this.sfxVolume));
    } catch {}

    const ctx = this.initContext();
    if (this.sfxGain && ctx && this.isSfxEnabled) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, ctx.currentTime, 0.05);
    }
  }

  /* =========================================================================
   * MOTIVATING WORKOUT MUSIC SEQUENCER (126 BPM SYNTHWAVE / PHONK)
   * Driving kick, punchy rolling bassline, crisp hi-hats, anime lead synth
   * ========================================================================= */

  public startMusic(): void {
    const ctx = this.initContext();
    if (!ctx || this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    this.current16th = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;

    // Scheduler tick every 25ms looking ahead by 100ms
    this.timerId = setInterval(() => {
      if (!this.ctx || !this.isMusicPlaying) return;
      const lookahead = 0.12;
      while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
        this.scheduleStep(this.current16th, this.nextNoteTime);
        const secondsPer16th = (60 / this.tempo) / 4;
        this.nextNoteTime += secondsPer16th;
        this.current16th = (this.current16th + 1) % 64; // 4-bar loop (64 sixteenths)
      }
    }, 25);
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
      setTimeout(() => {
        if (!this.isMusicPlaying && this.musicGain && this.ctx) {
          this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
        }
      }, 100);
    }
  }

  private scheduleStep(step: number, time: number): void {
    if (!this.ctx || !this.musicGain) return;

    const beat = Math.floor(step / 4); // 0..15 beats
    const isDownbeat = step % 4 === 0;
    const isUpbeat = step % 4 === 2;

    // 1. PUNCHY GYM KICK DRUM (Every quarter note beat)
    if (isDownbeat) {
      this.playKick(time);
    }

    // 2. CRISP HI-HAT (Upbeat groove)
    if (isUpbeat || (step % 2 === 1 && (beat % 4 === 3 || step > 48))) {
      this.playHiHat(time, isUpbeat ? 0.07 : 0.04);
    }

    // 3. SNARE / CLAP (Beats 2 and 4 of every bar)
    const beatInBar = beat % 4;
    if (isDownbeat && (beatInBar === 1 || beatInBar === 3)) {
      this.playSnare(time);
    }

    // 4. MOTIVATING ROLLING CYBER BASSLINE (16th notes with fast filter decay)
    this.scheduleBass(step, time);

    // 5. ANIME HEROIC MELODIC ARPEGGIO (Floating plucks in 2nd half of loop)
    this.scheduleLead(step, time);
  }

  /** Punchy Gym Kick Drum */
  private playKick(time: number): void {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency pitch drop: 135Hz down to 42Hz gives that physical chest thump
    osc.frequency.setValueAtTime(135, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.08);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.17);
  }

  /** Crisp Metallic Hi-Hat */
  private playHiHat(time: number, vol = 0.06): void {
    if (!this.ctx || !this.musicGain || !this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    source.start(time);
    source.stop(time + 0.05);
  }

  /** Snappy Snare */
  private playSnare(time: number): void {
    if (!this.ctx || !this.musicGain || !this.noiseBuffer) return;

    // Noise body
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, time);
    filter.Q.setValueAtTime(1.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    source.start(time);
    source.stop(time + 0.13);

    // Fundamental tone snap
    const tone = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(190, time);
    tone.frequency.exponentialRampToValueAtTime(90, time + 0.07);

    toneGain.gain.setValueAtTime(0.15, time);
    toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    tone.connect(toneGain);
    toneGain.connect(this.musicGain);

    tone.start(time);
    tone.stop(time + 0.09);
  }

  /** Rolling Synthwave / Cyberpunk Bassline */
  private scheduleBass(step: number, time: number): void {
    if (!this.ctx || !this.musicGain) return;

    // Note frequencies in Hz (D minor workout chord progression)
    // Bar 1 (0-15): D (73.42Hz)
    // Bar 2 (16-31): F (87.31Hz) -> G (98Hz)
    // Bar 3 (32-47): Bb (58.27Hz) -> C (65.4Hz)
    // Bar 4 (48-63): A (55.0Hz) -> D (73.42Hz)
    const bar = Math.floor(step / 16);
    let freq = 73.42; // D2

    if (bar === 0) {
      freq = (step % 4 === 3) ? 87.31 : 73.42; // D with quick F punch
    } else if (bar === 1) {
      freq = step < 24 ? 87.31 : 98.0; // F2 -> G2
    } else if (bar === 2) {
      freq = step < 40 ? 58.27 : 65.41; // Bb1 -> C2
    } else {
      freq = step < 56 ? 55.0 : 73.42; // A1 -> D2
    }

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(1.8, time); // Controlled, warm, never piercing
    // Pluck filter sweep: snap from 1200Hz down to 260Hz
    filter.frequency.setValueAtTime(1100, time);
    filter.frequency.exponentialRampToValueAtTime(240, time + 0.09);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.12);
  }

  /** Melodic Lead Arpeggio (Anime Heroic Motivating Melody) */
  private scheduleLead(step: number, time: number): void {
    if (!this.ctx || !this.musicGain) return;

    // Only plays during bars 2 and 4 to build epic anticipation and groove
    const bar = Math.floor(step / 16);
    if (bar % 2 === 0 && step % 8 !== 0) return;

    // Pentatonic Heroic Scale: D4, F4, G4, A4, C5, D5
    const leadNotes = [
      293.66, 349.23, 440.0, 523.25, 587.33, 523.25, 440.0, 349.23,
      293.66, 440.0, 587.33, 698.46, 587.33, 523.25, 440.0, 349.23,
    ];

    const noteIdx = (step + (bar * 4)) % leadNotes.length;
    const freq = leadNotes[noteIdx];

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);
    filter.Q.setValueAtTime(1.2, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.07, time); // Smooth, stays behind drums and bass
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.19);
  }

  /* =========================================================================
   * HOLOGRAPHIC SOUND EFFECTS (VFX)
   * High-tactile, clean, satisfying gym game sounds
   * ========================================================================= */

  /**
   * Set Logged: Satisfying heavy weight-plate lock & mechanical clack.
   * Gives instant physical feedback when logging a set.
   */
  public playSetLogged(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // 1. Heavy plate sub-thump (weight hitting the rack)
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.07);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 0.1);

    // 2. High metallic locking clink (barbell pin click)
    const metal = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metal.type = 'triangle';
    metal.frequency.setValueAtTime(1480, now);
    metal.frequency.exponentialRampToValueAtTime(2200, now + 0.04);

    metalGain.gain.setValueAtTime(0.22, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    metal.connect(metalGain);
    metalGain.connect(this.sfxGain);
    metal.start(now);
    metal.stop(now + 0.09);

    // Subtle tactile haptic pulse on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }
  }

  /**
   * Solo Leveling Blue Screen Alert (Signature Crystal Notification)
   * Crystal bell chime alerting the hunter of a quest or message.
   */
  public playSystemChime(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const chords = [
      { f: 1046.5, t: 0 },    // C6
      { f: 1567.98, t: 0.07 }, // G6
      { f: 2093.0, t: 0.14 },  // C7
    ];

    chords.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.2, now + t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + t);
      osc.stop(now + t + 0.85);
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
  }

  /**
   * Rest Timer Finish: Energetic round-start buzzer chime.
   * 3 crisp ascending tones cutting through gym ambience clearly without harshness.
   */
  public playRestDone(): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150, 80, 250]);
    }

    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const pings = [
      { f: 880, t: 0, dur: 0.12 },     // A5
      { f: 880, t: 0.18, dur: 0.12 },   // A5
      { f: 1174.66, t: 0.36, dur: 0.35 } // D6 (Round Start!)
    ];

    pings.forEach(({ f, t, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.28, now + t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + t);
      osc.stop(now + t + dur + 0.02);
    });
  }

  /**
   * Level Up / Rank Up: Anime Power Surge Fanfare.
   * Sub impact riser + ascending imperial chord fanfare.
   */
  public playLevelUp(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Sub-bass riser
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(65, now);
    sub.frequency.exponentialRampToValueAtTime(130, now + 0.3);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.7);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 0.8);

    // Ascending Heroic Power Chord (D4, F4, A4, D5)
    const notes = [293.66, 349.23, 440.0, 587.33];
    notes.forEach((freq, idx) => {
      const startTime = now + 0.08 + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.95);
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 50, 120, 50, 200]);
    }
  }

  /**
   * Gate Cleared: Victory Swell
   */
  public playGateClear(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const chord = [220, 277.18, 329.63, 440]; // A major triumphant chord
    chord.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 1.25);
    });
  }

  /**
   * Subtle UI Click: High-tech tactile feedback
   */
  public playClick(): void {
    if (!this.isSfxEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.025);
  }
}

export const systemAudio = new SystemAudioEngine();
