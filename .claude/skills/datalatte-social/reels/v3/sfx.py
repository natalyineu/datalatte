import numpy as np, wave
sr=44100; dur=15.5; n=int(sr*dur)
rng=np.random.default_rng(7)
def ease(x): x=min(1,max(0,x)); return 1-(1-x)**3
def seg(t,a,b): return min(1,max(0,(t-a)/(b-a)))
m=np.zeros(n)
def add(sig,start,amp=1.0):
    i=int(start*sr); L=min(len(sig),n-i)
    if L>0: m[i:i+L]+=amp*sig[:L]
def thump():
    t=np.arange(int(.5*sr))/sr; f=140*np.exp(-t*9)+45
    return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*7)
def noise_burst(d=.25):
    t=np.arange(int(d*sr))/sr; x=rng.standard_normal(len(t))*np.exp(-t*18); return x*0.35
def tick():
    t=np.arange(int(.03*sr))/sr; return np.sin(2*np.pi*2200*t)*np.exp(-t*140)*0.5
def pop(f=660):
    t=np.arange(int(.18*sr))/sr; return np.sin(2*np.pi*(f+f*1.5*np.exp(-t*30))*t)*np.exp(-t*22)*0.8
def whoosh(d=.5):
    t=np.arange(int(d*sr))/sr; x=rng.standard_normal(len(t)); 
    k=np.convolve(x,np.ones(60)/60,'same'); env=np.sin(np.pi*t/d)**2; return k*env*1.6
def chime(f=1320):
    t=np.arange(int(.9*sr))/sr; return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*2*t))*np.exp(-t*4)*0.35
# hook
add(whoosh(.35),0.55,0.5)
add(thump(),0.9,1.0); add(noise_burst(),0.9,0.9)
# count ticks 47%
last=0
for i in range(int(0.95*1000),int(2.25*1000),5):
    t=i/1000; v=round(47*ease(seg(t,0.95,2.25)))
    if v//3>last//3: add(tick(),t,0.6)
    last=v
add(pop(520),2.3,0.5)
add(whoosh(.5),4.35,0.6)
for k in range(3): add(pop(700+k*120),5.9+k*0.35,0.5)   # reviews counter
add(chime(1568),7.2,0.7)
add(whoosh(.5),8.15,0.6)
for k in range(3): add(pop(600+k*140),8.9+k*0.7,0.8)
add(whoosh(.5),11.95,0.6)
add(chime(1320),12.4,0.8); add(chime(1760),12.55,0.6)
m/=max(1e-6,np.max(np.abs(m)))*1.05
with wave.open('sfx.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((m*32767).astype(np.int16).tobytes())
