'use client';

import { useCallback, useEffect } from 'react';

export function useSounds(soundEnabled: boolean, hasCitysBlessing: boolean) {
  const playCitysBlessing = useCallback(() => {
    if (!soundEnabled) return;
    const basePath = process.env.NODE_ENV === 'production' ? '/app/projects/commander' : '';
    const audio = new Audio(`${basePath}/audio/citys_blessing_intro.mp3`);
    audio.play().catch(() => { /* autoplay blocked */ });
  }, [soundEnabled]);

  // Ongoing firework loop — continues as long as the blessing is active.
  // Starts after the initial playCitysBlessing fanfare winds down (~32s).
  useEffect(() => {
    if (!hasCitysBlessing || !soundEnabled) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ctx: AudioContext;
    const scheduleNext = () => {
      if (stopped) return;
      try {
        if (!ctx || ctx.state === 'closed') ctx = new AudioContext();
        const master = ctx.createGain();
        master.gain.value = 0.08;
        master.connect(ctx.destination);
        const now = ctx.currentTime;
        // Launch whoosh
        const lDur = 0.45;
        const lBuf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * lDur), ctx.sampleRate);
        const ld = lBuf.getChannelData(0);
        for (let i = 0; i < ld.length; i++) ld[i] = Math.random() * 2 - 1;
        const lSrc = ctx.createBufferSource();
        lSrc.buffer = lBuf;
        const lFilt = ctx.createBiquadFilter();
        lFilt.type = 'bandpass';
        lFilt.frequency.setValueAtTime(250, now);
        lFilt.frequency.exponentialRampToValueAtTime(1800, now + lDur);
        lFilt.Q.value = 4.0;
        const lGain = ctx.createGain();
        lGain.gain.setValueAtTime(0, now);
        lGain.gain.linearRampToValueAtTime(0.30, now + 0.06);
        lGain.gain.linearRampToValueAtTime(0.001, now + lDur);
        lSrc.connect(lFilt); lFilt.connect(lGain); lGain.connect(master);
        lSrc.start(now); lSrc.stop(now + lDur);
        // Boom
        const bt = now + lDur * 0.83;
        const thud = ctx.createOscillator();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(120, bt);
        thud.frequency.exponentialRampToValueAtTime(45, bt + 0.30);
        const thudGain = ctx.createGain();
        thudGain.gain.setValueAtTime(0, bt);
        thudGain.gain.linearRampToValueAtTime(2.2, bt + 0.006);
        thudGain.gain.exponentialRampToValueAtTime(0.001, bt + 0.42);
        thud.connect(thudGain); thudGain.connect(master);
        thud.start(bt); thud.stop(bt + 0.46);
      } catch { /* AudioContext not available */ }
      timer = setTimeout(scheduleNext, 7000 + Math.random() * 8000);
    };
    // First shot after the initial fanfare's fireworks end
    timer = setTimeout(scheduleNext, 33000 + Math.random() * 4000);
    return () => {
      stopped = true;
      clearTimeout(timer);
      ctx?.close();
    };
  }, [hasCitysBlessing, soundEnabled]);

  return { playCitysBlessing };
}
