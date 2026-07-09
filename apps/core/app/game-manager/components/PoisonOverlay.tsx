'use client';

import { Box } from '@mui/material';

/**
 * Phyrexian poison overlay — lifted verbatim from PlayerCard, shared with
 * TeamPanel. Green wash + SVG drips + rising/boiling bubbles + phyrexian
 * symbols, all ramping with poisonProgress (0..1 toward lethal). Scoped to
 * the nearest positioned ancestor via inset:0.
 */
export function PoisonOverlay({ poison, poisonProgress }: { poison: number; poisonProgress: number }) {
  return (
    <>
      {poisonProgress > 0 && (
        <>
          {/* Green tint wash */}
          <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', bgcolor: `rgba(0,${Math.round(80 + poisonProgress * 60)},0,${Math.pow(poisonProgress, 2) * 0.45})` }} />

          {/* Poison drips — SVG curvy */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none', overflow: 'visible' }} viewBox="0 0 600 220" preserveAspectRatio="none">
            <defs>
              {[
                { id: 'tg0', g: 'black', t: '#00c853' }, { id: 'tg1', g: '#003300', t: '#00ff44' },
                { id: 'tg2', g: 'black',  t: '#004d00' }, { id: 'tg3', g: '#001a00', t: '#00e040' },
                { id: 'tg4', g: '#002200', t: 'black'  }, { id: 'tg5', g: '#00c853', t: 'black'  },
                { id: 'bg0', g: 'black', t: '#00c853' }, { id: 'bg1', g: '#003300', t: '#00ff44' },
                { id: 'bg2', g: 'black',  t: '#004d00' }, { id: 'bg3', g: '#001a00', t: '#00e040' },
                { id: 'bg4', g: '#002200', t: 'black'  }, { id: 'bg5', g: '#00c853', t: 'black'  },
              ].map(({ id, g, t }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={g} stopOpacity={poisonProgress * 0.9} />
                  <stop offset="100%" stopColor={t} stopOpacity={poisonProgress * 0.4} />
                </linearGradient>
              ))}
            </defs>

            {/* Top drips */}
            <g style={{ transformOrigin: '0 0', transform: `scaleY(${poisonProgress})`, transition: 'transform 4s ease' }}>
              {[
                { x: 18,  len: 140, w: 8,  cx1: 22,  grad: 'tg0' },
                { x: 55,  len: 60,  w: 3,  cx1: -5,  grad: 'tg1' },
                { x: 95,  len: 190, w: 10, cx1: -18, grad: 'tg2' },
                { x: 148, len: 75,  w: 4,  cx1: 28,  grad: 'tg3' },
                { x: 190, len: 160, w: 7,  cx1: 8,   grad: 'tg4' },
                { x: 235, len: 45,  w: 2,  cx1: -24, grad: 'tg5' },
                { x: 272, len: 175, w: 9,  cx1: 14,  grad: 'tg0' },
                { x: 318, len: 85,  w: 4,  cx1: 30,  grad: 'tg2' },
                { x: 360, len: 200, w: 11, cx1: -6,  grad: 'tg3' },
                { x: 410, len: 55,  w: 3,  cx1: -26, grad: 'tg1' },
                { x: 448, len: 150, w: 7,  cx1: 18,  grad: 'tg4' },
                { x: 490, len: 70,  w: 4,  cx1: -32, grad: 'tg5' },
                { x: 535, len: 120, w: 6,  cx1: 10,  grad: 'tg2' },
              ].map((d, i) => {
                const h = d.len; const hw = d.w / 2; const tipX = d.x + d.cx1 * 0.3;
                return <path key={`td-${i}`} d={`M ${d.x-hw} 0 C ${d.x-hw+d.cx1*0.9} ${h*0.45} ${tipX-1} ${h*0.88} ${tipX} ${h} C ${tipX+1} ${h*0.88} ${d.x+hw+d.cx1*0.9} ${h*0.45} ${d.x+hw} 0 Z`} fill={`url(#${d.grad})`} />;
              })}
            </g>

            {/* Bottom drips */}
            <g style={{ transformOrigin: '0 220px', transform: `scaleY(${poisonProgress})`, transition: 'transform 4s ease' }}>
              {[
                { x: 38,  len: 110, w: 7,  cx1: 20,  grad: 'bg0' },
                { x: 80,  len: 50,  w: 3,  cx1: -28, grad: 'bg1' },
                { x: 128, len: 170, w: 9,  cx1: 10,  grad: 'bg2' },
                { x: 175, len: 65,  w: 4,  cx1: -8,  grad: 'bg3' },
                { x: 220, len: 130, w: 6,  cx1: 26,  grad: 'bg4' },
                { x: 260, len: 40,  w: 2,  cx1: -14, grad: 'bg5' },
                { x: 290, len: 155, w: 8,  cx1: -30, grad: 'bg0' },
                { x: 335, len: 90,  w: 5,  cx1: 6,   grad: 'bg2' },
                { x: 378, len: 185, w: 10, cx1: 24,  grad: 'bg3' },
                { x: 425, len: 60,  w: 3,  cx1: -18, grad: 'bg1' },
                { x: 462, len: 140, w: 7,  cx1: 32,  grad: 'bg4' },
                { x: 505, len: 75,  w: 4,  cx1: -10, grad: 'bg5' },
              ].map((d, i) => {
                const h = d.len; const hw = d.w / 2; const tipX = d.x + d.cx1 * 0.3; const tipY = 220 - h;
                return <path key={`bd-${i}`} d={`M ${d.x-hw} 220 C ${d.x-hw+d.cx1*0.9} ${220-h*0.45} ${tipX-1} ${220-h*0.88} ${tipX} ${tipY} C ${tipX+1} ${220-h*0.88} ${d.x+hw+d.cx1*0.9} ${220-h*0.45} ${d.x+hw} 220 Z`} fill={`url(#${d.grad})`} />;
              })}
            </g>
          </svg>

          {/* Poison bubbles — only above 5 counters */}
          {poison >= 5 && [
            { left: '12%', size: 8,  delay: '0s',    dur: '3.2s', dark: false },
            { left: '28%', size: 5,  delay: '0.7s',  dur: '2.6s', dark: true  },
            { left: '42%', size: 10, delay: '1.4s',  dur: '3.8s', dark: false },
            { left: '55%', size: 6,  delay: '0.3s',  dur: '2.9s', dark: true  },
            { left: '68%', size: 9,  delay: '1.1s',  dur: '3.4s', dark: false },
            { left: '80%', size: 5,  delay: '0.5s',  dur: '2.4s', dark: true  },
            { left: '20%', size: 7,  delay: '2.0s',  dur: '3.1s', dark: true  },
            { left: '90%', size: 6,  delay: '1.8s',  dur: '2.7s', dark: false },
          ].map((b, i) => {
            const intensity = Math.max(0, (poison - 4) / 6) * (poison >= 9 ? 1.0 : 0.6);
            const durBase = parseFloat(b.dur);
            const dur = poison >= 9 ? `${(durBase * 0.15).toFixed(2)}s` : poison >= 8 ? `${(durBase * 0.3).toFixed(1)}s` : b.dur;
            const delay = poison >= 9 ? '0s' : b.delay;
            return (
            <Box key={i} sx={{
              position: 'absolute',
              bottom: '-12px',
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              bgcolor: b.dark ? `rgba(0, 0, 0, ${intensity})` : `rgba(0, ${Math.round(180 + poisonProgress * 75)}, 0, ${intensity})`,
              border: b.dark ? `1px solid rgba(0, 200, 60, ${intensity * 0.6})` : `1px solid rgba(0, 255, 80, ${intensity * 0.8})`,
              zIndex: 4,
              pointerEvents: 'none',
              animation: `poisonBubble ${dur} ${delay} ease-in infinite`,
              '@keyframes poisonBubble': {
                '0%':   { transform: 'translateY(0) scale(1)',    opacity: poison >= 9 ? 1 : 0.8 },
                '60%':  { transform: 'translateY(-60px) scale(1.1)', opacity: poison >= 9 ? 0.85 : 0.6 },
                '100%': { transform: 'translateY(-110px) scale(0.6)', opacity: 0 },
              },
            }} />
          );})}

          {/* Extra boiling bubbles at 9+ */}
          {poison >= 9 && [
            { left: '5%',  size: 22, delay: '0s',    dur: '0.45s' },
            { left: '15%', size: 8,  delay: '0.05s', dur: '0.38s' },
            { left: '24%', size: 30, delay: '0.1s',  dur: '0.52s' },
            { left: '33%', size: 12, delay: '0.02s', dur: '0.41s' },
            { left: '40%', size: 5,  delay: '0.08s', dur: '0.35s' },
            { left: '48%', size: 26, delay: '0.15s', dur: '0.48s' },
            { left: '57%', size: 9,  delay: '0.03s', dur: '0.39s' },
            { left: '63%', size: 18, delay: '0.12s', dur: '0.44s' },
            { left: '72%', size: 35, delay: '0s',    dur: '0.55s' },
            { left: '79%', size: 7,  delay: '0.07s', dur: '0.36s' },
            { left: '86%', size: 14, delay: '0.09s', dur: '0.42s' },
            { left: '94%', size: 28, delay: '0.04s', dur: '0.50s' },
          ].map((b, i) => (
            <Box key={`boil-${i}`} sx={{
              position: 'absolute',
              bottom: '-12px',
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              bgcolor: i % 3 === 0 ? `rgba(0,0,0,0.85)` : `rgba(0,200,60,0.75)`,
              border: `1px solid rgba(0,255,80,0.6)`,
              zIndex: 4,
              pointerEvents: 'none',
              animation: `poisonBubbleFast ${b.dur} ${b.delay} ease-in infinite`,
              '@keyframes poisonBubbleFast': {
                '0%':   { transform: 'translateY(0) scale(1)',     opacity: 1   },
                '50%':  { transform: 'translateY(-50px) scale(1.05)', opacity: 0.8 },
                '100%': { transform: 'translateY(-120px) scale(0.5)', opacity: 0   },
              },
            }} />
          ))}

          {/* Phyrexian symbol — left side */}
          <Box sx={{
            position: 'absolute',
            left: `-${Math.round(30 + poisonProgress * 20)}px`,
            top: '30%',
            transform: `translateY(-50%) rotate(-${poisonProgress * 12}deg)`,
            zIndex: 3,
            pointerEvents: 'none',
            transition: 'all 0.8s ease',
            ...(poison >= 9 && {
              animation: 'phyrexianOrbitL 20s linear infinite',
              '@keyframes phyrexianOrbitL': {
                '0%':   { transform: 'translateY(-50%) rotate(-12deg) scale(1)'    },
                '25%':  { transform: 'translateY(-60%) rotate(8deg)   scale(1.35)' },
                '50%':  { transform: 'translateY(-40%) rotate(-20deg) scale(0.75)' },
                '75%':  { transform: 'translateY(-58%) rotate(4deg)   scale(1.2)'  },
                '100%': { transform: 'translateY(-50%) rotate(-12deg) scale(1)'    },
              },
            }),
          }}>
            <Box
              component="img"
              src="https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/watermark/phyrexian.svg"
              alt=""
              sx={{
                width: `${140 + poisonProgress * 200}px`,
                height: `${140 + poisonProgress * 200}px`,
                opacity: poisonProgress * 0.7,
                transition: 'all 0.8s ease',
                userSelect: 'none',
                display: 'block',
                filter: 'brightness(0)',
              }}
            />
          </Box>

          {/* Phyrexian symbol — right side */}
          <Box sx={{
            position: 'absolute',
            right: `-${Math.round(30 + poisonProgress * 20)}px`,
            top: '65%',
            transform: `translateY(-50%) rotate(${poisonProgress * 12}deg)`,
            zIndex: 3,
            pointerEvents: 'none',
            transition: 'all 0.8s ease',
            ...(poison >= 9 && {
              animation: 'phyrexianOrbitR 27s linear infinite',
              '@keyframes phyrexianOrbitR': {
                '0%':   { transform: 'translateY(-50%) rotate(12deg)  scale(1)'    },
                '30%':  { transform: 'translateY(-42%) rotate(-6deg)  scale(0.7)'  },
                '60%':  { transform: 'translateY(-62%) rotate(22deg)  scale(1.4)'  },
                '80%':  { transform: 'translateY(-44%) rotate(-2deg)  scale(0.85)' },
                '100%': { transform: 'translateY(-50%) rotate(12deg)  scale(1)'    },
              },
            }),
          }}>
            <Box
              component="img"
              src="https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/watermark/phyrexian.svg"
              alt=""
              sx={{
                width: `${140 + poisonProgress * 200}px`,
                height: `${140 + poisonProgress * 200}px`,
                opacity: poisonProgress * 0.7,
                transition: 'all 0.8s ease',
                userSelect: 'none',
                display: 'block',
                filter: 'brightness(0)',
              }}
            />
          </Box>

          {/* Floating rising symbols at 9+ */}
          {poison >= 9 && [
            { left: '42%', size: 120, dur: '18s', delay: '0s',   rotate: -15 },
            { left: '54%', size: 90,  dur: '22s', delay: '9s',   rotate: 20  },
            { left: '35%', size: 140, dur: '25s', delay: '14s',  rotate: -8  },
          ].map((s, i) => (
            <Box key={`rise-${i}`} sx={{
              position: 'absolute',
              left: s.left,
              bottom: 0,
              zIndex: 3,
              pointerEvents: 'none',
              animation: `phyrexianRise${i} ${s.dur} ${s.delay} ease-in-out infinite both`,
              [`@keyframes phyrexianRise${i}`]: {
                '0%':   { transform: `translate(0px,           ${s.size + 40}px) rotate(${s.rotate}deg)     scale(0.7)`, opacity: 0    },
                '10%':  { transform: `translate(${i%2?8:-6}px, ${s.size}px)      rotate(${s.rotate - 3}deg) scale(0.9)`, opacity: 0.4  },
                '45%':  { transform: `translate(${i%2?-10:12}px, -100px)  rotate(${s.rotate + 8}deg)  scale(1.1)`,  opacity: 0.65 },
                '75%':  { transform: `translate(${i%2?6:-8}px,  -260px)   rotate(${s.rotate - 5}deg)  scale(0.9)`,  opacity: 0.3  },
                '88%':  { transform: `translate(${i%2?-4:10}px, -400px)   rotate(${s.rotate + 12}deg) scale(0.6)`,  opacity: 0    },
                '100%': { transform: `translate(0px,           ${s.size + 40}px) rotate(${s.rotate}deg)     scale(0.7)`, opacity: 0    },
              },
            }}>
              <Box
                component="img"
                src="https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/watermark/phyrexian.svg"
                alt=""
                sx={{ width: s.size, height: s.size, display: 'block', filter: 'brightness(0)', userSelect: 'none' }}
              />
            </Box>
          ))}
        </>
      )}

    </>
  );
}
