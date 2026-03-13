import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const NAME    = "Subhadeep Bera";
const ROLES   = ["Full Stack Developer", "MERN Stack Engineer"];
const NAV     = ["about", "skills", "projects", "dsa", "contact"];
const MQ_ITEMS = [
  "React.js","Node.js","MongoDB","Express","DSA","Tailwind CSS",
  "TypeScript","Git","REST APIs","Gemini API","Three.js","Docker","Java","Vite",
];
const PROJECTS = [
  {
    id:"01", title:"AI Code Review", tag:"Full Stack Developer Tool",
    desc:"Intelligent code analysis using Gemini API. Supports 20+ languages with real-time Prism.js syntax highlighting, contextual feedback and complexity scoring. Production-grade architecture with Node.js backend and React frontend.",
    tech:["React","Node.js","Express","Gemini API","Prism.js"], color:"#7c5cfc", emoji:"🤖",
    tags:["Full Stack"], gh:"https://github.com/subh4deep/AI-CODE-REVIEW", live:"https://ai-code-review-frontend-rx94.onrender.com/",
  },
  {
    id:"02", title:"Cloud File Uploader", tag:"Cloud Storage Platform",
    desc:"Production image hosting with ImageKit CDN, social feed, real-time uploads, MongoDB metadata persistence and media transformation pipeline. Scalable MERN architecture with optimised API design.",
    tech:["React","Node.js","MongoDB","Express","ImageKit"], color:"#00d4aa", emoji:"☁️",
    tags:["MERN","Cloud"], gh:"https://github.com/subh4deep/Cloud-file-uploader",
  },
  {
    id:"03", title:"QuickBite", tag:"Food Delivery Platform",
    desc:"End-to-end food delivery platform — dynamic menus, cart management, Stripe payment integration, real-time order tracking and a full admin dashboard. Full MERN stack with production Stripe checkout.",
    tech:["React","Vite","Node.js","MongoDB","Stripe"], color:"#ff6b47", emoji:"🍔",
    tags:["MERN","Payments"], gh:"https://github.com/subh4deep/Food-delivery",live:"https://frontend-delta-sable-4vdhbjamo6.vercel.app/",
  },
];
const SKILLS = {
  lang:{ label:"Languages", c:"#7c5cfc", items:[{n:"JavaScript",v:88},{n:"HTML/CSS",v:94},{n:"Java",v:90},{n:"TypeScript",v:65},{n:"Python",v:50}] },
  fe:  { label:"Frontend",  c:"#00d4aa", items:[{n:"React.js",v:87},{n:"Tailwind CSS",v:91},{n:"GSAP",v:74},{n:"Three.js",v:62}] },
  be:  { label:"Backend",   c:"#ff6b47", items:[{n:"Node.js",v:84},{n:"Express.js",v:81},{n:"MongoDB",v:79},{n:"REST APIs",v:86}] },
  cs:  { label:"CS Core",   c:"#f59e0b", items:[{n:"Data Structures",v:83},{n:"Algorithms",v:81},{n:"OOP",v:88},{n:"DBMS",v:75}] },
};
const DSA_TOPICS = ["Arrays","Linked Lists","Stacks","Queues","Trees","Graphs","Dynamic Programming","Binary Search","Sorting","Hashing","Recursion","Greedy","Backtracking","Tries"];
const FILTERS    = ["all","full stack","mern","payments","cloud"];

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected via <style>)
   Font strategy:
     Display  → Clash Display  (headings only: h1 name, h2 section titles, h3 card titles)
     Body     → Plus Jakarta Sans  (all body copy, nav, labels, buttons, tags)
     Mono     → Geist Mono  (code-like labels, badge text, counters, tech stacks)
───────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700,800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── THEME TOKENS ── */
:root {
  --acc:       #7c5cfc;
  --acc-glow:  rgba(124,92,252,.42);
  --acc2:      #00d4aa;
  --acc2-glow: rgba(0,212,170,.42);
  --bg:        #f8f7ff;
  --tx:        #0e0e1a;
  --tx2:       #56567a;
  --tx3:       #9898b8;
  --card-bg:   rgba(255,255,255,.80);
  --card-sh:   0 4px 28px rgba(80,50,200,.06);
  --bd:        rgba(120,100,220,.10);
  --bd-h:      rgba(120,100,220,.22);
  --btn-ghost: rgba(255,255,255,.74);
  --bar-bg:    rgba(100,80,200,.07);
  --name-grad: linear-gradient(135deg,#0e0e1a 0%,#3a1a9e 55%,#7c5cfc 100%);
  --cell0:#eeeeff; --cell1:#c3b9ff; --cell2:#9b8ff0; --cell3:#7c5cfc;
  --f-display: 'Clash Display', sans-serif;
  --f-body:    'Plus Jakarta Sans', sans-serif;
  --f-mono:    'Geist Mono', monospace;
}
html:not(.light) {
  --bg:        #07070f;
  --tx:        #edeef8;
  --tx2:       #8e8eb0;
  --tx3:       #565678;
  --card-bg:   rgba(13,11,30,.88);
  --card-sh:   0 4px 36px rgba(0,0,0,.55);
  --bd:        rgba(124,92,252,.12);
  --bd-h:      rgba(124,92,252,.26);
  --btn-ghost: rgba(124,92,252,.07);
  --bar-bg:    rgba(124,92,252,.09);
  --name-grad: linear-gradient(135deg,#fff 0%,#c4b5fd 40%,#7c5cfc 100%);
  --cell0:#0c0a1e; --cell1:#2b1d5c; --cell2:#4e36a6; --cell3:#7c5cfc;
}

::selection { background: rgba(124,92,252,.22); color: inherit; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: linear-gradient(#7c5cfc,#00d4aa); border-radius: 2px; }

body { font-family: var(--f-body); }

input, textarea {
  width: 100%;
  padding: 11px 15px;
  border-radius: 11px;
  border: 1px solid var(--bd);
  background: var(--btn-ghost);
  color: var(--tx);
  font-family: var(--f-body);
  font-size: .88rem;
  font-weight: 400;
  outline: none;
  resize: vertical;
  backdrop-filter: blur(12px);
  transition: border-color .22s, box-shadow .22s;
}
input:focus, textarea:focus {
  border-color: rgba(124,92,252,.48);
  box-shadow: 0 0 0 3px rgba(124,92,252,.09);
}
input::placeholder, textarea::placeholder { color: var(--tx3); }

/* ── KEYFRAMES ── */
@keyframes shimmer      { 0%{background-position:200% 50%} 100%{background-position:-200% 50%} }
@keyframes floatY       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes floatY2      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes pulseScale   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
@keyframes morph        { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:30% 60% 40% 70%/60% 40% 70% 30%} }
@keyframes orb1         { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-48px) scale(1.05)} }
@keyframes orb2         { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-36px,56px)} }
@keyframes orb3         { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-32px) scale(1.07)} }
@keyframes gridPulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
@keyframes scaleInX     { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes spin         { to{transform:rotate(360deg)} }
@keyframes rotCW        { to{transform:translate(-50%,-50%) rotate(360deg)} }
@keyframes rotCCW       { to{transform:translate(-50%,-50%) rotate(-360deg)} }
@keyframes borderRun    { 0%{background-position:0} 100%{background-position:200%} }
@keyframes navSlide     { from{transform:translateY(-100%);opacity:0} to{transform:none;opacity:1} }
@keyframes glowPulse    { 0%,100%{box-shadow:0 0 16px rgba(124,92,252,.3)} 50%{box-shadow:0 0 32px rgba(124,92,252,.65),0 0 52px rgba(0,212,170,.22)} }
@keyframes flicker      { 0%,92%,96%,100%{opacity:1} 93%{opacity:.12} 95%{opacity:.5} 97%{opacity:.18} }
/* loader */
@keyframes ldrBracket   { 0%{opacity:0;transform:translateX(-12px)} 65%{opacity:1;transform:none} 100%{opacity:1} }
@keyframes ldrName      { 0%{opacity:0;filter:blur(6px)} 100%{opacity:1;filter:blur(0)} }
@keyframes ldrFadeUp    { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:none} }
/* hero name reveal */
@keyframes nameReveal   { 0%{opacity:0;transform:translateY(18px)} 100%{opacity:1;transform:none} }
/* typer */
@keyframes typerIn      { 0%{opacity:0;transform:translateY(5px)} 100%{opacity:1;transform:none} }

