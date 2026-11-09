const { chromium } = require('playwright');
const { execFileSync } = require('child_process'); const fs = require('fs');
const FPS = 30, DUR = 15, N = FPS * DUR;
// Safe zone (1080x1920): x 80..920, y 250..1500
const dots = Array.from({ length: 100 }, (_, i) => `<i class="dot" id="d${i}"></i>`).join('');
let qr = ''; { let s = 12345; const r = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let y = 0; y < 13; y++) for (let x = 0; x < 13; x++) {
    const finder = (x < 4 && y < 4) || (x > 8 && y < 4) || (x < 4 && y > 8);
    const on = finder ? !((x % 12 === 1 || x % 12 === 2) && 0) && (([0,3].includes(x%9)||[0,3].includes(y%9)) || (x%9===1||x%9===2)&&(y%9===1||y%9===2)) : r() > 0.5;
    qr += `<i class="q" style="background:${on ? '#2c1a0e' : 'transparent'}"></i>`; } }
const html = `<html><body style="margin:0;width:1080px;height:1920px;background:radial-gradient(1200px 1400px at 30% 30%,#4a2c17,#2c1a0e 60%,#1f1209);font-family:Inter,Helvetica,Arial,sans-serif;position:relative;overflow:hidden;color:#f5e6d3">
<div id="world" style="position:absolute;inset:0">
<div id="flash" style="position:absolute;inset:0;background:#f5e6d3;opacity:0;z-index:9"></div>
<div id="safe" style="position:absolute;left:80px;top:250px;width:840px;height:1250px">
  <div id="logo" style="position:absolute;left:0;top:0;font-size:46px;font-weight:800;color:#d4a574">☕ datalatte.pro</div>
  <div style="position:absolute;left:0;top:76px;width:840px;height:6px;border-radius:3px;background:rgba(255,255,255,.12)"><div id="prog" style="height:100%;width:0;background:#d4a574;border-radius:3px"></div></div>

  <div id="h" style="position:absolute;left:0;top:420px;width:840px;font-size:140px;line-height:1.05;font-weight:900">Under<br><span style="color:#d4a574">20 reviews?</span></div>

  <div id="a" style="position:absolute;left:0;top:440px;width:840px">
    <div id="kick" style="font-size:30px;letter-spacing:6px;text-transform:uppercase;color:#c8956c;font-weight:700">Google reviews</div>
    <div id="big" style="font-size:330px;line-height:1;font-weight:900;color:#d4a574;letter-spacing:-8px;margin-top:6px;transform-origin:left center">0%</div>
    <div id="grid" style="display:grid;grid-template-columns:repeat(20,28px);gap:14px;margin-top:20px">${dots}</div>
    <div id="sub" style="font-size:76px;line-height:1.12;font-weight:800;margin-top:44px"></div>
    <div id="src" style="font-size:28px;color:#c8956c;margin-top:28px">BrightLocal 2026</div>
  </div>

  <div id="b" style="position:absolute;left:0;top:440px;width:840px">
    <div style="font-size:30px;letter-spacing:6px;text-transform:uppercase;color:#c8956c;font-weight:700">The cheapest fix</div>
    <div style="font-size:110px;line-height:1.06;font-weight:900;margin-top:20px">A QR code<br><span style="color:#d4a574">at the till.</span></div>
    <div style="display:flex;gap:56px;align-items:center;margin-top:60px">
      <div style="position:relative;flex:none;width:330px;height:330px;padding:28px;background:#f5e6d3;border-radius:28px;box-sizing:border-box">
        <div style="display:grid;grid-template-columns:repeat(13,1fr);width:100%;height:100%">${qr}</div>
        <div id="scan" style="position:absolute;left:8px;right:8px;top:0;height:10px;border-radius:5px;background:#d4a574;box-shadow:0 0 28px 8px rgba(212,165,116,.8)"></div>
      </div>
      <div style="flex:1">
        <div style="font-size:34px;color:#e8c9a8;font-weight:700">Reviews</div>
        <div id="cnt" style="font-size:150px;font-weight:900;line-height:1;color:#d4a574">8</div>
        <div id="stars" style="font-size:54px;letter-spacing:6px;color:#f0c58f;margin-top:6px;white-space:nowrap">☆☆☆☆☆</div>
      </div>
    </div>
    <div style="margin-top:56px;height:40px;border-radius:20px;background:rgba(255,255,255,.1);overflow:hidden"><div id="bar" style="height:100%;width:0;background:linear-gradient(90deg,#c8956c,#f0c58f);border-radius:20px"></div></div>
  </div>

  <div id="c" style="position:absolute;left:0;top:440px;width:840px">
    <div style="font-size:30px;letter-spacing:6px;text-transform:uppercase;color:#c8956c;font-weight:700">3 steps</div>
    <div id="s1" class="step"><b>1</b><span>QR code<br>at the till</span></div>
    <div id="s2" class="step"><b>2</b><span>One short,<br>friendly ask</span></div>
    <div id="s3" class="step"><b>3</b><span>Link straight to<br>your review page</span></div>
    <div id="nb" style="margin-top:60px;font-size:32px;color:#c8956c;line-height:1.3">Ask, don't pay: Google treats paid reviews as fake.</div>
  </div>

  <div id="d" style="position:absolute;left:0;top:440px;width:840px">
    <div style="font-size:84px;font-weight:900;line-height:1.08">Get the<br>ask script<br><span style="color:#d4a574">+ link setup</span></div>
    <div id="btn" style="margin-top:56px;display:inline-block;padding:30px 54px;border-radius:28px;background:#d4a574;color:#2c1a0e;font-size:64px;font-weight:900">datalatte.pro</div>
    <div style="margin-top:30px;font-size:32px;color:#c8956c">Local marketing, done right.</div>
  </div>
</div>
</div>
<style>.dot{display:block;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.14)}.q{display:block}.step{display:flex;align-items:center;gap:36px;margin-top:62px;font-size:66px;font-weight:800;line-height:1.1}.step b{flex:none;width:112px;height:112px;border-radius:50%;background:#d4a574;color:#2c1a0e;display:grid;place-items:center;font-size:62px}</style>
</body></html>`;
const render = (t) => {
  const $ = id => document.getElementById(id);
  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const back = x => { x = Math.min(1, Math.max(0, x)); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const vis = (el, o, y = 0, s = 1) => { el.style.opacity = o; el.style.transform = `translateY(${y}px) scale(${s})`; };
  $('prog').style.width = (t / 15 * 100) + '%';
  // screen shake on the 47% slam
  const sh = Math.max(0, 1 - seg(t, 0.9, 1.25)) * 14; $('world').style.transform = `translate(${Math.sin(t * 90) * sh}px,${Math.cos(t * 70) * sh}px)`;
  $('flash').style.opacity = Math.max(0, 0.55 * (1 - seg(t, 0.9, 1.1))) * (t >= 0.9 ? 1 : 0);
  // hook 0-0.9
  const hIn = back(seg(t, 0, 0.3)), hOut = 1 - seg(t, 0.78, 0.9);
  vis($('h'), hIn * hOut, (1 - hIn) * 60, 0.9 + 0.1 * hIn);
  // scene A 0.9-4.6
  const aOn = t >= 0.9 ? 1 : 0, aOut = 1 - ease(seg(t, 4.25, 4.65));
  vis($('a'), aOn * aOut, (1 - aOut) * -40);
  $('kick').style.opacity = ease(seg(t, 0.9, 1.1));
  const vv = 47 * ease(seg(t, 0.95, 2.25)); const v = Math.round(vv);
  $('big').textContent = v + '%'; const slam = 1 + 0.55 * Math.max(0, 1 - seg(t, 0.9, 1.2)); $('big').style.transform = `scale(${slam})`;
  for (let i = 0; i < 100; i++) { const el = $('d' + i); if (i < v) { el.style.background = '#d4a574'; el.style.transform = 'scale(1.0)'; } else { el.style.background = 'rgba(255,255,255,.14)'; el.style.transform = 'scale(1)'; } }
  const words = 'of consumers skip a business with fewer than 20 reviews'.split(' ');
  $('sub').innerHTML = words.map((w, i) => { const k = ease(seg(t, 2.1 + i * 0.12, 2.3 + i * 0.12)); return `<span style="opacity:${k};display:inline-block;margin-right:16px;transform:translateY(${(1 - k) * 24}px)${/20|fewer|than/.test(w) ? ';color:#d4a574' : ''}">${w}</span>`; }).join('');
  $('src').style.opacity = ease(seg(t, 3.7, 4.0));
  // scene B 4.6-8.4
  const bIn = ease(seg(t, 4.65, 5.05)), bOut = 1 - ease(seg(t, 8.0, 8.4));
  vis($('b'), bIn * bOut, (1 - bIn) * 60);
  const sc = seg(t, 5.4, 6.6); $('scan').style.top = (sc <= 0 || sc >= 1 ? -20 : (Math.abs(((sc * 2) % 2) - 1) * 285)) + 'px'; $('scan').style.opacity = (sc > 0 && sc < 1) ? 1 : 0;
  const f = ease(seg(t, 5.9, 7.4)); const cnt = Math.round(8 + 12 * f); $('cnt').textContent = cnt; $('bar').style.width = (cnt / 20 * 100) + '%';
  const st = Math.min(5, Math.floor(seg(t, 6.2, 7.6) * 5.99)); $('stars').textContent = '★'.repeat(st) + '☆'.repeat(5 - st);
  $('cnt').style.transform = `scale(${1 + 0.12 * Math.max(0, 1 - ((t * 6) % 1)) * (f > 0 && f < 1 ? 1 : 0)})`; $('cnt').style.transformOrigin = 'left center';
  // scene C 8.4-12.2
  const cIn = ease(seg(t, 8.45, 8.85)), cOut = 1 - ease(seg(t, 11.8, 12.2));
  vis($('c'), cIn * cOut, (1 - cIn) * 60);
  ['s1', 's2', 's3'].forEach((id, i) => { const k = back(seg(t, 8.9 + i * 0.7, 9.25 + i * 0.7)); const e = $(id); e.style.opacity = Math.min(1, k * 1.5); e.style.transform = `translateX(${(1 - k) * 90}px) scale(${0.92 + 0.08 * k})`; });
  $('nb').style.opacity = ease(seg(t, 11.0, 11.4));
  // scene D 12.2-15
  const dIn = back(seg(t, 12.3, 12.8)); vis($('d'), Math.min(1, dIn * 1.5), (1 - dIn) * 70);
  $('btn').style.transform = `scale(${1 + 0.05 * Math.sin(Math.max(0, t - 13) * 7)})`;
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html); fs.rmSync('frames', { recursive: true, force: true }); fs.mkdirSync('frames', { recursive: true });
  const debug = process.argv[2] === 'debug';
  const keep = [10, 30, 45, 75, 150, 190, 215, 270, 300, 380, 430];
  for (let i = 0; i < N; i++) {
    await p.evaluate(`(${render.toString()})(${i / FPS})`);
    if (debug && keep.includes(i)) await p.screenshot({ path: `dbg${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 85 });
    if (!debug) await p.screenshot({ path: `frames/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 88 });
  }
  await b.close();
  if (!debug) execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', 'frames/f%04d.jpg', '-i', 'mix.wav', '-t', String(DUR), '-af', 'afade=t=out:st=13.7:d=1.3', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', 'reel-01-reviews-20-v3.mp4']);
})();
