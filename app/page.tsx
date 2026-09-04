'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MoonStar, Plus, ScrollText, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Wish = { id:number; text:string; date:string; color:'amber'|'red'|'ivory'; x:number; y:number; scale:number };
const seedWishes: Wish[] = [
  { id:1,text:'愿家人常安，岁岁无忧。',date:'2026-08-18',color:'amber',x:23,y:26,scale:.68 },
  { id:2,text:'愿我有勇气走向真正喜欢的生活。',date:'2026-07-02',color:'red',x:72,y:18,scale:.52 },
  { id:3,text:'愿这一程所遇皆温柔。',date:'2026-06-11',color:'ivory',x:84,y:39,scale:.4 },
  { id:4,text:'愿未完的故事，终有好结局。',date:'2026-03-26',color:'amber',x:37,y:13,scale:.31 },
];

function Lamp({color, className=''}:{color:Wish['color'];className?:string}) {
  return <span className={`lamp lamp-${color} ${className}`}><i className="lamp-cap"/><i className="lamp-body"><b/></i><i className="lamp-tail"/></span>;
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 52 58" role="img">
      <path d="M15 5h22M12 10C7 17 6 37 12 45c4 6 24 6 28 0 6-8 5-28 0-35C33 6 19 6 12 10Z"/>
      <path d="M16 50h20M22 54h8"/>
    </svg>
    <b>祈</b>
  </span>;
}