/* ── UTILITY CLASSES ── */
.shimmer-text {
  background: linear-gradient(90deg,var(--acc),#a78bfa,var(--acc2),var(--acc));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4.5s linear infinite;
}
.shimmer-line {
  background: linear-gradient(90deg,transparent,#7c5cfc,#00d4aa,#ff6b47,transparent);
  background-size: 300% 100%;
  animation: shimmer 4.5s linear infinite;
}
.float1  { animation: floatY  4s ease-in-out infinite; }
.float2  { animation: floatY2 5s ease-in-out infinite; }
.gpulse  { animation: glowPulse 3.2s ease-in-out infinite; }
.flicker { animation: flicker 9s linear infinite; }
.rotCW   { animation: rotCW  30s linear infinite; }
.rotCCW  { animation: rotCCW 24s linear infinite; }
.navIn   { animation: navSlide .65s cubic-bezier(.22,1,.36,1) forwards; }
`;

/* ─────────────────────────────────────────────
   AURORA  (WebGL background)
───────────────────────────────────────────── */
function Aurora({ dark }) {
  const ref = useRef(null), mRef = useRef({ x:0, y:0 });
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const gl = c.getContext("webgl"); if (!gl) return;
    const resize = () => { c.width=innerWidth; c.height=innerHeight; gl.viewport(0,0,c.width,c.height); };
    resize(); window.addEventListener("resize", resize);
    const mv = e => { mRef.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", mv);
    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
    const fs = `precision highp float;
uniform float t,dark;uniform vec2 res,mouse;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<7;i++){v+=a*n(p);p*=2.1;a*=.48;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*res)/min(res.x,res.y);
  vec2 m=(mouse/res-.5)*2.;float tm=t*.08;
  vec2 q=vec2(fbm(uv+tm),fbm(uv+vec2(1.4,.8)+tm*.75));
  vec2 r=vec2(fbm(uv+2.*q+vec2(1.7,9.2)+tm*.5+m*.26),fbm(uv+2.*q+vec2(8.3,2.8)+tm*.44+m*.18));
  float f=fbm(uv+3.*r);
  vec3 dk=mix(vec3(.016,.009,.068),vec3(.068,.014,.2),clamp(f,0.,1.));
  dk=mix(dk,vec3(.028,.085,.26),clamp(length(q),0.,1.));
  dk=mix(dk,vec3(.012,.14,.18),clamp(length(r)*.85,0.,1.));
  dk=mix(dk,vec3(.13,.025,.34),clamp(r.x*r.x,0.,1.));
  dk+=vec3(.035,.22,.14)*clamp(fbm(uv*2.2+t*.03)*.5,0.,.35);
  dk+=vec3(.16,.06,.38)*clamp(f*f*f*.8,0.,.48);
  vec3 lk=mix(vec3(.95,.92,.99),vec3(.86,.82,.98),clamp(f,0.,1.));
  lk=mix(lk,vec3(.79,.87,.99),clamp(length(q),0.,1.));
  lk=mix(lk,vec3(.83,.97,.94),clamp(length(r)*.74,0.,1.));
  lk+=vec3(.07,.04,.18)*clamp(f*f*.22,0.,.13);
  vec3 col=mix(lk,dk,dark);col=pow(col,vec3(.88));
  float vign=dark>.5?1.-smoothstep(.34,1.44,length(uv)):1.-smoothstep(.5,1.64,length(uv))*.2;
  gl_FragColor=vec4(col*vign,1.);}`;
    const mk = (tp,src) => { const s=gl.createShader(tp); gl.shaderSource(s,src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog,mk(gl.VERTEX_SHADER,vs)); gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(prog,"p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const uT=gl.getUniformLocation(prog,"t"),uR=gl.getUniformLocation(prog,"res"),uM=gl.getUniformLocation(prog,"mouse"),uD=gl.getUniformLocation(prog,"dark");
    const s0=Date.now(); let raf;
    const draw=()=>{ raf=requestAnimationFrame(draw); gl.uniform1f(uT,(Date.now()-s0)/1000); gl.uniform2f(uR,c.width,c.height); gl.uniform2f(uM,mRef.current.x,c.height-mRef.current.y); gl.uniform1f(uD,dark?1:0); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",mv); };
  }, [dark]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

/* ─────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────── */
function Particles({ dark }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width=innerWidth; c.height=innerHeight; };
    resize(); window.addEventListener("resize",resize);
    const pts = Array.from({length:70}, () => ({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28,
      r:Math.random()*1.8+.4,
      col:["#7c5cfc","#00d4aa","#ff6b47","#f59e0b"][Math.floor(Math.random()*4)],
      a:Math.random()*.6+.2, phase:Math.random()*Math.PI*2,
    }));
    let mx=innerWidth/2, my=innerHeight/2, t=0;
    const onM = e => { mx=e.clientX; my=e.clientY; };
    window.addEventListener("mousemove",onM);
    let raf;
    const draw = () => {
      raf=requestAnimationFrame(draw); t+=.01;
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<-20)p.x=c.width+20; if(p.x>c.width+20)p.x=-20;
        if(p.y<-20)p.y=c.height+20; if(p.y>c.height+20)p.y=-20;
        const dx=p.x-mx, dy=p.y-my, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){ const f=.5-dist/260; p.vx+=dx/dist*f*.06; p.vy+=dy/dist*f*.06; }
        p.vx*=.994; p.vy*=.994;
        const pulse=Math.sin(t+p.phase)*.3+.7;
        const base=dark?.62:.30;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*pulse,0,Math.PI*2);
        ctx.fillStyle=p.col+Math.floor(p.a*base*255).toString(16).padStart(2,"0");
        if(dark){ ctx.shadowColor=p.col; ctx.shadowBlur=p.r*5; }
        ctx.fill(); ctx.shadowBlur=0;
        pts.forEach(p2 => {
          const d2=Math.hypot(p.x-p2.x,p.y-p2.y);
          if(d2<100){
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y);
            const a2=(.17*(1-d2/100))*(dark?.82:.32);
            ctx.strokeStyle=p.col+Math.floor(a2*255).toString(16).padStart(2,"0");
            ctx.lineWidth=.5; ctx.stroke();
          }
        });
      });
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onM); };
  }, [dark]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none"}}/>;
}

/* ─────────────────────────────────────────────
   ORBS
───────────────────────────────────────────── */
function Orbs({ dark }) {
  const orbs = [
    {w:700,c:dark?"#7c5cfc":"#9070f0",top:"-18%",right:"-12%",anim:"orb1 24s ease-in-out infinite",op:dark?.09:.048},
    {w:580,c:dark?"#00d4aa":"#00b895",bottom:"-12%",left:"-10%",anim:"orb2 28s ease-in-out infinite",op:dark?.07:.038},
    {w:400,c:dark?"#ff6b47":"#e85535",top:"42%",left:"60%",anim:"orb3 20s ease-in-out infinite",op:dark?.055:.03},
    {w:250,c:"#f59e0b",top:"18%",left:"25%",anim:"orb2 16s ease-in-out infinite reverse",op:dark?.04:.02},
  ];
  return (
    <div style={{position:"fixed",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
      {orbs.map((o,i)=>(
        <div key={i} style={{position:"absolute",width:o.w,height:o.w,borderRadius:"50%",filter:"blur(70px)",opacity:o.op,background:`radial-gradient(circle,${o.c},transparent 70%)`,top:o.top,bottom:o.bottom,left:o.left,right:o.right,animation:o.anim}}/>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
function Cursor() {
  const dot=useRef(null), ring=useRef(null);
  const pos=useRef({x:0,y:0}), rp=useRef({x:0,y:0});
  const [big,setBig]=useState(false);
  useEffect(() => {
    if(innerWidth<768) return;
    const onM = e => { pos.current={x:e.clientX,y:e.clientY}; if(dot.current){dot.current.style.left=e.clientX+"px"; dot.current.style.top=e.clientY+"px";} };
    window.addEventListener("mousemove",onM);
    document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter",()=>setBig(true));
      el.addEventListener("mouseleave",()=>setBig(false));
    });
    let raf;
    const lerp=(a,b,n)=>a+(b-a)*n;
    const tick = () => {
      raf=requestAnimationFrame(tick);
      rp.current.x=lerp(rp.current.x,pos.current.x,.1);
      rp.current.y=lerp(rp.current.y,pos.current.y,.1);
      if(ring.current){ ring.current.style.left=rp.current.x+"px"; ring.current.style.top=rp.current.y+"px"; }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",onM); };
  },[]);
  return (
    <>
      <style>{`
        #_dot,#_ring{position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%)}
        #_dot{transition:width .18s,height .18s}
        #_ring{border-radius:50%;transition:width .28s cubic-bezier(.34,1.56,.64,1),height .28s cubic-bezier(.34,1.56,.64,1)}
        @media(max-width:768px){#_dot,#_ring{display:none}}
      `}</style>
      <div id="_dot" ref={dot} style={{width:big?0:8,height:big?0:8,borderRadius:"50%",background:"var(--acc)",boxShadow:"0 0 14px var(--acc)"}}/>
      <div id="_ring" ref={ring} style={{width:big?50:30,height:big?50:30,border:`1px solid ${big?"rgba(124,92,252,.52)":"rgba(124,92,252,.26)"}`,background:big?"rgba(124,92,252,.055)":"transparent"}}/>
    </>
  );
}

/* ─────────────────────────────────────────────
   FADE  (scroll-reveal wrapper)
───────────────────────────────────────────── */
function Fade({ children, delay=0, y=28, x=0, scale=false, style={} }) {
  const ref=useRef(null), [v,setV]=useState(false);
  useEffect(() => {
    const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting){setTimeout(()=>setV(true),delay); o.disconnect();} },{threshold:.06});
    if(ref.current) o.observe(ref.current);
    return ()=>o.disconnect();
  },[delay]);
  return (
    <div ref={ref} style={{
      opacity:v?1:0,
      transform:v?"none":`translateY(${y}px) translateX(${x}px)${scale?" scale(.95)":""}`,
      transition:`opacity .75s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CARD  (3-D tilt glass)
───────────────────────────────────────────── */
function Card({ children, style={}, accent="var(--acc)", int=1 }) {
  const ref=useRef(null), sh=useRef(null);
  const onM=useCallback(e=>{
    if(!ref.current)return;
    const r=ref.current.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
    ref.current.style.transform=`perspective(1100px) rotateX(${((y/r.height)-.5)*-10*int}deg) rotateY(${((x/r.width)-.5)*10*int}deg) translateZ(${12*int}px)`;
    ref.current.style.transition="transform .08s ease";
    if(sh.current) sh.current.style.background=`radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%,rgba(255,255,255,${.11*int}) 0%,transparent 55%)`;
  },[int]);
  const onL=useCallback(()=>{
    if(!ref.current)return;
    ref.current.style.transform="perspective(1100px) rotateX(0) rotateY(0) translateZ(0)";
    ref.current.style.transition="transform 1.2s cubic-bezier(.34,1.56,.64,1),box-shadow .5s,border-color .3s";
    if(sh.current) sh.current.style.background="none";
  },[]);
  return (
    <div ref={ref} onMouseMove={onM} onMouseLeave={onL}
      onMouseOver={e=>{e.currentTarget.style.borderColor=`${accent}2c`; e.currentTarget.style.boxShadow=`0 20px 52px rgba(0,0,0,.38),0 0 36px ${accent}10,inset 0 1px 0 rgba(255,255,255,.11)`;}}
      onMouseOut={e=>{e.currentTarget.style.borderColor="var(--bd)"; e.currentTarget.style.boxShadow="var(--card-sh)";}}
      style={{background:"var(--card-bg)",border:"1px solid var(--bd)",borderRadius:20,backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",position:"relative",overflow:"hidden",transformStyle:"preserve-3d",boxShadow:"var(--card-sh)",transition:"transform 1.2s cubic-bezier(.34,1.56,.64,1),box-shadow .5s,border-color .3s",...style}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent)",pointerEvents:"none"}}/>
      <div ref={sh} style={{position:"absolute",inset:0,borderRadius:20,pointerEvents:"none",transition:"background .12s"}}/>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BLOB
───────────────────────────────────────────── */
function Blob({ size=300, color="#7c5cfc", style={} }) {
  return (
    <div style={{width:size,height:size,background:`radial-gradient(circle at 38% 38%,${color}1c,${color}04 70%)`,border:`1px solid ${color}10`,position:"absolute",pointerEvents:"none",borderRadius:"60% 40% 70% 30%/50% 60% 40% 70%",animation:"morph 14s ease-in-out infinite",...style}}/>
  );
}

/* ─────────────────────────────────────────────
   BUTTON
───────────────────────────────────────────── */
function Btn({ children, variant="primary", onClick, href, style={}, sm=false }) {
  const ref=useRef(null), sh=useRef(null);
  const V = {
    primary:{ bg:"linear-gradient(135deg,#7c5cfc,#5b3fce,#4a28b4)", bd:"1px solid rgba(180,150,255,.36)", cl:"#fff",     gw:"rgba(124,92,252,.58)" },
    ghost:  { bg:"var(--btn-ghost)",                                  bd:"1px solid var(--bd-h)",           cl:"var(--tx)", gw:"rgba(200,200,255,.14)" },
    teal:   { bg:"linear-gradient(135deg,rgba(0,212,170,.15),rgba(0,180,140,.07))", bd:"1px solid rgba(0,212,170,.36)", cl:"#00d4aa", gw:"rgba(0,212,170,.38)" },
    amber:  { bg:"linear-gradient(135deg,rgba(245,158,11,.13),rgba(200,120,0,.06))", bd:"1px solid rgba(245,158,11,.34)", cl:"#f59e0b", gw:"rgba(245,158,11,.38)" },
  };
  const v = V[variant]||V.primary;
  const onM=useCallback(e=>{
    const el=ref.current; if(!el)return;
    const r=el.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
    el.style.transform=`perspective(380px) rotateX(${((y/r.height)-.5)*-15}deg) rotateY(${((x/r.width)-.5)*15}deg) translateZ(13px) scale(1.04)`;
    el.style.transition="transform .06s ease";
    if(sh.current) sh.current.style.background=`radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%,rgba(255,255,255,.26) 0%,transparent 60%)`;
  },[]);
  const onL=useCallback(()=>{
    const el=ref.current; if(!el)return;
    el.style.transform="perspective(380px) rotateX(0) rotateY(0) translateZ(0) scale(1)";
    el.style.transition="transform 1s cubic-bezier(.34,1.56,.64,1),box-shadow .4s";
    if(sh.current) sh.current.style.background="none";
  },[]);
  const inner = (
    <div ref={ref} onMouseMove={onM} onMouseLeave={onL}
      onMouseOver={e=>{ e.currentTarget.style.boxShadow=`0 0 32px ${v.gw},0 8px 22px rgba(0,0,0,.2)`; }}
      onMouseOut={e=>{ e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.16)"; }}
      onClick={onClick}
      style={{display:"inline-flex",alignItems:"center",gap:7,padding:sm?"8px 18px":"12px 26px",borderRadius:11,cursor:"pointer",
        fontFamily:"var(--f-body)",fontWeight:600,fontSize:sm?".8rem":".875rem",letterSpacing:".01em",
        background:v.bg,color:v.cl,border:v.bd,boxShadow:"0 2px 12px rgba(0,0,0,.16)",
        position:"relative",overflow:"hidden",userSelect:"none",backdropFilter:"blur(18px)",
        transformStyle:"preserve-3d",transition:"transform 1s cubic-bezier(.34,1.56,.64,1),box-shadow .4s",...style}}>
      <div style={{position:"absolute",inset:0,borderRadius:11,background:"linear-gradient(135deg,rgba(255,255,255,.16) 0%,transparent 45%,rgba(255,255,255,.04) 100%)",pointerEvents:"none"}}/>
      <div ref={sh} style={{position:"absolute",inset:0,borderRadius:11,pointerEvents:"none",transition:"background .1s"}}/>
      <span style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:7}}>{children}</span>
    </div>
  );
  if(href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{display:"inline-block"}}>{inner}</a>;
  return inner;
}

/* ─────────────────────────────────────────────
   NAME REVEAL
   • Single line  • No subtitle below  • No separator line
   • Smooth fade+rise  • Display font only
───────────────────────────────────────────── */
function NameReveal() {
  const [vis,setVis]=useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVis(true),280); return ()=>clearTimeout(t); },[]);
  return (
    <h1 style={{
      fontFamily:"var(--f-display)",
      fontWeight:800,
      fontSize:"clamp(2.8rem,8.5vw,6.5rem)",
      lineHeight:1.02,
      letterSpacing:"-.03em",
      whiteSpace:"nowrap",          /* ← stays on one line */
      background:"var(--name-grad)",
      WebkitBackgroundClip:"text",
      WebkitTextFillColor:"transparent",
      backgroundClip:"text",
      opacity:vis?1:0,
      transform:vis?"none":"translateY(20px)",
      transition:"opacity 1s cubic-bezier(.22,1,.36,1) 180ms, transform 1s cubic-bezier(.22,1,.36,1) 180ms",
      textAlign:"center",
      display:"block",
    }}>
      {NAME}
    </h1>
  );
}

