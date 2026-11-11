import sys, json, wave, subprocess, numpy as np
sid=sys.argv[1]; cfg=json.load(open(f'cues{sid}.json')); sr=44100; dur=cfg['dur']+0.5; n=int(sr*dur); rng=np.random.default_rng(int(sid))
mu=cfg['music']; beat=60/mu['bpm']; bar=beat*4
def place(buf,sig,start,amp=1.0):
    i=int(start*sr); L=min(len(sig),n-i)
    if L>0 and i>=0: buf[i:i+L]+=amp*sig[:L]
def voice(f,L,kind):
    tt=np.arange(int(L*sr))/sr
    if kind=='soft': w=sum(np.sin(2*np.pi*f*k*tt)/k**1.6 for k in (1,2,3,4)); env=np.exp(-tt*3.2)*(1-np.exp(-tt*200))
    elif kind=='bright': w=sum(np.sin(2*np.pi*f*k*tt)/k**1.2 for k in (1,2,3,4,5)); env=np.exp(-tt*4.5)*(1-np.exp(-tt*300))
    elif kind=='marimba': w=np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*f*4*tt)*np.exp(-tt*25); env=np.exp(-tt*9)*(1-np.exp(-tt*400))
    elif kind=='bass': w=np.sign(np.sin(2*np.pi*f*tt))*.4+np.sin(2*np.pi*f*tt); env=np.exp(-tt*6)*(1-np.exp(-tt*300))
    else: w=np.sign(np.sin(2*np.pi*f*tt))*.35+np.sin(2*np.pi*f*tt)*.7; env=np.exp(-tt*5)*(1-np.exp(-tt*300))
    return w*env
def pad(f,L):
    tt=np.arange(int(L*sr))/sr; env=np.minimum(1,tt/0.8)*np.minimum(1,(L-tt)/1.2); return sum(np.sin(2*np.pi*f*k*tt)/k**1.6 for k in (1,2,3))*env
music=np.zeros(n); b=0
while b*bar<dur:
    root,*arp=mu['chords'][b%4][0],*mu['chords'][b%4]
    chord=mu['chords'][b%4]; s=b*bar
    place(music,pad(chord[0]/2 if chord[0]>150 else chord[0],bar+0.6),s,0.12)
    for k in range(8 if mu['wave']!='marimba' else 8):
        f=chord[k%4]*(2 if k%4==3 else 1)
        place(music,voice(f,1.0,mu['wave']),s+k*beat/2,0.07 if mu['wave']!='bass' else 0.08)
    if mu['kick']:
        for k in range(4):
            tt=np.arange(int(.3*sr))/sr; kick=np.sin(2*np.pi*np.cumsum(120*np.exp(-tt*25)+45)/sr)*np.exp(-tt*10); place(music,kick,s+k*beat,0.5)
        for k in range(8):
            tt=np.arange(int(.05*sr))/sr; hat=rng.standard_normal(len(tt))*np.exp(-tt*90); place(music,hat,s+k*beat/2+beat/4,0.06)
    b+=1
t=np.arange(n)/sr; music*=np.minimum(1,t/0.8)*np.minimum(1,(dur-t)/1.5)
music/=np.max(np.abs(music))*1.15
sfx=np.zeros(n)
def thump(): tt=np.arange(int(.5*sr))/sr; return np.sin(2*np.pi*np.cumsum(140*np.exp(-tt*9)+45)/sr)*np.exp(-tt*7)
def burst(): tt=np.arange(int(.25*sr))/sr; return rng.standard_normal(len(tt))*np.exp(-tt*18)*.35
def tick(): tt=np.arange(int(.03*sr))/sr; return np.sin(2*np.pi*2200*tt)*np.exp(-tt*140)*.5
def pop(): f=700; tt=np.arange(int(.18*sr))/sr; return np.sin(2*np.pi*(f+f*1.5*np.exp(-tt*30))*tt)*np.exp(-tt*22)*.8
def whoosh(): d=.5; tt=np.arange(int(d*sr))/sr; x=np.convolve(rng.standard_normal(len(tt)),np.ones(60)/60,'same'); return x*np.sin(np.pi*tt/d)**2*1.6
def chime(): tt=np.arange(int(.9*sr))/sr; return (np.sin(2*np.pi*1320*tt)+.4*np.sin(2*np.pi*2640*tt))*np.exp(-tt*4)*.35
for tm,kind in cfg['cues']:
    if kind=='hit': place(sfx,burst(),tm,.9)
    else: place(sfx,{'thump':thump,'tick':tick,'pop':pop,'whoosh':whoosh,'chime':chime}[kind](),tm,{'thump':1.0,'tick':.6,'pop':.6,'whoosh':.55,'chime':.8}[kind])
sfx/=max(1e-6,np.max(np.abs(sfx)))*1.05
mix=music*0.55+sfx*0.9; mix/=max(1,np.max(np.abs(mix)))*1.02
with wave.open(f'raw{sid}.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((mix*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i',f'raw{sid}.wav','-af','aecho=0.8:0.5:60|120:0.2|0.12,lowpass=f=6000,loudnorm=I=-18:TP=-2',f'mix{sid}.wav'],check=True)
