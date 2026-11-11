const { chromium } = require('playwright');
const { execFileSync } = require('child_process'); const fs = require('fs');
const FPS = 30;
function helpers() {
  const $ = id => document.getElementById(id);
  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const back = x => { x = Math.min(1, Math.max(0, x)); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const vis = (el, o, y = 0, s = 1, x = 0) => { el.style.opacity = o; el.style.transform = `translate(${x}px,${y}px) scale(${s})`; };
  const scene = (id, t, a, b, rise = 50) => { const i = ease(seg(t, a, a + 0.4)), o = 1 - ease(seg(t, b - 0.4, b)); vis($(id), i * o, (1 - i) * rise); };
  const shake = (t, t0, amp) => { const s = Math.max(0, 1 - seg(t, t0, t0 + 0.35)) * amp; $('world').style.transform = `translate(${Math.sin(t * 90) * s}px,${Math.cos(t * 70) * s}px)`; $('flash').style.opacity = t >= t0 ? Math.max(0, 0.5 * (1 - seg(t, t0, t0 + 0.2))) : 0; };
  return { $, ease, back, seg, vis, scene, shake };
}
const page = (p, body, extra = '') => `<html><body style="margin:0;width:1080px;height:1920px;background:${p.bg};font-family:Inter,Helvetica,Arial,sans-serif;position:relative;overflow:hidden;color:${p.fg}">
<div id="world" style="position:absolute;inset:0"><div id="flash" style="position:absolute;inset:0;background:${p.flash || p.fg};opacity:0;z-index:9"></div>
<div id="safe" style="position:absolute;left:80px;top:250px;width:840px;height:1250px">
<div style="position:absolute;left:0;top:0;font-size:46px;font-weight:800;color:${p.acc}">${p.logo || '☕'} datalatte.pro</div>
<div style="position:absolute;left:0;top:76px;width:840px;height:6px;border-radius:3px;background:${p.track}"><div id="prog" style="height:100%;width:0;background:${p.acc};border-radius:3px"></div></div>
${body}</div></div>
<style>.lbl{font-size:30px;letter-spacing:6px;text-transform:uppercase;color:${p.mut};font-weight:700}.abs{position:absolute;left:0;width:840px}.btn{display:inline-block;padding:30px 54px;border-radius:28px;background:${p.acc};color:${p.btnfg};font-size:64px;font-weight:900}${extra}</style></body></html>`;

// ---------- data-driven content plan: cards, carousels, reels ----------
const PLAN = JSON.parse(fs.readFileSync('/home/user/datalatte/content-plan/plan-2026-11-23.json', 'utf8'));
const P = {
  coffee: { bg: 'radial-gradient(1200px 1400px at 30% 30%,#4a2c17,#2c1a0e 60%,#1f1209)', fg: '#f5e6d3', acc: '#d4a574', mut: '#c8956c', track: 'rgba(255,255,255,.12)', btnfg: '#2c1a0e', logo: '☕' },
  holiday: { bg: 'radial-gradient(1200px 1400px at 70% 20%,#4a1a22,#2a1015 60%,#1c0a0e)', fg: '#fdeee9', acc: '#ff8f70', mut: '#d19a8c', track: 'rgba(255,255,255,.12)', btnfg: '#2a1015', logo: '🎁' },
  sports: { bg: 'radial-gradient(1200px 1400px at 30% 20%,#2c3138,#171a1f 60%,#0f1114)', fg: '#f0ece4', acc: '#ff6a2b', mut: '#8b95a1', track: 'rgba(255,255,255,.14)', btnfg: '#14161a', logo: '📺' },
  ai: { bg: 'radial-gradient(1200px 1400px at 80% 10%,#232830,#14161a 60%,#0e1013)', fg: '#e9e6df', acc: '#ffb454', mut: '#7d8793', track: 'rgba(255,255,255,.12)', btnfg: '#14161a', logo: '✦' },
  food: { bg: 'radial-gradient(1200px 1400px at 80% 15%,#1d3d31,#10231c 60%,#0a1511)', fg: '#e8f5ee', acc: '#7ee0a3', mut: '#7fa592', track: 'rgba(255,255,255,.12)', btnfg: '#0a1511', logo: '🍽' },
  fitness: { bg: 'radial-gradient(1000px 1300px at 50% 30%,#1d1f12,#0c0c0c 65%)', fg: '#f4f4f4', acc: '#c6ff3d', mut: '#8a8a8a', track: 'rgba(255,255,255,.14)', btnfg: '#0c0c0c', logo: '💪' },
  email: { bg: 'radial-gradient(1200px 1400px at 20% 15%,#14373b,#0b1d20 65%)', fg: '#e6f6f4', acc: '#5fd1c4', mut: '#7fb3ad', track: 'rgba(255,255,255,.12)', btnfg: '#0b1d20', logo: '✉️' },
  social: { bg: 'radial-gradient(1200px 1400px at 70% 15%,#4a2236,#2a1420 60%,#1d0d15)', fg: '#fbe9ee', acc: '#f2a7b8', mut: '#c98a9b', track: 'rgba(255,255,255,.12)', btnfg: '#2a1420', logo: '📱' },
};
P.ads = P.coffee;
const MUSIC = {
  holiday: { bpm: 96, wave: 'soft', kick: false }, sports: { bpm: 120, wave: 'bass', kick: true }, ai: { bpm: 100, wave: 'pulse', kick: false }, ads: { bpm: 100, wave: 'marimba', kick: false },
  coffee: { bpm: 88, wave: 'soft', kick: false }, food: { bpm: 100, wave: 'pulse', kick: false }, fitness: { bpm: 124, wave: 'bass', kick: true }, email: { bpm: 104, wave: 'bright', kick: false }, social: { bpm: 104, wave: 'bright', kick: false },
};
const CH = [[[220, 261.63, 329.63, 392], [174.61, 220, 261.63, 329.63], [130.81, 261.63, 329.63, 392], [196, 246.94, 293.66, 329.63]], [[110, 130.81, 164.81, 196], [87.31, 110, 130.81, 164.81], [130.81, 164.81, 196, 246.94], [98, 123.47, 146.83, 196]]];
const bigSize = (t, max) => Math.max(110, Math.min(max, Math.floor(840 / (String(t).length * 0.62))));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KICK = { holiday: 'Holiday marketing', sports: 'Sports & streaming TV', ai: 'AI & local search', ads: 'Paid ads', coffee: 'Reviews & local', food: 'Restaurants', fitness: 'Fitness studios', email: 'Email & SMS', social: 'Social media' };

// 4:5 card / carousel slide
const slideHtml = (p, inner, foot) => `<html><body style="margin:0;width:1080px;height:1350px;background:${p.bg};font-family:Inter,Helvetica,Arial,sans-serif;color:${p.fg};position:relative;overflow:hidden">
<div style="position:absolute;left:100px;top:150px;font-size:46px;font-weight:800;color:${p.acc}">${p.logo} datalatte.pro</div>
<div style="position:absolute;left:100px;right:100px;top:330px">${inner}</div>
<div style="position:absolute;left:100px;right:100px;bottom:150px;font-size:32px;font-weight:700;color:${p.mut}">${esc(foot || '')}</div></body></html>`;
const statInner = (p, kicker, big, line, sub) => `<div style="font-size:30px;letter-spacing:6px;text-transform:uppercase;color:${p.mut};font-weight:700">${esc(kicker)}</div>
<div style="font-size:${bigSize(big, 300)}px;line-height:1;font-weight:900;color:${p.acc};letter-spacing:-6px;margin-top:24px;white-space:nowrap">${esc(big)}</div>
<div style="font-size:${line.length > 60 ? 54 : 66}px;line-height:1.12;font-weight:900;margin-top:22px">${esc(line)}</div>${sub ? `<div style="font-size:42px;line-height:1.25;font-weight:600;margin-top:30px;opacity:.82">${esc(sub)}</div>` : ''}`;

// 9:16 reel
const reelBody = (p, a) => `<div id="h" class="abs" style="top:430px;font-size:132px;line-height:1.05;font-weight:900">${esc(a.hook)}</div>
<div id="a" class="abs" style="top:330px"><div class="lbl">${esc(KICK[a.theme])}</div><div id="big" style="font-size:${bigSize(a.big, 300)}px;line-height:1;font-weight:900;color:${p.acc};letter-spacing:-6px;margin-top:12px;white-space:nowrap;transform-origin:left center">${esc(a.big)}</div><div id="line" style="font-size:${a.line.length > 70 ? 58 : 68}px;line-height:1.12;font-weight:800;margin-top:26px"></div><div id="src" style="font-size:28px;color:${p.mut};margin-top:28px">${esc(a.src)}</div></div>
<div id="b" class="abs" style="top:440px"><div class="lbl">So what</div><div style="font-size:76px;line-height:1.1;font-weight:900;margin-top:30px;color:${p.acc}">${esc(a.take)}</div></div>
<div id="d" class="abs" style="top:440px"><div style="font-size:88px;font-weight:900;line-height:1.08">Read the guide</div><div id="btn" style="margin-top:56px" class="btn">datalatte.pro</div></div>`;
function reelRender(t, H, D) {
  const { $, ease, back, seg, vis, scene, shake } = H; $('prog').style.width = (t / 12 * 100) + '%'; shake(t, 1.1, 12);
  vis($('h'), back(seg(t, 0, .3)) * (1 - seg(t, .95, 1.1)), (1 - back(seg(t, 0, .3))) * 60);
  scene('a', t, 1.1, 6.1); $('a').style.opacity = t < 1.1 ? 0 : $('a').style.opacity;
  const k = ease(seg(t, 1.15, 2.5)); const v = D.num * k;
  $('big').textContent = D.pre + (D.dec ? v.toFixed(D.dec) : Math.round(v).toLocaleString('en-US')) + D.suf; $('big').style.transform = `scale(${1 + .5 * Math.max(0, 1 - seg(t, 1.1, 1.4))})`;
  const w = D.line.split(' ');
  $('line').innerHTML = w.map((x, i) => { const q = ease(seg(t, 2.6 + i * 0.1, 2.8 + i * 0.1)); return `<span style="opacity:${q};display:inline-block;margin-right:14px;transform:translateY(${(1 - q) * 22}px)">${x}</span>`; }).join('');
  $('src').style.opacity = ease(seg(t, 2.8 + w.length * 0.1, 3.2 + w.length * 0.1));
  scene('b', t, 6.1, 9.2); $('b').style.opacity = t < 6.1 ? 0 : $('b').style.opacity;
  const di = back(seg(t, 9.3, 9.8)); vis($('d'), Math.min(1, di * 1.5), (1 - di) * 70); $('d').style.opacity = t < 9.3 ? 0 : $('d').style.opacity; $('btn').style.transform = `scale(${1 + .05 * Math.sin(Math.max(0, t - 10.4) * 7)})`;
}
const parseBig = (b) => { const m = String(b).match(/^(\D*)(\d[\d,]*\.?\d*)(.*)$/); if (!m) return { pre: '', num: 0, dec: 0, suf: b }; const n = parseFloat(m[2].replace(/,/g, '')); return { pre: m[1], num: n, dec: (m[2].split('.')[1] || '').length, suf: m[3] }; };

(async () => {
  const only = process.argv.slice(2); const b = await chromium.launch();
  fs.mkdirSync('out', { recursive: true });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const rv = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [idx, a] of PLAN.entries()) {
    if (only.length && !only.includes(a.date)) continue;
    const p = P[a.theme] || P.coffee;
    if (a.kind === 'card') {
      await pg.setContent(slideHtml(p, statInner(p, KICK[a.theme], a.big, a.line, a.sub || ''), 'Source: ' + a.src));
      await pg.screenshot({ path: `out/card-p-${a.date}.png` });
    } else if (a.kind === 'carousel') {
      const slides = [`<div style="font-size:30px;letter-spacing:6px;text-transform:uppercase;color:${p.mut};font-weight:700">${esc(KICK[a.theme])}</div><div style="font-size:120px;line-height:1.05;font-weight:900;margin-top:40px">${esc(a.hook)}</div><div style="font-size:54px;color:${p.acc};font-weight:800;margin-top:60px">Swipe →</div>`,
        ...a.slides.map((s) => statInner(p, KICK[a.theme], s.big, s.line, '')),
        `<div style="font-size:30px;letter-spacing:6px;text-transform:uppercase;color:${p.mut};font-weight:700">So what</div><div style="font-size:88px;line-height:1.1;font-weight:900;margin-top:36px;color:${p.acc}">${esc(a.take)}</div><div style="margin-top:70px;display:inline-block;padding:30px 54px;border-radius:28px;background:${p.acc};color:${p.btnfg};font-size:58px;font-weight:900">datalatte.pro</div>`];
      for (const [i, inner] of slides.entries()) {
        const foot = i === 0 ? '' : i === slides.length - 1 ? '' : 'Source: ' + a.slides[i - 1].src;
        await pg.setContent(slideHtml(p, inner, foot)); await pg.screenshot({ path: `out/car-p-${a.date}-${i + 1}.png` });
      }
      fs.writeFileSync(`out/car-p-${a.date}.count`, String(slides.length));
    } else if (a.kind === 'reel') {
      const D = { ...parseBig(a.big), line: a.line };
      await rv.setContent(page(p, reelBody(p, a))); await rv.evaluate(`window.H=(${helpers.toString()})()`);
      const dir = `frames-${a.date}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
      for (let i = 0; i < 12 * FPS; i++) { await rv.evaluate(`(${reelRender.toString()})(${i / FPS}, window.H, ${JSON.stringify(D)})`); await rv.screenshot({ path: `${dir}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 86 }); }
      const m = MUSIC[a.theme] || MUSIC.coffee; const sid = String(100 + idx);
      fs.writeFileSync(`cues${sid}.json`, JSON.stringify({ dur: 12, music: { ...m, chords: CH[m.wave === 'pulse' || m.wave === 'bass' ? 1 : 0] }, cues: [[0.5, 'whoosh'], [1.1, 'thump'], [1.15, 'hit'], ...Array.from({ length: 10 }, (_, i) => [1.2 + i * 0.12, 'tick']), [2.6, 'pop'], [6.0, 'whoosh'], [6.4, 'pop'], [9.3, 'chime'], [9.45, 'chime']] }));
      execFileSync('python3', ['audio.py', sid]);
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', `${dir}/f%04d.jpg`, '-i', `mix${sid}.wav`, '-t', '12', '-af', 'afade=t=out:st=10.7:d=1.3', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', `out/reel-p-${a.date}.mp4`]);
      fs.rmSync(dir, { recursive: true, force: true });
    }
    console.log('done', a.date, a.kind);
  }
  await b.close();
})();