/* ─────────────────────────────────────────────
   TYPER
   • Positioned bottom-right of the name block
   • Subtle static cursor bar (no blink)
   • Body / mono font — NOT display
───────────────────────────────────────────── */
function Typer() {
  const [txt,setTxt]=useState(""), [wi,setWi]=useState(0);
  const s=useRef({c:0,d:false});
  useEffect(()=>{
    let t;
    const tick=()=>{
      const {c,d}=s.current, w=ROLES[wi];
      if(!d&&c<w.length){ s.current.c++; setTxt(w.slice(0,s.current.c)); t=setTimeout(tick,55); }
      else if(!d&&c===w.length){ t=setTimeout(()=>{ s.current.d=true; tick(); },2700); }
      else if(d&&c>0){ s.current.c--; setTxt(w.slice(0,s.current.c)); t=setTimeout(tick,28); }
      else{ s.current={c:0,d:false}; setWi(p=>(p+1)%ROLES.length); }
    };
    t=setTimeout(tick,100);
    return ()=>clearTimeout(t);
  },[wi]);
  return (
    <span style={{
      fontFamily:"var(--f-mono)",
      fontWeight:500,
      fontSize:"clamp(.78rem,1.6vw,.98rem)",
      color:"var(--acc)",
      letterSpacing:".005em",
      display:"inline-flex",
      alignItems:"center",
      gap:5,
      animation:"typerIn .45s ease both",
    }}>
      {txt}
      {/* static bar — no blink as requested */}
      <span style={{display:"inline-block",width:2,height:"0.95em",background:"var(--acc)",borderRadius:1,opacity:.7,flexShrink:0}}/>
    </span>
  );
}

/* ─────────────────────────────────────────────
   COUNT-UP
───────────────────────────────────────────── */
function CountUp({ end, suffix="", duration=1800 }) {
  const [val,setVal]=useState(0), ref=useRef(null);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting)return; o.disconnect();
      const s=Date.now();
      const tick=()=>{ const p=Math.min((Date.now()-s)/duration,1); setVal(Math.floor(p*p*end)); if(p<1)requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    },{threshold:.5});
    if(ref.current)o.observe(ref.current);
    return ()=>o.disconnect();
  },[end,duration]);
  return (
    <span ref={ref} style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"2.5rem",lineHeight:1,color:"var(--acc)",textShadow:"0 0 20px var(--acc-glow)"}}>
      {val}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SKILL BAR
