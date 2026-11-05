const { chromium } = require('playwright');
const fs = require('fs'); const { execFileSync } = require('child_process');
const vids = JSON.parse(fs.readFileSync('videos.json','utf8'));
const only = process.argv.slice(2).map(Number);

const html = (v, stage) => `<html><body style="margin:0;width:1080px;height:1920px;background:#2c1a0e;font-family:Inter,Helvetica,Arial,sans-serif;position:relative;overflow:hidden">
<div style="position:absolute;left:92px;top:118px;font-size:42px;font-weight:700;color:#d4a574;display:flex;gap:16px;align-items:center"><span>☕</span><span>DataLatte</span></div>
<div style="position:absolute;left:92px;right:80px;top:720px;opacity:${stage>=1?1:0}">
  <div style="font-size:30px;letter-spacing:5px;text-transform:uppercase;color:#c8956c;font-weight:700;margin-bottom:34px">${v.kicker}</div>
  <div style="font-size:96px;line-height:1.1;font-weight:800;color:#f5e6d3;letter-spacing:-1.5px">${v.cream.join('<br>')}</div>
  <div style="opacity:${stage>=2?1:0};margin-top:44px;font-size:96px;line-height:1.1;font-weight:800;color:#d4a574;letter-spacing:-1.5px">${(v.accent||[]).join('<br>')}</div>
  ${v.sub?`<div style="opacity:${stage>=2?1:0};margin-top:40px;font-size:44px;line-height:1.3;font-weight:600;color:#e8c9a8">${v.sub.join('<br>')}</div>`:''}
</div>
<div style="position:absolute;left:92px;bottom:150px;opacity:${stage>=2&&v.source?1:0};font-size:30px;color:#c8956c">${v.source||''}</div>
<div style="position:absolute;left:92px;bottom:230px;opacity:${stage>=3?1:0}"><div style="font-size:64px;font-weight:800;color:#f5e6d3">datalatte.pro</div><div style="font-size:30px;color:#c8956c;margin-top:8px">Local marketing, done right.</div></div>
</body></html>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const v of vids) {
    if (only.length && !only.includes(v.n)) continue;
    const id = String(v.n).padStart(2,'0');
    for (let s = 0; s <= 3; s++) { await p.setContent(html(v, s)); await p.screenshot({ path: `s${id}_${s}.png` }); }
    const d = [1.2, 3.4, 3.8, 3.8], f = 0.4;
    const o1 = d[0]-f, o2 = o1+d[1]-f, o3 = o2+d[2]-f;
    const args = ['-y','-v','error'];
    for (let s = 0; s <= 3; s++) args.push('-loop','1','-t',String(d[s]),'-framerate','30','-i',`s${id}_${s}.png`);
    args.push('-filter_complex',
      `[0][1]xfade=transition=fade:duration=${f}:offset=${o1}[a];[a][2]xfade=transition=fade:duration=${f}:offset=${o2}[b];[b][3]xfade=transition=fade:duration=${f}:offset=${o3},format=yuv420p[v]`,
      '-map','[v]','-r','30','-c:v','libx264','-preset','medium','-crf','20','-movflags','+faststart',`reel-${id}-${v.slug}.mp4`);
    execFileSync('ffmpeg', args); console.log('done', id);
  }
  await b.close();
})();
