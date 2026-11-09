import numpy as np, wave
sr=44100; dur=15.5; n=int(sr*dur); t=np.arange(n)/sr
def note(f, start, length, amp=0.2, kind='pluck'):
    m=np.zeros(n); i0=int(start*sr); L=int(length*sr); tt=np.arange(L)/sr
    w=sum(np.sin(2*np.pi*f*k*tt)/k**1.6 for k in (1,2,3,4))
    if kind=='pluck': env=np.exp(-tt*3.2)*(1-np.exp(-tt*200))
    else: env=np.minimum(1,tt/0.8)*np.minimum(1,(length-tt)/1.2)
    seg=amp*w*env; m[i0:i0+L]=seg[:max(0,min(L,n-i0))]; return m
# warm progression (~92 bpm, 8th arps): Am7 | Fmaj7 | Cmaj7 | G6
beat=60/92; bar=beat*4
chords=[(220.0,[220.0,261.63,329.63,392.0]),(174.61,[174.61,220.0,261.63,329.63]),(130.81,[261.63,329.63,392.0,493.88]),(196.0,[196.0,246.94,293.66,329.63])]
out=np.zeros(n)
for b in range(4):
    root,arp=chords[b%4]; s=b*bar
    out+=note(root/2, s, bar+0.6, 0.16, 'pad')
    for k in range(8):
        out+=note(arp[k%4]*(2 if k%4==3 else 1), s+k*beat/2, 1.2, 0.07)
    # repeat tail beyond 4 bars
for b in range(4,int(dur/bar)+1):
    root,arp=chords[b%4]; s=b*bar
    out+=note(root/2, s, bar+0.6, 0.16, 'pad')
    for k in range(8): out+=note(arp[k%4]*(2 if k%4==3 else 1), s+k*beat/2, 1.2, 0.07)
fade=np.minimum(1,t/1.0)*np.minimum(1,(dur-t)/1.5)
out=out*fade; out/=np.max(np.abs(out))*1.15
d=(out*32767).astype(np.int16)
with wave.open('music.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(d.tobytes())
