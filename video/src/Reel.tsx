import React from "react";
import {
  AbsoluteFill, Img, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";

const C = {
  50: "#fdf8f4", 100: "#f5e6d3", 200: "#e8c9a8", 300: "#d4a574",
  400: "#c8956c", 500: "#b87a50", 700: "#6b4226", 800: "#4a2d18", 900: "#2c1a0e",
};
const font = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

const useIn = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 200 } });
};

const Rise: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const p = useIn(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px)`, ...style }}>{children}</div>
  );
};

const Scene: React.FC<{ bg: string; children: React.ReactNode; dur: number }> = ({ bg, children, dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: font, padding: "0 90px", justifyContent: "center", opacity: out }}>
      {children}
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ position: "absolute", top: 120, left: 90, fontSize: 40, fontWeight: 800, color, letterSpacing: 1 }}>
    ☕ DataLatte
  </div>
);

const Big: React.FC<{ children: React.ReactNode; color: string; size?: number }> = ({ children, color, size = 110 }) => (
  <div style={{ fontSize: size, fontWeight: 900, lineHeight: 1.05, color, letterSpacing: -2 }}>{children}</div>
);

// 1. Hook
const Hook = () => {
  const f = useCurrentFrame();
  const shake = f > 50 && f < 62 ? Math.sin(f * 2) * 8 : 0;
  return (
    <Scene bg={C[900]} dur={100}>
      <Logo color={C[300]} />
      <Rise><Big color={C[100]}>Great coffee.</Big></Rise>
      <Rise delay={12}><Big color={C[100]}>Friendly staff.</Big></Rise>
      <Rise delay={40} style={{ marginTop: 50, transform: `translateX(${shake}px)` }}>
        <Big color={C[300]}>Empty tables?</Big>
      </Rise>
    </Scene>
  );
};

// 2. Problem: Google Maps
const Pin: React.FC<{ delay: number; x: number; y: number; hl?: boolean }> = ({ delay, x, y, hl }) => {
  const p = useIn(delay);
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: "50% 50% 50% 0",
      transform: `rotate(-45deg) scale(${p})`, background: hl ? C[500] : C[200], opacity: hl ? 1 : 0.6,
    }} />
  );
};

const Maps = () => (
  <Scene bg={C[50]} dur={150}>
    <Logo color={C[700]} />
    <Rise><Big color={C[900]} size={88}>Locals search Google Maps before they pick a place.</Big></Rise>
    <div style={{ position: "relative", height: 420, margin: "60px 0", borderRadius: 40, background: C[100], overflow: "hidden" }}>
      <Pin delay={20} x={120} y={90} hl />
      <Pin delay={26} x={420} y={180} hl />
      <Pin delay={32} x={700} y={110} hl />
      <Pin delay={44} x={260} y={290} />
      <Pin delay={50} x={580} y={300} />
    </div>
    <Rise delay={60}>
      <div style={{ fontSize: 60, fontWeight: 700, color: C[700], lineHeight: 1.2 }}>
        Not in the top results?<br />You’re invisible.
      </div>
    </Rise>
  </Scene>
);

// 3. Three fixes
const fixes = [
  "Complete every field of your Google Business Profile",
  "Ask every happy customer for a review",
  "Post fresh photos every week",
];
const Fixes = () => (
  <Scene bg={C[800]} dur={210}>
    <Logo color={C[300]} />
    <Rise><Big color={C[100]} size={96}>3 fixes you can do this week</Big></Rise>
    <div style={{ marginTop: 70 }}>
      {fixes.map((t, i) => (
        <Rise key={t} delay={30 + i * 40} style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 48 }}>
          <div style={{
            flex: "0 0 110px", height: 110, borderRadius: 55, background: C[400], color: C[900],
            fontSize: 60, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{i + 1}</div>
          <div style={{ fontSize: 56, fontWeight: 700, color: C[50], lineHeight: 1.2 }}>{t}</div>
        </Rise>
      ))}
    </div>
  </Scene>
);

// 4. Founder
const Founder = () => {
  const p = useIn(0);
  return (
    <Scene bg={C[100]} dur={120}>
      <Logo color={C[700]} />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 60 }}>
        <Img src={staticFile("founder.png")} style={{
          width: 460, height: 460, borderRadius: "50%", objectFit: "cover",
          border: `12px solid ${C[400]}`, transform: `scale(${0.8 + 0.2 * p})`, opacity: p,
        }} />
      </div>
      <Rise delay={10}><Big color={C[900]} size={84}>Hi, I’m Nataliia.</Big></Rise>
      <Rise delay={22}>
        <div style={{ fontSize: 54, color: C[700], fontWeight: 600, lineHeight: 1.3, marginTop: 30 }}>
          I help cafés, salons, pet groomers & fitness studios get found by locals.
        </div>
      </Rise>
    </Scene>
  );
};

// 5. CTA
const CTA = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 6) * 0.03;
  return (
    <Scene bg={C[900]} dur={9999}>
      <Logo color={C[300]} />
      <Rise><Big color={C[100]} size={100}>Free local marketing audit</Big></Rise>
      <Rise delay={15}>
        <div style={{ fontSize: 56, color: C[200], marginTop: 40, lineHeight: 1.3 }}>
          See exactly what’s keeping customers from finding you.
        </div>
      </Rise>
      <Rise delay={30} style={{ marginTop: 90 }}>
        <div style={{
          transform: `scale(${pulse})`, background: C[400], color: C[900], borderRadius: 999,
          padding: "40px 0", textAlign: "center", fontSize: 64, fontWeight: 900,
        }}>
          datalatte.pro
        </div>
      </Rise>
      <Rise delay={45}>
        <div style={{ fontSize: 48, color: C[300], textAlign: "center", marginTop: 50, fontWeight: 700 }}>
          Link in bio · or comment “AUDIT” 👇
        </div>
      </Rise>
    </Scene>
  );
};

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C[900] }}>
    <Sequence durationInFrames={100}><Hook /></Sequence>
    <Sequence from={100} durationInFrames={150}><Maps /></Sequence>
    <Sequence from={250} durationInFrames={210}><Fixes /></Sequence>
    <Sequence from={460} durationInFrames={120}><Founder /></Sequence>
    <Sequence from={580}><CTA /></Sequence>
  </AbsoluteFill>
);
