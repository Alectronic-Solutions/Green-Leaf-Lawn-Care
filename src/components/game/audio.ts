// Synthesized mower sounds. No audio files: a filtered sawtooth for the
// engine, a band of filtered noise for the blade whir, and short tones for
// bumps and wins. Built lazily on the first user gesture (browsers block
// audio until then).

export class MowerAudio {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private running = false;
  enabled = true;

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 70;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 420;
    const engineGain = ctx.createGain();
    engineGain.gain.value = 0;
    osc.connect(lowpass).connect(engineGain).connect(ctx.destination);
    osc.start();

    const size = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1200;
    band.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noise.connect(band).connect(noiseGain).connect(ctx.destination);
    noise.start();

    this.ctx = ctx;
    this.osc = osc;
    this.engineGain = engineGain;
    this.noiseGain = noiseGain;
    return ctx;
  }

  start() {
    if (!this.enabled || this.running) return;
    const ctx = this.ensure();
    if (!ctx || !this.engineGain || !this.noiseGain || !this.osc) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    // Rev up from a low cough to idle, like a pull-start catching.
    this.osc.frequency.cancelScheduledValues(now);
    this.osc.frequency.setValueAtTime(38, now);
    this.osc.frequency.linearRampToValueAtTime(70, now + 0.35);
    this.engineGain.gain.cancelScheduledValues(now);
    this.engineGain.gain.linearRampToValueAtTime(0.05, now + 0.15);
    this.noiseGain.gain.cancelScheduledValues(now);
    this.noiseGain.gain.linearRampToValueAtTime(0.02, now + 0.15);
    this.running = true;
  }

  stop() {
    if (!this.ctx || !this.engineGain || !this.noiseGain) return;
    const now = this.ctx.currentTime;
    this.engineGain.gain.cancelScheduledValues(now);
    this.engineGain.gain.linearRampToValueAtTime(0, now + 0.3);
    this.noiseGain.gain.cancelScheduledValues(now);
    this.noiseGain.gain.linearRampToValueAtTime(0, now + 0.3);
    this.running = false;
  }

  /** Pitch follows speed; the blade gets louder under load. */
  update(speed: number, cutting: boolean) {
    if (!this.running || !this.ctx || !this.osc || !this.noiseGain) return;
    const now = this.ctx.currentTime;
    const base = cutting ? 58 : 72;
    this.osc.frequency.linearRampToValueAtTime(base + Math.min(60, speed * 6), now + 0.06);
    this.noiseGain.gain.linearRampToValueAtTime(cutting ? 0.045 : 0.012, now + 0.08);
  }

  private tone(freqs: number[], opts: { type?: OscillatorType; gap?: number; length?: number; volume?: number } = {}) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const { type = "sine", gap = 0.1, length = 0.28, volume = 0.07 } = opts;
    const now = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      const t = now + i * gap;
      gain.gain.linearRampToValueAtTime(volume, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
      osc.start(t);
      osc.stop(t + length + 0.02);
    });
  }

  bump() {
    this.tone([110, 82], { type: "triangle", gap: 0.05, length: 0.16, volume: 0.12 });
  }

  squish() {
    this.tone([320, 240], { type: "triangle", gap: 0.04, length: 0.12, volume: 0.06 });
  }

  bark() {
    this.tone([520, 440, 560], { type: "square", gap: 0.09, length: 0.07, volume: 0.035 });
  }

  star(index: number) {
    this.tone([660 + index * 110], { length: 0.35, volume: 0.07 });
  }

  win() {
    this.tone([523, 659, 784, 1047], { gap: 0.09, length: 0.4, volume: 0.06 });
  }

  dispose() {
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}
