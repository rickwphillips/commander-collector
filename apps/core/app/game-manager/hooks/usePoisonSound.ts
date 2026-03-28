'use client';

import { useEffect } from 'react';

export function usePoisonSound(poison: number, isEliminated: boolean, soundEnabled: boolean) {
  useEffect(() => {
    if (!soundEnabled || poison < 7 || isEliminated) return;
    const volMult = poison === 7 ? 0.18 : poison === 8 ? 0.35 : 1.0;
    const playBubbles = poison >= 8;
    const playStabs   = poison >= 9;
    let stopped = false;
    let bubbleAudio: HTMLAudioElement | undefined;
    let stabTimer: ReturnType<typeof setTimeout> | undefined;
    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.18 * volMult, ctx.currentTime + 3.5);
      master.connect(ctx.destination);
      const echoDelay = ctx.createDelay(1.0);
      echoDelay.delayTime.value = 0.24;
      const echoFeedback = ctx.createGain();
      echoFeedback.gain.value = 0.36;
      const echoOut = ctx.createGain();
      echoOut.gain.value = 0.5;
      echoDelay.connect(echoFeedback);
      echoFeedback.connect(echoDelay);
      echoDelay.connect(echoOut);
      echoOut.connect(master);

      // Ominous drone — low sawtooth through a muffling filter, slow tremolo
      const droneOsc = ctx.createOscillator();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.value = 58; // Bb1 — flat and dark
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 180;
      droneFilter.Q.value = 1.2;
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0, ctx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.09 * volMult, ctx.currentTime + 4.5);
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.12; // very slow tremolo
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      // Flanger on the drone — short delay modulated by a slow LFO,
      // rate drifts from 0.04Hz → 0.18Hz over ~30s for a creeping effect
      const flangeDelay = ctx.createDelay(0.02);
      flangeDelay.delayTime.value = 0.007; // 7ms center
      const flangeLfo = ctx.createOscillator();
      flangeLfo.type = 'sine';
      flangeLfo.frequency.setValueAtTime(0.04, ctx.currentTime);
      flangeLfo.frequency.linearRampToValueAtTime(0.18, ctx.currentTime + 30);
      const flangeDepth = ctx.createGain();
      flangeDepth.gain.value = 0.005; // ±5ms sweep
      const flangeWet = ctx.createGain();
      flangeWet.gain.value = 0.6;
      flangeLfo.connect(flangeDepth);
      flangeDepth.connect(flangeDelay.delayTime);
      droneFilter.connect(flangeDelay);
      flangeDelay.connect(flangeWet);
      flangeWet.connect(droneGain);

      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain); // dry path
      droneGain.connect(master);
      droneOsc.start();
      lfo.start();
      flangeLfo.start();

      if (playBubbles) {
        const basePath = process.env.NODE_ENV === 'production' ? '/app/projects/commander' : '';
        bubbleAudio = new Audio(`${basePath}/audio/poison_bubbles.mp3`);
        bubbleAudio.loop = true;
        bubbleAudio.volume = poison === 8 ? 0.35 : 0.7;
        bubbleAudio.play().catch(() => { /* autoplay blocked */ });
      }

      // Soprano stab — random high note, sharp attack, quick decay
      const scheduleStab = () => {
        if (stopped || ctx.state === 'closed') return;
        const t = ctx.currentTime + 0.01;
        const freq    = 1100 + Math.random() * 600; // 1100–1700Hz (violin extreme upper register)
        const noteDur = 1.2 + Math.random() * 0.8; // long bow stroke

        // Sawtooth for string-like harmonics
        const stab = ctx.createOscillator();
        stab.type = 'sawtooth';
        stab.frequency.value = freq;

        // No pitch vibrato — flat steady tone is creepier
        const vibLfo = ctx.createOscillator(); // still started/stopped for cleanup symmetry
        vibLfo.type = 'sine';
        vibLfo.frequency.value = 0;

        // Amplitude tremolo — adds nervous flutter
        const tremLfo = ctx.createOscillator();
        tremLfo.type = 'sine';
        tremLfo.frequency.value = 7.5 + Math.random() * 2;
        const tremDepth = ctx.createGain();
        tremDepth.gain.value = 0.018;
        tremLfo.connect(tremDepth);

        // Narrow band-pass — thin, strained, high-string tone
        const stabFilter = ctx.createBiquadFilter();
        stabFilter.type = 'bandpass';
        stabFilter.frequency.value = freq * 1.4;
        stabFilter.Q.value = 1.8;

        // Envelope: very slow bow attack, hold, long fade out
        const stabGain = ctx.createGain();
        stabGain.gain.setValueAtTime(0, t);
        stabGain.gain.linearRampToValueAtTime(0.07, t + 0.45);
        stabGain.gain.setValueAtTime(0.07, t + noteDur - 0.5);
        stabGain.gain.linearRampToValueAtTime(0.001, t + noteDur);
        tremDepth.connect(stabGain.gain); // tremolo on amplitude

        vibLfo.start(t);
        tremLfo.start(t);
        stab.connect(stabFilter);
        stabFilter.connect(stabGain);
        stabGain.connect(master);
        stabGain.connect(echoDelay);
        stab.start(t);
        stab.stop(t + noteDur + 0.05);
        vibLfo.stop(t + noteDur + 0.05);
        tremLfo.stop(t + noteDur + 0.05);

        stabTimer = setTimeout(scheduleStab, 4000 + Math.random() * 7000);
      };
      if (playStabs) stabTimer = setTimeout(scheduleStab, 3000 + Math.random() * 4000);

    } catch { /* AudioContext not available */ }
    return () => {
      stopped = true;
      bubbleAudio?.pause();
      clearTimeout(stabTimer);
      ctx?.close();
    };
  }, [poison, isEliminated, soundEnabled]); // re-runs at 8→9 transition, restarting at full volume
}