export default function Home() {
  const [wishes,setWishes]=useState(seedWishes);
  const [composerOpen,setComposerOpen]=useState(false);
  const [logOpen,setLogOpen]=useState(false);
  const [selected,setSelected]=useState<Wish|null>(null);
  const [wishText,setWishText]=useState('');
  const [color,setColor]=useState<Wish['color']>('amber');
  const [ready,setReady]=useState(false);
  const [addPrompt,setAddPrompt]=useState(false);
  const [movingId,setMovingId]=useState<number|null>(null);
  const holdTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const dragRef=useRef<{id:number|null;active:boolean}>({id:null,active:false});
  const stars=useMemo(()=>Array.from({length:76},(_,i)=>({left:`${(i*37.7)%100}%`,top:`${(i*19.3)%66}%`,delay:`${(i%9)*.27}s`,size:i%7===0?2:1})),[]);

  useEffect(()=>{
    try { const saved=localStorage.getItem('qi-yuan-deng-wishes')||localStorage.getItem('yuan-deng-wishes'); if(saved)setWishes(JSON.parse(saved)); } catch {}
    setReady(true);
  },[]);
  useEffect(()=>{ if(ready)localStorage.setItem('qi-yuan-deng-wishes',JSON.stringify(wishes)); },[wishes,ready]);

  function releaseWish(){
    if(!wishText.trim())return;
    const next:Wish={id:Date.now(),text:wishText.trim(),date:new Date().toISOString().slice(0,10),color,x:49,y:62,scale:1};
    setWishes(current=>[next,...current]); setWishText(''); setComposerOpen(false);
    window.setTimeout(()=>setWishes(current=>current.map(w=>w.id===next.id?{...w,x:58,y:31,scale:.86}:w)),80);
  }

  function startHolding(e:React.PointerEvent<HTMLButtonElement>,wish:Wish){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current={id:wish.id,active:false};
    holdTimer.current=setTimeout(()=>{
      dragRef.current.active=true; setMovingId(wish.id);
      if('vibrate' in navigator)navigator.vibrate(18);
    },450);
  }
  function moveLantern(e:React.PointerEvent<HTMLButtonElement>,wish:Wish){
    if(!dragRef.current.active||dragRef.current.id!==wish.id)return;
    const field=e.currentTarget.parentElement?.getBoundingClientRect(); if(!field)return;
    const x=Math.max(5,Math.min(95,((e.clientX-field.left)/field.width)*100));
    const y=Math.max(6,Math.min(86,((e.clientY-field.top)/field.height)*100));
    setWishes(current=>current.map(item=>item.id===wish.id?{...item,x,y}:item));
  }
  function stopHolding(wish:Wish,openOnTap=true){
    if(holdTimer.current)clearTimeout(holdTimer.current);
    const wasMoving=dragRef.current.active;
    dragRef.current={id:null,active:false}; setMovingId(null);
    if(!wasMoving&&openOnTap)setSelected(wish);
  }

  return <main className="wish-app">
    <div className="night-haze"/><div className="stars" aria-hidden="true">{stars.map((s,i)=><i key={i} style={{left:s.left,top:s.top,animationDelay:s.delay,width:s.size,height:s.size}}/>)}</div>
    <div className="moon" aria-hidden="true"/><div className="mountains mountain-back" aria-hidden="true"/><div className="mountains mountain-front" aria-hidden="true"/>
    <div className="river" aria-hidden="true"><i className="river-glint one"/><i className="river-glint two"/><i className="river-glint three"/>{wishes.map(w=><span key={w.id} className={`reflection reflection-${w.color}`} style={{left:`${w.x}%`,'--reflection-scale':w.scale} as React.CSSProperties}/>)}</div>
    <header className="topbar">
      <button className="brand" onClick={()=>{setLogOpen(false);setComposerOpen(false)}} aria-label="返回愿景"><BrandMark/><span><strong>祈愿灯</strong><small>一念入星河</small></span></button>
      <nav><button className="nav-link active"><MoonStar size={16}/>愿景</button><button className="nav-link" onClick={()=>setLogOpen(true)}><ScrollText size={16}/>祈愿簿</button></nav>
    </header>
    <section className="intro"><span className="eyebrow">今夜 · 宜许愿</span><h1>把心愿，<br/>交给远方。</h1><p>灯火会随时光渐远，愿望不会消失。<br/>点击夜空中的灯，便能再次与那天的自己相遇。</p></section>
    <section className="sky-field" aria-label="已放飞的愿望">{wishes.map(w=><button key={w.id} className={`lantern ${movingId===w.id?'moving':''}`} aria-label={`回顾愿望：${w.text}。长按可移动`} onPointerDown={e=>startHolding(e,w)} onPointerMove={e=>moveLantern(e,w)} onPointerUp={()=>stopHolding(w)} onPointerCancel={()=>stopHolding(w,false)} onContextMenu={e=>e.preventDefault()} style={{left:`${w.x}%`,top:`${w.y}%`,'--lamp-scale':w.scale} as React.CSSProperties}><Lamp color={w.color}/></button>)}</section>
    {movingId&&<div className="move-hint" role="status">拖动祈愿灯 · 松手安放</div>}
    <div className={`bottom-action ${addPrompt?'expanded':''}`}><button className="add-button" onClick={()=>setAddPrompt(v=>!v)} aria-expanded={addPrompt} aria-label="打开祈愿入口"><Plus size={25}/></button><button className="release-label" onClick={()=>{setComposerOpen(true);setAddPrompt(false)}} tabIndex={addPrompt?0:-1}>放飞一盏祈愿灯</button><span>已替你珍藏 {wishes.length} 个愿望</span></div>

    {composerOpen&&<div className="veil" onMouseDown={e=>e.target===e.currentTarget&&setComposerOpen(false)}><section className="wish-sheet" role="dialog" aria-modal="true" aria-labelledby="compose-title">
      <button className="close" onClick={()=>setComposerOpen(false)} aria-label="关闭"><X size={18}/></button><span className="sheet-kicker">题愿</span><h2 id="compose-title">今夜，你想放飞什么？</h2><p>落笔之后，祈愿灯将替你带它去往星河深处。</p>
      <Lamp color={color} className="preview-lantern"/><Textarea value={wishText} onChange={e=>setWishText(e.target.value.slice(0,80))} placeholder="愿……" className="wish-input" autoFocus/>
      <div className="compose-footer"><div className="color-picks" aria-label="选择愿灯">{(['amber','red','ivory'] as const).map(item=><button key={item} className={`${item} ${color===item?'chosen':''}`} onClick={()=>setColor(item)} aria-label={`选择${item}愿灯`}/>)}</div><span className="count">{wishText.length}/80</span><Button onClick={releaseWish} disabled={!wishText.trim()} className="confirm-release"><Sparkles size={16}/>写好，放飞</Button></div>
    </section></div>}

    {selected&&<div className="veil" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><article className="memory-card"><button className="close" onClick={()=>setSelected(null)} aria-label="关闭"><X size={18}/></button><span className="sheet-kicker">旧愿 · {selected.date}</span><Lamp color={selected.color} className="memory-lamp"/><blockquote>“{selected.text}”</blockquote><p>这盏灯已在夜空中远行了一段时日。</p><Button variant="outline" onClick={()=>setSelected(null)} className="memory-close">收好这段心愿</Button></article></div>}

    <aside className={`log-panel ${logOpen?'open':''}`} aria-hidden={!logOpen}><div className="log-head"><div><span className="sheet-kicker">祈录</span><h2>祈愿簿</h2></div><button className="close" onClick={()=>setLogOpen(false)} aria-label="关闭祈愿簿"><X size={18}/></button></div><p className="log-summary">一灯一愿，皆有归处。</p><div className="log-list">{wishes.map((w,i)=><button key={w.id} onClick={()=>{setSelected(w);setLogOpen(false)}}><span className={`mini-lamp ${w.color}`}/><time>{w.date.replaceAll('-','.')}</time><p>{w.text}</p><small>{i===0?'刚刚放飞':`已远行 ${Math.max(2,(i+1)*19)} 日`}</small></button>)}</div></aside>
  </main>;
}