───────────────────────────────────────────── */
function Bar({ n, v, c, k }) {
  const [w,setW]=useState(0), ref=useRef(null);
  useEffect(()=>{
    setW(0);
    const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setTimeout(()=>setW(v),80); },{threshold:.3});
    if(ref.current)o.observe(ref.current);
    return ()=>o.disconnect();
  },[v,k]);
  return (
    <div ref={ref} style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontFamily:"var(--f-body)",fontWeight:500,fontSize:".88rem",color:"var(--tx)"}}>{n}</span>
        <span style={{fontFamily:"var(--f-mono)",fontSize:".72rem",color:c,fontWeight:500}}>{v}%</span>
      </div>
      <div style={{height:4,borderRadius:2,background:"var(--bar-bg)",overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:`${c}16`,borderRadius:2}}/>
        <div style={{height:"100%",width:w+"%",borderRadius:2,background:`linear-gradient(90deg,${c}bb,${c})`,boxShadow:`0 0 10px ${c}80`,transition:"width 1.8s cubic-bezier(.4,0,.2,1)"}}>
          <div style={{position:"absolute",right:0,top:-1,width:10,height:6,borderRadius:"50%",background:c,boxShadow:`0 0 9px ${c}`,opacity:w>3?1:0,transition:"opacity .4s .4s"}}/>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HEAT-MAP
───────────────────────────────────────────── */
function HeatMap() {
  const data=useMemo(()=>Array.from({length:26},()=>Array.from({length:7},()=>Math.floor(Math.random()*5))),[]);
  const cl=["var(--cell0)","var(--cell1)","var(--cell2)","var(--cell3)","#7c5cfc"];
  const [hov,setHov]=useState(null);
  return (
    <div style={{display:"flex",gap:3,overflowX:"auto",paddingBottom:4}}>
      {data.map((wk,wi)=>(
        <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
          {wk.map((lv,di)=>(
            <div key={di}
              onMouseOver={()=>setHov(`${wi}-${di}`)}
              onMouseOut={()=>setHov(null)}
              style={{width:12,height:12,borderRadius:3,background:cl[lv],flexShrink:0,cursor:"default",
                transform:hov===`${wi}-${di}`?"scale(1.7)":"scale(1)",
                boxShadow:hov===`${wi}-${di}`?"0 0 12px rgba(124,92,252,.9)":(lv===4?"0 0 6px rgba(124,92,252,.6)":"none"),
                transition:"transform .14s cubic-bezier(.34,1.56,.64,1),box-shadow .14s"}}/>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADING
   • label  → mono small-caps
   • title  → Clash Display  (ONLY display font usage in sections)
   • sub    → body font, normal weight
───────────────────────────────────────────── */
function SHead({ label, title, sub, center=false }) {
  return (
    <Fade>
      <div style={{textAlign:center?"center":"left",marginBottom:48}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:9,marginBottom:14,justifyContent:center?"center":"flex-start"}}>
          <div style={{width:24,height:1,background:"var(--acc)",boxShadow:"0 0 8px var(--acc)"}}/>
          <span style={{fontFamily:"var(--f-mono)",fontSize:".64rem",letterSpacing:".22em",textTransform:"uppercase",color:"var(--acc)",fontWeight:500}}>
            {label}
          </span>
          {center && <div style={{width:24,height:1,background:"var(--acc)",boxShadow:"0 0 8px var(--acc)"}}/>}
        </div>
        {/* ← DISPLAY FONT for section titles only */}
        <h2 style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"clamp(1.85rem,4.8vw,3rem)",letterSpacing:"-.026em",lineHeight:.96,color:"var(--tx)",margin:0}}>
          {title}
        </h2>
        {sub && (
          <p style={{fontFamily:"var(--f-body)",fontWeight:400,color:"var(--tx2)",fontSize:".94rem",marginTop:14,maxWidth:480,margin:"14px auto 0",lineHeight:1.76,textAlign:center?"center":"left"}}>
            {sub}
          </p>
        )}
      </div>
    </Fade>
  );
}

/* ─────────────────────────────────────────────
   BADGE
───────────────────────────────────────────── */
function Badge({ text, color="#00d4aa" }) {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:99,background:`${color}07`,border:`1px solid ${color}22`,backdropFilter:"blur(14px)",fontFamily:"var(--f-body)",fontSize:".78rem",fontWeight:500,color,animation:"floatY 4.5s ease-in-out infinite"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 9px #22c55e",flexShrink:0,animation:"pulseScale 2.2s ease-in-out infinite"}}/>
      {text}
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  const [dark,setDark]     = useState(false);
  const [loaded,setLoaded] = useState(false);
  const [lN,setLN]         = useState(0);
  const [lPhase,setLPhase] = useState("counting");
  const [scroll,setScroll] = useState(0);
  const [nav,setNav]       = useState("hero");
  const [tab,setTab]       = useState("lang");
  const [filt,setFilt]     = useState("all");
  const [mqX,setMqX]       = useState(0);
  const [form,setForm]     = useState("idle");
  const [name,setName]     = useState("");
  const [email,setEmail]   = useState("");
  const [subject,setSubject]= useState("");
  const [message,setMessage]= useState("");

  /* email send */
  const sendEmail = () => {
    if(!name||!email||!message){ alert("Please fill all fields"); return; }
    setForm("loading");
    emailjs.send("service_lx55t51","template_q7uydze",{name,email,subject,message},"y15oTugtDO7xKq8k4")
      .then(()=>{ setForm("done"); setName(""); setEmail(""); setSubject(""); setMessage(""); })
      .catch(err=>{ console.error(err); alert("Failed to send message"); setForm("idle"); });
  };

  /* resume download */
  const downloadResume = () => { const a=document.createElement("a"); a.href="/resume.pdf"; a.download="Subhadeep_Bera_Resume.pdf"; a.click(); };

  /* loader */
  useEffect(()=>{
    let n=0;
    const iv=setInterval(()=>{ n+=Math.random()*3+.5; if(n>=100){ n=100; clearInterval(iv); setLPhase("fading"); setTimeout(()=>setLoaded(true),560); } setLN(Math.floor(n)); },30);
    return ()=>clearInterval(iv);
  },[]);

  /* scroll + active nav */
  useEffect(()=>{
    const fn=()=>{
      const tot=document.documentElement.scrollHeight-innerHeight;
      setScroll(tot>0?(scrollY/tot)*100:0);
      for(const id of["contact","dsa","projects","skills","about","hero"]){
        const el=document.getElementById(id);
        if(el&&scrollY>=el.offsetTop-220){ setNav(id); break; }
      }
    };
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  /* marquee */
  useEffect(()=>{
    if(!loaded)return;
    let x=0,raf;
    const go=()=>{ x-=.34; if(x<-1700)x=0; setMqX(x); raf=requestAnimationFrame(go); };
    raf=requestAnimationFrame(go);
    return ()=>cancelAnimationFrame(raf);
  },[loaded]);

  /* theme */
  useEffect(()=>{ document.documentElement.classList.toggle("light",!dark); },[dark]);
  useEffect(()=>{ document.documentElement.classList.add("light"); },[]);

  const goto = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const sk   = SKILLS[tab];
  const projs= filt==="all"?PROJECTS:PROJECTS.filter(p=>p.tags.map(t=>t.toLowerCase()).some(t=>t.includes(filt.toLowerCase())));

  /* ── LOADER ─────────────────────────────── */
  if(!loaded) return (
    <div style={{position:"fixed",inset:0,background:"#06060f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999,overflow:"hidden",opacity:lPhase==="fading"?0:1,transition:"opacity .75s ease"}}>
      <style>{G}</style>
      <Aurora dark={true}/><Orbs dark={true}/>
      {/* grain */}
      <div style={{position:"absolute",inset:0,opacity:.02,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:"256px",pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:26,textAlign:"center"}}>
        {/*
          Loader name animation — smooth fade+blur, NO blinking cursor.
          Just brackets + name text. Clean.
        */}
        <div style={{display:"flex",alignItems:"center",fontFamily:"var(--f-mono)",fontSize:"clamp(1.9rem,5vw,3.5rem)",fontWeight:600,lineHeight:1,letterSpacing:".01em"}}>
          <span style={{color:"#00d4aa",animation:"ldrBracket 1.7s ease forwards",opacity:0}}>{"</"}</span>
          <span style={{
            background:"linear-gradient(135deg,#fff,#c4b5fd,#7c5cfc,#00d4aa)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
            backgroundSize:"300% 100%",
            animation:"ldrName 1.2s ease .2s forwards, shimmer 3.5s .5s linear infinite",
            opacity:0,
          }}>
            subh<span style={{WebkitTextFillColor:"#f59e0b",color:"#f59e0b"}}>4</span>deep
          </span>
          <span style={{color:"#00d4aa",animation:"ldrBracket 1.7s ease .28s forwards",opacity:0}}>{">"}</span>
        </div>

        {/* tagline — body font, not display */}
        <p style={{fontFamily:"var(--f-body)",fontSize:".78rem",color:"#40406a",letterSpacing:".16em",textTransform:"uppercase",fontWeight:500,animation:"ldrFadeUp .7s ease .85s both"}}>
          Full Stack Developer · MERN · Java
        </p>

        {/* progress */}
        <div style={{width:160,height:2,background:"rgba(255,255,255,.05)",borderRadius:1,overflow:"hidden",animation:"ldrFadeUp .6s ease .6s both"}}>
          <div style={{width:lN+"%",height:"100%",background:"linear-gradient(90deg,#7c5cfc,#00d4aa)",boxShadow:"0 0 10px #7c5cfc",borderRadius:1,transition:"width .05s linear"}}/>
        </div>
      </div>
    </div>
  );

  /* ── MAIN ───────────────────────────────── */
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--tx)",fontFamily:"var(--f-body)",position:"relative",overflowX:"hidden",transition:"background .6s,color .5s"}}>
      <style>{G}</style>

      <Aurora dark={dark}/><Particles dark={dark}/><Orbs dark={dark}/><Cursor/>

      {/* grain */}
      <div style={{position:"fixed",inset:0,zIndex:3,pointerEvents:"none",opacity:dark?.022:.009,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:"256px"}}/>

      {/* scroll bar */}
      <div className="shimmer-line" style={{position:"fixed",top:0,left:0,height:2,zIndex:9995,width:scroll+"%",borderRadius:"0 1px 1px 0",transition:"width .1s linear"}}/>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="navIn" style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"12px 20px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 24px",borderRadius:18,background:dark?"rgba(6,6,15,.9)":"rgba(252,251,255,.92)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",border:"1px solid var(--bd)",boxShadow:dark?"0 4px 40px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.05)":"0 4px 40px rgba(80,50,200,.08),inset 0 1px 0 rgba(255,255,255,.82)",transition:"background .5s,box-shadow .5s"}}>

          {/* logo */}
          <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:0}}>
            <div className="gpulse" style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7c5cfc,#00d4aa)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.2),transparent)"}}/>
              {/* Use display font for logo initial — acceptable single char exception */}
              <span style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"1.1rem",color:"#fff",position:"relative"}}>S</span>
            </div>
            <div style={{display:"flex",alignItems:"baseline",fontFamily:"var(--f-mono)",fontWeight:600,fontSize:".92rem"}}>
              <span style={{color:"var(--acc2)"}}>{"</"}</span>
              <span style={{color:"var(--tx)"}}>subh</span>
              <span style={{color:"var(--acc)"}}>4</span>
              <span style={{color:"var(--tx)"}}>deep</span>
              <span style={{color:"var(--acc2)"}}>{">"}</span>
            </div>
          </button>

          {/* links — body font */}
          <div style={{display:"flex",gap:2}}>
            {NAV.map(id=>(
              <button key={id} onClick={()=>goto(id)}
                style={{fontFamily:"var(--f-body)",fontSize:".84rem",fontWeight:500,color:nav===id?"var(--tx)":"var(--tx2)",background:nav===id?"var(--btn-ghost)":"none",border:"none",cursor:"pointer",padding:"6px 13px",borderRadius:9,transition:"all .2s",textTransform:"capitalize",position:"relative"}}
                onMouseOver={e=>{e.currentTarget.style.color="var(--tx)";e.currentTarget.style.background="var(--btn-ghost)";}}
                onMouseOut={e=>{e.currentTarget.style.color=nav===id?"var(--tx)":"var(--tx2)";e.currentTarget.style.background=nav===id?"var(--btn-ghost)":"none";}}>
                {nav===id && <div style={{position:"absolute",bottom:2,left:"22%",right:"22%",height:2,borderRadius:1,background:"var(--acc)",boxShadow:"0 0 8px var(--acc)",animation:"scaleInX .28s cubic-bezier(.34,1.56,.64,1)"}}/>}
                {id}
              </button>
            ))}
          </div>

          {/* social + theme */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {[
              {h:"https://github.com/subh4deep",         d:"M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"},
              {h:"https://www.linkedin.com/in/subhadeep-bera-7a7224251", d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"},
            ].map((s,i)=>(
              <a key={i} href={s.h} target="_blank" rel="noopener noreferrer"
                style={{width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--bd)",background:"var(--btn-ghost)",color:"var(--tx2)",transition:"all .22s"}}
                onMouseOver={e=>{e.currentTarget.style.color="var(--tx)";e.currentTarget.style.borderColor="rgba(124,92,252,.38)";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 14px var(--acc-glow)";}}
                onMouseOut={e=>{e.currentTarget.style.color="var(--tx2)";e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d={s.d}/></svg>
              </a>
            ))}
            <button onClick={()=>setDark(d=>!d)} title="Toggle theme"
              style={{width:50,height:26,borderRadius:99,border:"1px solid var(--bd)",background:dark?"rgba(124,92,252,.12)":"rgba(245,158,11,.11)",cursor:"pointer",position:"relative",padding:3,display:"flex",alignItems:"center",transition:"all .32s"}}>
              <div style={{position:"absolute",left:dark?"3px":"calc(100% - 21px)",width:18,height:18,borderRadius:"50%",background:dark?"linear-gradient(135deg,#7c5cfc,#00d4aa)":"linear-gradient(135deg,#f59e0b,#f97316)",boxShadow:dark?"0 0 10px rgba(124,92,252,.68)":"0 0 10px rgba(245,158,11,.68)",transition:"left .38s cubic-bezier(.34,1.56,.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".58rem"}}>{dark?"🌙":"☀️"}</div>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",position:"relative",zIndex:10}}>
        {/* subtle grid */}
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${dark?"rgba(255,255,255,.018)":"rgba(80,50,200,.034)"} 1px,transparent 1px),linear-gradient(90deg,${dark?"rgba(255,255,255,.018)":"rgba(80,50,200,.034)"} 1px,transparent 1px)`,backgroundSize:"64px 64px",maskImage:"radial-gradient(ellipse 78% 78% at 50% 50%,black,transparent)",WebkitMaskImage:"radial-gradient(ellipse 78% 78% at 50% 50%,black,transparent)",pointerEvents:"none",animation:"gridPulse 6s ease-in-out infinite"}}/>
        {/* orbit rings */}
        {[480,740,1020].map((s,i)=>(
          <div key={i} className={i%2===0?"rotCW":"rotCCW"} style={{position:"absolute",width:s,height:s,borderRadius:"50%",border:`1px solid rgba(107,77,230,.0${5-i*2})`,top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
        ))}
        <Blob size={300} color="#7c5cfc" style={{top:"14%",right:"7%",opacity:.38}}/>
        <Blob size={190} color="#00d4aa" style={{bottom:"16%",left:"4%",opacity:.28,animationDelay:"5s"}}/>

        <div style={{maxWidth:940,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2}}>

          {/* available badge */}
          <Fade delay={60}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:32}}>
              <Badge text="Available for Full-Time Opportunities"/>
            </div>
          </Fade>

          {/* greeting tag — mono font */}
          <Fade delay={160}>
            <p style={{fontFamily:"var(--f-mono)",fontSize:".7rem",color:"var(--tx3)",letterSpacing:".18em",textTransform:"uppercase",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{color:"var(--acc2)",fontWeight:600}}>{"</"}</span>
              Hi, I am
              <span style={{color:"var(--acc2)",fontWeight:600}}>{">"}</span>
            </p>
          </Fade>

          {/*
            ── NAME BLOCK ──────────────────────────────────────────────────
            Name: single line, display font, gradient fill.
            Typer: absolutely positioned bottom-right under the name.
            No "Full Stack Developer" text below the name.
            No horizontal separator lines.
          */}
          <Fade delay={240}>
            <div style={{position:"relative",display:"inline-block",marginBottom:18}}>
              <NameReveal/>
              {/* Typer pinned to the bottom-right of the name block */}
              <div style={{
                position:"absolute",
                bottom:-28,
                right:0,
                display:"flex",
                alignItems:"center",
                gap:0,
                opacity:1,
              }}>
                <Typer/>
              </div>
            </div>
          </Fade>

          {/* Extra space to clear the typer overhang */}
          <div style={{marginBottom:40}}/>

          {/* description — body font, readable */}
          <Fade delay={560}>
            <p style={{fontFamily:"var(--f-body)",fontWeight:400,color:"var(--tx2)",fontSize:".97rem",lineHeight:1.84,maxWidth:540,margin:"0 auto 44px"}}>
              Building scalable <strong style={{color:"var(--tx)",fontWeight:600}}>MERN applications</strong> and production-grade systems. Specialising in full-stack architecture, API design, and performance optimisation — shipping software that scales.
            </p>
          </Fade>

          {/* CTA buttons */}
          <Fade delay={700}>
            <div style={{display:"flex",gap:11,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
              <Btn variant="primary" onClick={()=>goto("projects")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Work
              </Btn>
              <Btn variant="ghost" onClick={downloadResume}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Resume
              </Btn>
              <Btn variant="teal" onClick={()=>goto("contact")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Hire Me
              </Btn>
            </div>
          </Fade>

          {/* platform links — body font */}
          <Fade delay={860}>
            <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:60}}>
              {[{l:"GitHub",h:"https://github.com/subh4deep"},{l:"LinkedIn",h:"https://www.linkedin.com/in/subhadeep-bera-7a7224251"},{l:"LeetCode",h:"https://leetcode.com/u/_subh4deep/"}].map(s=>(
                <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 20px",borderRadius:11,border:"1px solid var(--bd)",color:"var(--tx2)",background:"var(--btn-ghost)",backdropFilter:"blur(14px)",fontFamily:"var(--f-body)",fontSize:".82rem",fontWeight:500,transition:"all .28s cubic-bezier(.34,1.56,.64,1)"}}
                  onMouseOver={e=>{e.currentTarget.style.color="var(--tx)";e.currentTarget.style.borderColor="rgba(124,92,252,.32)";e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 10px 28px var(--acc-glow)";e.currentTarget.style.background="rgba(124,92,252,.055)";}}
                  onMouseOut={e=>{e.currentTarget.style.color="var(--tx2)";e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.background="var(--btn-ghost)";}}>
                  {s.l}
                </a>
              ))}
            </div>
          </Fade>

          {/* scroll indicator */}
          <Fade delay={1060}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}} onClick={()=>goto("about")}>
              <div style={{width:1,height:52,background:"linear-gradient(to bottom,var(--acc),transparent)",boxShadow:"0 0 8px var(--acc)",animation:"floatY 3.2s ease-in-out infinite"}}/>
              <span style={{fontFamily:"var(--f-mono)",fontSize:".56rem",letterSpacing:".22em",textTransform:"uppercase",color:"var(--tx3)"}}>scroll</span>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" style={{padding:"108px 24px",background:dark?"rgba(8,8,18,.72)":"rgba(243,241,255,.62)",backdropFilter:"blur(32px)",position:"relative",zIndex:10,overflow:"hidden"}}>
        <Blob size={360} color="#7c5cfc" style={{top:"-8%",right:"-7%",opacity:.26}}/>
        <div style={{maxWidth:1140,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:60,alignItems:"center",position:"relative"}}>
          <div>
            <SHead label="about me" title={<>Engineering things<br/><span className="shimmer-text">that scale.</span></>}/>
            <Fade delay={80}>
              <div style={{display:"flex",flexDirection:"column",gap:15,color:"var(--tx2)",lineHeight:1.82,fontSize:".94rem",fontWeight:400}}>
                <p>I'm a <strong style={{color:"var(--tx)",fontWeight:600}}>Full Stack Developer</strong> specialising in the MERN ecosystem — building production-grade applications with clean architecture, scalable APIs, and performance-optimised frontends.</p>
                <p>My approach centres on <span style={{color:"var(--acc)",fontWeight:600}}>full-stack system design</span> — from React UIs with smooth 60fps interactions to robust Node.js/Express backends and efficient MongoDB schemas engineered for real-world load.</p>
                <p>Beyond web, I actively solve algorithmic challenges on <span style={{color:"var(--acc2)",fontWeight:600}}>LeetCode</span>, develop Java applications, and build AI-powered developer tools using the Gemini API.</p>
              </div>
            </Fade>
            <Fade delay={200}>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:26,marginBottom:26}}>
                {["React.js","Node.js","Express","MongoDB","Java","DSA","Tailwind CSS","TypeScript","REST APIs","Gemini API","Three.js","Docker"].map(t=>(
                  <span key={t}
                    style={{fontFamily:"var(--f-body)",fontSize:".78rem",fontWeight:500,padding:"5px 12px",borderRadius:8,background:"var(--btn-ghost)",border:"1px solid var(--bd)",color:"var(--acc)",transition:"all .22s cubic-bezier(.34,1.56,.64,1)",cursor:"default"}}
                    onMouseOver={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 6px 16px var(--acc-glow)";e.currentTarget.style.borderColor="rgba(124,92,252,.32)";e.currentTarget.style.background="rgba(124,92,252,.07)";}}
                    onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.background="var(--btn-ghost)";}}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
                <Btn variant="primary" onClick={()=>goto("projects")} sm>See Projects →</Btn>
                <Btn variant="ghost"   onClick={()=>goto("contact")} sm>Let's Talk</Btn>
              </div>
            </Fade>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[{icon:"⚡",t:"Full Stack",d:"MERN mastery",c:"#7c5cfc"},{icon:"🧠",t:"DSA Expert",d:"200+ solved",c:"#00d4aa"},{icon:"☕",t:"Java Dev",d:"OOP & enterprise",c:"#ff6b47"},{icon:"🤖",t:"AI Tools",d:"Gemini · LLMs",c:"#f59e0b"}].map((s,i)=>(
              <Fade key={i} delay={i*65}>
                <Card accent={s.c} style={{padding:"22px 18px"}} int={0.72}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${s.c}11`,border:`1px solid ${s.c}22`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,fontSize:"1.2rem",boxShadow:`0 0 18px ${s.c}1c`}} className="float2">{s.icon}</div>
                  {/* card title → display font */}
                  <p style={{fontFamily:"var(--f-display)",fontWeight:700,fontSize:".9rem",color:"var(--tx)",marginBottom:3}}>{s.t}</p>
                  <p style={{fontFamily:"var(--f-body)",fontSize:".76rem",color:"var(--tx3)",fontWeight:400}}>{s.d}</p>
                  <div style={{marginTop:12,height:2,width:32,borderRadius:1,background:`linear-gradient(90deg,${s.c},transparent)`,boxShadow:`0 0 8px ${s.c}`}}/>
                </Card>
              </Fade>
            ))}
            <Fade delay={300} style={{gridColumn:"1/-1"}}>
              <Card accent="#7c5cfc" style={{padding:"18px 22px"}} int={0.3}>
                <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap"}}>
                  {[{v:"3+",l:"Production Apps",sub:"MERN · Deployed"},{v:"200+",l:"Problems Solved",sub:"LeetCode · DSA"},{v:"4★",l:"HackerRank",sub:"Problem Solving"}].map((stat,i)=>(
                    <div key={i} style={{flex:1,minWidth:88,textAlign:"center",padding:"8px 6px"}}>
                      <p className="shimmer-text" style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"1.95rem",lineHeight:1}}>{stat.v}</p>
                      <p style={{fontFamily:"var(--f-body)",fontWeight:600,fontSize:".8rem",color:"var(--tx)",marginTop:5,marginBottom:2}}>{stat.l}</p>
                      <p style={{fontFamily:"var(--f-mono)",fontSize:".66rem",color:"var(--tx3)"}}>{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </Fade>
          </div>
        </div>

        {/* marquee — body font */}
        <div style={{overflow:"hidden",marginTop:60,paddingTop:38,borderTop:"1px solid var(--bd)"}}>
          <div style={{display:"flex",gap:44,whiteSpace:"nowrap",width:"max-content",transform:`translateX(${mqX}px)`}}>
            {[...MQ_ITEMS,...MQ_ITEMS,...MQ_ITEMS].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:16,flexShrink:0,fontFamily:"var(--f-body)",fontSize:".96rem",fontWeight:500,color:"var(--tx3)"}}>
                {item}<span style={{color:"var(--acc)",fontSize:".52rem",textShadow:"0 0 8px var(--acc)"}}>✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SKILLS ═══════════════ */}
      <section id="skills" style={{padding:"108px 24px",position:"relative",zIndex:10,overflow:"hidden"}}>
        <Blob size={330} color="#00d4aa" style={{bottom:"4%",right:"-4%",opacity:.2,animationDelay:"2.5s"}}/>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <SHead label="tech stack" title="Skills & Technologies" sub="From frontend polish to backend power — here's what I build with."/>
          <Fade>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:26}}>
              {Object.entries(SKILLS).map(([k,v])=>(
                <button key={k} onClick={()=>setTab(k)}
                  style={{fontFamily:"var(--f-body)",fontSize:".82rem",fontWeight:500,padding:"8px 18px",borderRadius:10,border:`1px solid ${tab===k?v.c+"40":"var(--bd)"}`,color:tab===k?v.c:"var(--tx2)",background:tab===k?`${v.c}0c`:"var(--btn-ghost)",cursor:"pointer",transition:"all .28s cubic-bezier(.34,1.56,.64,1)",backdropFilter:"blur(8px)",transform:tab===k?"translateY(-2px)":"none",boxShadow:tab===k?`0 6px 18px ${v.c}26`:"none"}}
                  onMouseOver={e=>{if(tab!==k){e.currentTarget.style.color="var(--tx)";e.currentTarget.style.transform="translateY(-1px)";}}}
                  onMouseOut={e=>{if(tab!==k){e.currentTarget.style.color="var(--tx2)";e.currentTarget.style.transform="none";}}}>
                  {v.label}
                </button>
              ))}
            </div>
          </Fade>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:20}}>
            <Fade>
              <Card accent={sk.c} style={{padding:"30px 28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:26}}>
                  <div style={{width:4,height:26,borderRadius:2,background:sk.c,boxShadow:`0 0 10px ${sk.c}`}}/>
                  {/* card heading → display */}
                  <h3 style={{fontFamily:"var(--f-display)",fontWeight:700,fontSize:"1rem",color:"var(--tx)"}}>{sk.label}</h3>
                </div>
                {sk.items.map(s=><Bar key={`${tab}-${s.n}`} n={s.n} v={s.v} c={sk.c} k={tab}/>)}
              </Card>
            </Fade>
            <Fade delay={100}>
              <Card accent="#7c5cfc" style={{padding:"30px 28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:22}}>
                  <div style={{width:4,height:26,borderRadius:2,background:"var(--acc)",boxShadow:"0 0 10px var(--acc)"}}/>
                  <h3 style={{fontFamily:"var(--f-display)",fontWeight:700,fontSize:"1rem",color:"var(--tx)"}}>All Technologies</h3>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:22}}>
                  {[["JavaScript","#7c5cfc"],["React.js","#00d4aa"],["Node.js","#ff6b47"],["MongoDB","#ff6b47"],["Express.js","#ff6b47"],["Java","#f59e0b"],["DSA","#f59e0b"],["Tailwind","#00d4aa"],["HTML/CSS","#00d4aa"],["OOP","#f59e0b"],["GSAP","#00d4aa"],["REST APIs","#7c5cfc"],["Three.js","#7c5cfc"],["TypeScript","#7c5cfc"],["Docker","#7c5cfc"],["Python","#00d4aa"]].map(([n,c])=>(
                    <span key={n}
                      style={{fontFamily:"var(--f-body)",fontSize:".77rem",fontWeight:500,padding:"4px 10px",borderRadius:7,background:`${c}0c`,border:`1px solid ${c}22`,color:c,transition:"all .22s",cursor:"default"}}
                      onMouseOver={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 5px 14px ${c}2e`;e.currentTarget.style.background=`${c}18`;}}
                      onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.background=`${c}0c`;}}>
                      {n}
                    </span>
                  ))}
                </div>
                <div style={{borderTop:"1px solid var(--bd)",paddingTop:18}}>
                  <p style={{fontFamily:"var(--f-mono)",fontSize:".62rem",color:"var(--tx3)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:11,fontWeight:500}}>Tools & Platforms</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {["Git","GitHub","VS Code","Postman","Vercel","Render","npm","Vite"].map(t=>(
                      <span key={t}
                        style={{fontFamily:"var(--f-body)",fontWeight:500,fontSize:".8rem",padding:"5px 13px",borderRadius:8,background:"var(--btn-ghost)",border:"1px solid var(--bd)",color:"var(--tx2)",transition:"all .2s",cursor:"default"}}
                        onMouseOver={e=>{e.currentTarget.style.color="var(--tx)";e.currentTarget.style.borderColor="var(--bd-h)";e.currentTarget.style.transform="translateY(-2px)";}}
                        onMouseOut={e=>{e.currentTarget.style.color="var(--tx2)";e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.transform="none";}}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══════════════ PROJECTS ═══════════════ */}
      <section id="projects" style={{padding:"108px 24px",background:dark?"rgba(8,8,18,.72)":"rgba(243,241,255,.62)",backdropFilter:"blur(32px)",position:"relative",zIndex:10,overflow:"hidden"}}>
        <Blob size={270} color="#ff6b47" style={{top:"4%",left:"-4%",opacity:.17,animationDelay:"1.5s"}}/>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14}}>
            <SHead label="featured work" title="Projects" sub="Real apps — designed, engineered and deployed."/>
            <Fade><div style={{marginTop:4}}><Btn variant="ghost" href="https://github.com/subh4deep" sm>All on GitHub ↗</Btn></div></Fade>
          </div>
          <Fade>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:28}}>
              {FILTERS.map(f=>(
                <button key={f} onClick={()=>setFilt(f)}
                  style={{fontFamily:"var(--f-body)",fontSize:".8rem",fontWeight:500,padding:"7px 16px",borderRadius:9,border:`1px solid ${filt===f?"rgba(124,92,252,.46)":"var(--bd)"}`,color:filt===f?"var(--acc)":"var(--tx2)",background:filt===f?"rgba(124,92,252,.07)":"var(--btn-ghost)",cursor:"pointer",transition:"all .22s cubic-bezier(.34,1.56,.64,1)",textTransform:"capitalize",backdropFilter:"blur(8px)",transform:filt===f?"translateY(-1px)":"none",boxShadow:filt===f?"0 4px 14px var(--acc-glow)":"none"}}>
                  {f}
                </button>
              ))}
            </div>
          </Fade>
          <div style={{display:"grid",gap:18}}>
            {projs.map((p,i)=>(
              <Fade key={p.id} delay={i*75} x={i%2===0?-14:14}>
                <Card accent={p.color} style={{overflow:"hidden"}} int={0.48}>
                  <div style={{height:2,background:`linear-gradient(90deg,transparent,${p.color}c0,${p.color},${p.color}c0,transparent)`,backgroundSize:"200% 100%",animation:"borderRun 3.5s linear infinite",boxShadow:`0 0 16px ${p.color}50`}}/>
                  <div style={{padding:"30px 34px 24px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:14}}>
                      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                        <div style={{width:50,height:50,borderRadius:15,fontSize:"1.4rem",background:`${p.color}0e`,border:`1px solid ${p.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 20px ${p.color}1c`}} className="float2">{p.emoji}</div>
                        <div>
                          <p style={{fontFamily:"var(--f-mono)",fontSize:".6rem",color:p.color,letterSpacing:".12em",marginBottom:3,fontWeight:500}}>Project {p.id}</p>
                          {/* project title → display */}
                          <h3 style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"1.4rem",color:"var(--tx)",lineHeight:1.05,marginBottom:3}}>{p.title}</h3>
                          <p style={{fontFamily:"var(--f-body)",fontSize:".77rem",color:"var(--tx3)",fontWeight:400}}>{p.tag}</p>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                        <Btn variant="ghost" href={p.gh} sm>
                          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                          Source
                        </Btn>
                        {p.live && <Btn variant="teal" href={p.live} sm>Live ↗</Btn>}
                      </div>
                    </div>
                    <p style={{fontFamily:"var(--f-body)",fontSize:".9rem",color:"var(--tx2)",lineHeight:1.8,marginBottom:18,maxWidth:680,fontWeight:400}}>{p.desc}</p>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                      {p.tags.map(t=><span key={t} style={{fontFamily:"var(--f-body)",fontSize:".74rem",fontWeight:500,padding:"4px 10px",borderRadius:7,background:`${p.color}0c`,border:`1px solid ${p.color}26`,color:p.color}}>{t}</span>)}
                    </div>
                    <p style={{fontFamily:"var(--f-mono)",fontSize:".67rem",color:"var(--tx3)",fontWeight:400}}>{p.tech.join(" · ")}</p>
                  </div>
                  <div style={{padding:"11px 34px",borderTop:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center",background:dark?"rgba(255,255,255,.014)":"rgba(255,255,255,.52)"}}>
                    <span style={{fontFamily:"var(--f-body)",fontSize:".74rem",color:"var(--tx3)",fontWeight:400}}>{p.live?"⚡ Production deployed":"🔒 Open source"}</span>
                    <span style={{fontFamily:"var(--f-mono)",fontSize:".63rem",color:p.color,fontWeight:500}}>2024 · WB, India</span>
                  </div>
                </Card>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DSA ═══════════════ */}
      <section id="dsa" style={{padding:"108px 24px",position:"relative",zIndex:10,overflow:"hidden"}}>
        <Blob size={290} color="#f59e0b" style={{top:"8%",right:"-5%",opacity:.17,animationDelay:"4s"}}/>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <SHead label="problem solving" title="DSA & Competitive Coding" sub="Algorithms are poetry. I've been writing a lot of it."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:14,marginBottom:18}}>
            {[{end:200,suffix:"+",l:"Problems Solved",s:"All platforms",c:"#7c5cfc",i:"🧩"},{end:4,suffix:"★",l:"HackerRank",s:"Problem Solving",c:"#f59e0b",i:"⭐"},{end:3,suffix:"+",l:"Platforms Active",s:"Daily practice",c:"#00d4aa",i:"🌐"},{end:100,suffix:"%",l:"Dedication",s:"Never stop",c:"#ff6b47",i:"🔥"}].map((s,i)=>(
              <Fade key={i} delay={i*65} scale>
                <Card accent={s.c} style={{padding:"24px 20px",textAlign:"center"}} int={0.8}>
                  <div style={{fontSize:"1.7rem",marginBottom:11}} className="float2">{s.i}</div>
                  <CountUp end={s.end} suffix={s.suffix} duration={2000}/>
                  <p style={{fontFamily:"var(--f-body)",fontWeight:600,fontSize:".82rem",color:"var(--tx)",marginTop:6,marginBottom:2}}>{s.l}</p>
                  <p style={{fontFamily:"var(--f-mono)",fontSize:".66rem",color:"var(--tx3)"}}>{s.s}</p>
                </Card>
              </Fade>
            ))}
          </div>
          <Fade delay={160}>
            <Card accent="#7c5cfc" style={{padding:"26px 28px",marginBottom:18}} int={0.26}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:11}}>
                <p style={{fontFamily:"var(--f-mono)",fontSize:".62rem",color:"var(--tx3)",letterSpacing:".14em",textTransform:"uppercase",fontWeight:500}}>Contribution Heatmap · 2024</p>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontFamily:"var(--f-mono)",fontSize:".57rem",color:"var(--tx3)"}}>less</span>
                  {["var(--cell0)","var(--cell1)","var(--cell2)","var(--cell3)","#7c5cfc"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:3,background:c,boxShadow:i===4?"0 0 7px rgba(124,92,252,.6)":"none"}}/>)}
                  <span style={{fontFamily:"var(--f-mono)",fontSize:".57rem",color:"var(--tx3)"}}>more</span>
                </div>
              </div>
              <HeatMap/>
            </Card>
          </Fade>
          <Fade delay={240}>
            <Card accent="#7c5cfc" style={{padding:"24px 28px"}} int={0.26}>
              <p style={{fontFamily:"var(--f-mono)",fontSize:".62rem",color:"var(--tx3)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:16,fontWeight:500}}>Topics Mastered</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {DSA_TOPICS.map(t=>(
                  <span key={t}
                    style={{fontFamily:"var(--f-body)",fontWeight:500,fontSize:".82rem",padding:"7px 15px",borderRadius:10,background:"var(--btn-ghost)",border:"1px solid var(--bd)",color:"var(--tx2)",transition:"all .25s cubic-bezier(.34,1.56,.64,1)",cursor:"default"}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(124,92,252,.34)";e.currentTarget.style.color="var(--tx)";e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 8px 20px var(--acc-glow)";e.currentTarget.style.background="rgba(124,92,252,.065)";}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.color="var(--tx2)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.background="var(--btn-ghost)";}}>
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          </Fade>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" style={{padding:"108px 24px",background:dark?"rgba(8,8,18,.72)":"rgba(243,241,255,.62)",backdropFilter:"blur(32px)",position:"relative",zIndex:10,overflow:"hidden"}}>
        <Blob size={440} color="#7c5cfc" style={{top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:.13}}/>
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative"}}>
          <SHead label="let's connect" title="Get In Touch" sub="Open to full-time roles & exciting projects. I reply within 24 hours 🚀" center/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:20}}>
            <Fade x={-28}>
              <Card accent="#7c5cfc" style={{padding:"34px 30px"}}>
                {/* heading → display */}
                <h3 style={{fontFamily:"var(--f-display)",fontWeight:700,fontSize:"1.05rem",color:"var(--tx)",marginBottom:26}}>Contact Details</h3>
                {[{l:"EMAIL",v:"subhadeepbera004@gmail.com",h:"mailto:subhadeepbera004@gmail.com",c:"#7c5cfc"},{l:"PHONE",v:"+91-8653270401",h:"tel:+918653270401",c:"#00d4aa"},{l:"GITHUB",v:"subh4deep",h:"https://github.com/subh4deep",c:"#f59e0b"},{l:"LINKEDIN",v:"Subhadeep Bera",h:"https://www.linkedin.com/in/subhadeep-bera-7a7224251",c:"#0891b2"},{l:"LEETCODE",v:"subh4deep",h:"https://leetcode.com/u/_subh4deep/",c:"#ff6b47"}].map(s=>(
                  <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"center",gap:13,marginBottom:17,transition:"transform .25s cubic-bezier(.34,1.56,.64,1)"}}
                    onMouseOver={e=>e.currentTarget.style.transform="translateX(9px)"}
                    onMouseOut={e=>e.currentTarget.style.transform="none"}>
                    <div style={{width:38,height:38,borderRadius:11,background:`${s.c}0b`,border:`1px solid ${s.c}1c`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"var(--f-mono)",fontSize:".68rem",color:s.c,fontWeight:600}}>{s.l[0]}</div>
                    <div>
                      <p style={{fontFamily:"var(--f-mono)",fontSize:".57rem",color:"var(--tx3)",letterSpacing:".1em",marginBottom:1}}>{s.l}</p>
                      <p style={{fontFamily:"var(--f-body)",fontSize:".84rem",color:"var(--tx)",fontWeight:500}}>{s.v}</p>
                    </div>
                  </a>
                ))}
                <div style={{marginTop:13,paddingTop:13,borderTop:"1px solid var(--bd)",display:"flex",alignItems:"center",gap:11}}>
                  <span style={{fontSize:"1rem"}} className="float1">📍</span>
                  <div>
                    <p style={{fontFamily:"var(--f-body)",fontSize:".84rem",color:"var(--tx)",fontWeight:600}}>West Bengal, India</p>
                    <p style={{fontFamily:"var(--f-body)",fontSize:".74rem",color:"var(--tx3)",marginTop:2,fontWeight:400}}>Remote OK · On-site · Hybrid</p>
                  </div>
                </div>
              </Card>
            </Fade>

            <Fade x={28}>
              <Card accent="#7c5cfc" style={{padding:"34px 30px"}}>
                <h3 style={{fontFamily:"var(--f-display)",fontWeight:700,fontSize:"1.05rem",color:"var(--tx)",marginBottom:24}}>Send a Message</h3>
                {form==="done" ? (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 0",textAlign:"center"}}>
                    <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(124,92,252,.09)",border:"1px solid rgba(124,92,252,.26)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:"1.9rem",boxShadow:"0 0 36px rgba(124,92,252,.28)"}} className="gpulse">✓</div>
                    <p style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"1.1rem",color:"var(--tx)",marginBottom:7}}>Message Sent! 🎉</p>
                    <p style={{fontFamily:"var(--f-body)",fontSize:".88rem",color:"var(--tx2)",marginBottom:22,lineHeight:1.72,fontWeight:400}}>Thanks for reaching out!<br/>I'll respond within 24 hours.</p>
                    <Btn variant="ghost" onClick={()=>setForm("idle")} sm>← Send Another</Btn>
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:15}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
                      <div>
                        <label style={{fontFamily:"var(--f-body)",fontSize:".76rem",fontWeight:600,color:"var(--tx2)",display:"block",marginBottom:6}}>Name</label>
                        <input placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)}/>
                      </div>
                      <div>
                        <label style={{fontFamily:"var(--f-body)",fontSize:".76rem",fontWeight:600,color:"var(--tx2)",display:"block",marginBottom:6}}>Email</label>
                        <input type="email" placeholder="john@company.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                      </div>
                    </div>
                    <div>
                      <label style={{fontFamily:"var(--f-body)",fontSize:".76rem",fontWeight:600,color:"var(--tx2)",display:"block",marginBottom:6}}>Subject</label>
                      <input placeholder="Job Opportunity — MERN Developer" value={subject} onChange={e=>setSubject(e.target.value)}/>
                    </div>
                    <div>
                      <label style={{fontFamily:"var(--f-body)",fontSize:".76rem",fontWeight:600,color:"var(--tx2)",display:"block",marginBottom:6}}>Message</label>
                      <textarea rows={5} placeholder="Hi Subhadeep, I came across your portfolio and..." value={message} onChange={e=>setMessage(e.target.value)}/>
                    </div>
                    <Btn variant="primary" style={{width:"100%",justifyContent:"center"}} onClick={sendEmail}>
                      {form==="loading" ? (
                        <span style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{width:13,height:13,border:"2px solid rgba(255,255,255,.32)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 1s linear infinite"}}/>
                          Sending…
                        </span>
                      ) : (
                        <>
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
                          Send Message
                        </>
                      )}
                    </Btn>
                  </div>
                )}
              </Card>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{padding:"52px 24px 38px",background:dark?"rgba(5,5,12,.97)":"rgba(252,250,255,.97)",backdropFilter:"blur(36px)",borderTop:"1px solid var(--bd)",position:"relative",zIndex:10}}>
        <div className="shimmer-line" style={{position:"absolute",top:0,left:0,right:0,height:2,opacity:.55}}/>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:18,marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div className="gpulse" style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#7c5cfc,#00d4aa)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"var(--f-display)",fontWeight:800,fontSize:"1.1rem",color:"#fff"}}>S</span>
              </div>
              <div>
                <p style={{fontFamily:"var(--f-mono)",fontWeight:600,fontSize:".9rem",color:"var(--tx)"}}>
                  <span style={{color:"var(--acc2)"}}>{"</"}</span>
                  subh<span style={{color:"var(--acc)"}}>4</span>deep
                  <span style={{color:"var(--acc2)"}}>{">"}</span>
                </p>
                <p style={{fontFamily:"var(--f-body)",fontSize:".71rem",color:"var(--tx3)",marginTop:2,fontWeight:400}}>MERN · Java · DSA · Open Source</p>
              </div>
            </div>
            <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
              {NAV.map(id=>(
                <button key={id} onClick={()=>goto(id)}
                  style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--f-body)",fontSize:".83rem",fontWeight:500,color:"var(--tx3)",padding:"5px 10px",borderRadius:8,transition:"all .2s",textTransform:"capitalize"}}
                  onMouseOver={e=>{e.currentTarget.style.color="var(--tx)";e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseOut={e=>{e.currentTarget.style.color="var(--tx3)";e.currentTarget.style.transform="none";}}>
                  {id}
                </button>
              ))}
            </div>
            <Btn variant="primary" onClick={()=>goto("contact")} sm>Let's Talk ↗</Btn>
          </div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,var(--bd),transparent)",marginBottom:18}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:11}}>
            <p style={{fontFamily:"var(--f-body)",fontSize:".77rem",color:"var(--tx3)",fontWeight:400}}>
              Crafted with <span className="flicker" style={{color:"#ff6b47"}}>❤️</span> by <strong style={{color:"var(--tx)",fontWeight:600}}>Subhadeep Bera</strong> · {new Date().getFullYear()}
            </p>
            <p style={{fontFamily:"var(--f-mono)",fontSize:".61rem",color:"var(--tx3)"}}>React · WebGL · Particles · 3D Glass</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
