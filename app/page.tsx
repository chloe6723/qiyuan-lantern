'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MoonStar, Pencil, Plus, ScrollText, Sparkles, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type WishKind = 'sky'|'water';
type Wish = { id:number; text:string; date:string; color:'amber'|'red'|'ivory'; x:number; y:number; scale:number; kind?:WishKind };
const seedWishes: Wish[] = [
  { id:1,text:'愿家人常安，岁岁无忧。',date:'2026-08-18',color:'amber',x:23,y:26,scale:.68 },
  { id:2,text:'愿我有勇气走向真正喜欢的生活。',date:'2026-07-02',color:'red',x:72,y:18,scale:.52 },
  { id:3,text:'愿这一程所遇皆温柔。',date:'2026-06-11',color:'ivory',x:84,y:39,scale:.4 },
  { id:4,text:'愿未完的故事，终有好结局。',date:'2026-03-26',color:'amber',x:37,y:13,scale:.31 },
];
const WATER_SAFE_AREA={minX:8,maxX:66,minY:24,maxY:78};
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const keepLotusOffBoat=(wish:Wish):Wish=>wish.kind==='water'?{...wish,x:clamp(wish.x,WATER_SAFE_AREA.minX,WATER_SAFE_AREA.maxX),y:clamp(wish.y,WATER_SAFE_AREA.minY,WATER_SAFE_AREA.maxY)}:wish;

function Lamp({color, className=''}:{color:Wish['color'];className?:string}) {
  return <span className={`lamp lamp-${color} ${className}`}><i className="lamp-cap"/><i className="lamp-body"><b/></i><i className="lamp-tail"/></span>;
}

function LotusLamp({color, className=''}:{color:Wish['color'];className?:string}) {
  return <span className={`lotus-lamp lotus-${color} ${className}`} aria-hidden="true"/>;
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><img src="/qiyuan-seal-logo.png" alt=""/></span>;
}

export default function Home() {
  const [wishes,setWishes]=useState(seedWishes);
  const [composerOpen,setComposerOpen]=useState(false);
  const [logOpen,setLogOpen]=useState(false);
  const [selected,setSelected]=useState<Wish|null>(null);
  const [wishText,setWishText]=useState('');
  const [color,setColor]=useState<Wish['color']>('amber');
  const [kind,setKind]=useState<WishKind>('sky');
  const [ready,setReady]=useState(false);
  const [addPrompt,setAddPrompt]=useState(false);
  const [movingId,setMovingId]=useState<number|null>(null);
  const [logActionId,setLogActionId]=useState<number|null>(null);
  const [editingWish,setEditingWish]=useState<Wish|null>(null);
  const [editText,setEditText]=useState('');
  const holdTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const logHoldTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const logLongPress=useRef(false);
  const dragRef=useRef<{id:number|null;active:boolean}>({id:null,active:false});
  const stars=useMemo(()=>Array.from({length:76},(_,i)=>({left:`${(i*37.7)%100}%`,top:`${(i*19.3)%66}%`,delay:`${(i%9)*.27}s`,size:i%7===0?2:1})),[]);

  useEffect(()=>{
    try { const saved=localStorage.getItem('qi-yuan-deng-wishes')||localStorage.getItem('yuan-deng-wishes'); if(saved)setWishes((JSON.parse(saved) as Wish[]).map(keepLotusOffBoat)); } catch {}
    setReady(true);
  },[]);
  useEffect(()=>{ if(ready)localStorage.setItem('qi-yuan-deng-wishes',JSON.stringify(wishes)); },[wishes,ready]);

  function releaseWish(){
    if(!wishText.trim())return;
    const next:Wish={id:Date.now(),text:wishText.trim(),date:new Date().toISOString().slice(0,10),color,kind,x:49,y:kind==='sky'?62:58,scale:1};
    setWishes(current=>[next,...current]); setWishText(''); setComposerOpen(false);
    window.setTimeout(()=>setWishes(current=>current.map(w=>w.id===next.id?{...w,x:kind==='sky'?58:62,y:kind==='sky'?31:48,scale:.86}:w)),80);
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
    const rawX=((e.clientX-field.left)/field.width)*100;
    const rawY=((e.clientY-field.top)/field.height)*100;
    const x=wish.kind==='water'?clamp(rawX,WATER_SAFE_AREA.minX,WATER_SAFE_AREA.maxX):clamp(rawX,5,95);
    const y=wish.kind==='water'?clamp(rawY,WATER_SAFE_AREA.minY,WATER_SAFE_AREA.maxY):clamp(rawY,6,86);
    setWishes(current=>current.map(item=>item.id===wish.id?{...item,x,y}:item));
  }
  function stopHolding(wish:Wish,openOnTap=true){
    if(holdTimer.current)clearTimeout(holdTimer.current);
    const wasMoving=dragRef.current.active;
    dragRef.current={id:null,active:false}; setMovingId(null);
    if(!wasMoving&&openOnTap)setSelected(wish);
  }
  function startLogHold(wish:Wish){
    logLongPress.current=false;
    if(logHoldTimer.current)clearTimeout(logHoldTimer.current);
    logHoldTimer.current=setTimeout(()=>{
      logLongPress.current=true;
      setLogActionId(wish.id);
      if('vibrate' in navigator)navigator.vibrate(18);
    },450);
  }
  function stopLogHold(){
    if(logHoldTimer.current)clearTimeout(logHoldTimer.current);
    logHoldTimer.current=null;
  }
  function openLogWish(wish:Wish){
    if(logLongPress.current){logLongPress.current=false;return;}
    setSelected(wish);setLogOpen(false);setLogActionId(null);
  }
  function beginEdit(wish:Wish){
    setEditingWish(wish);setEditText(wish.text);setLogActionId(null);
  }
  function saveEdit(){
    if(!editingWish||!editText.trim())return;
    const text=editText.trim();
    setWishes(current=>current.map(w=>w.id===editingWish.id?{...w,text}:w));
    setSelected(current=>current?.id===editingWish.id?{...current,text}:current);
    setEditingWish(null);setEditText('');
  }
  function deleteWish(id:number){
    setWishes(current=>current.filter(w=>w.id!==id));
    setSelected(current=>current?.id===id?null:current);
    setLogActionId(null);
  }

  return <main className="wish-app">
    <div className="night-haze"/><div className="stars" aria-hidden="true">{stars.map((s,i)=><i key={i} style={{left:s.left,top:s.top,animationDelay:s.delay,width:s.size,height:s.size}}/>)}</div>
    <img className="moon-phase-gif" src="/moon-phase-textured-loop.gif" alt="" aria-hidden="true"/>
    <div className="ambient-lanterns" aria-hidden="true">{[
      [39,13,.14,'amber'],[51,7,.21,'red'],[65,22,.12,'amber'],[80,10,.18,'amber'],[94,28,.13,'red'],
      [45,38,.18,'amber'],[59,27,.12,'amber'],[74,45,.22,'amber'],[87,33,.15,'red'],[96,52,.11,'amber'],
      [36,57,.13,'red'],[54,50,.23,'amber'],[68,62,.15,'amber'],[83,55,.12,'amber'],[92,67,.20,'red'],[71,5,.10,'amber']
    ].map(([left,top,scale,tone],i)=><span key={i} style={{left:`${left}%`,top:`${top}%`,transform:`scale(${scale})`,animationDelay:`-${i*.83}s`}}><Lamp color={tone as Wish['color']}/></span>)}</div>
    <div className="river" aria-hidden="true"><i className="river-glint one"/><i className="river-glint two"/><i className="river-glint three"/>{wishes.filter(w=>(w.kind??'sky')==='sky').map(w=><span key={w.id} className={`reflection reflection-${w.color}`} style={{left:`${w.x}%`,'--reflection-scale':w.scale} as React.CSSProperties}/>)}</div>
    <header className="topbar">
      <button className="brand" onClick={()=>{setLogOpen(false);setComposerOpen(false)}} aria-label="返回愿景"><BrandMark/><span><strong>祈愿灯</strong><small>一念入星河</small></span></button>
      <nav><button className="nav-link active"><MoonStar size={16}/>愿景</button><button className="nav-link" onClick={()=>setLogOpen(true)}><ScrollText size={16}/>祈愿簿</button></nav>
    </header>
    <section className="intro"><span className="eyebrow">今夜 · 宜许愿</span><h1>把心愿，<br/>交给远方。</h1><p>灯火会随时光渐远，愿望不会消失。<br/>点击夜空中的灯，便能再次与那天的自己相遇。</p></section>
    <section className="sky-field" aria-label="已放飞的祈愿灯">{wishes.filter(w=>(w.kind??'sky')==='sky').map(w=><button key={w.id} className={`lantern ${movingId===w.id?'moving':''}`} aria-label={`回顾愿望：${w.text}。长按可移动`} onPointerDown={e=>startHolding(e,w)} onPointerMove={e=>moveLantern(e,w)} onPointerUp={()=>stopHolding(w)} onPointerCancel={()=>stopHolding(w,false)} onContextMenu={e=>e.preventDefault()} style={{left:`${w.x}%`,top:`${w.y}%`,'--lamp-scale':w.scale} as React.CSSProperties}><Lamp color={w.color}/></button>)}</section>
    <section className="water-field" aria-label="已放流的莲花灯"><div className="ambient-lotuses" aria-hidden="true">{[
      ['18%', '55%', .42, 'ivory'],['52%','39%',.36,'amber']
    ].map(([left,top,scale,tone],i)=><span key={i} style={{left,top,transform:`translate(-50%,-50%) scale(${scale})`,animationDelay:`-${i*1.3}s`}}><i className="lotus-ripple"/><LotusLamp color={tone as Wish['color']}/></span>)}</div>{wishes.filter(w=>w.kind==='water').map(w=><button key={w.id} className={`floating-lotus ${movingId===w.id?'moving':''}`} aria-label={`回顾愿望：${w.text}。长按可移动`} onPointerDown={e=>startHolding(e,w)} onPointerMove={e=>moveLantern(e,w)} onPointerUp={()=>stopHolding(w)} onPointerCancel={()=>stopHolding(w,false)} onContextMenu={e=>e.preventDefault()} style={{left:`${w.x}%`,top:`${w.y}%`,'--lamp-scale':w.scale} as React.CSSProperties}><i className="lotus-ripple"/><LotusLamp color={w.color}/></button>)}</section>
    {movingId&&<div className="move-hint" role="status">拖动祈愿灯 · 松手安放</div>}
    <div className={`bottom-action ${addPrompt?'expanded':''}`}><button className="add-button" onClick={()=>setAddPrompt(v=>!v)} aria-expanded={addPrompt} aria-label="打开祈愿入口"><Plus size={25}/></button><div className="release-choices"><button className="release-label" onClick={()=>{setKind('sky');setComposerOpen(true);setAddPrompt(false)}} tabIndex={addPrompt?0:-1}>放飞一盏孔明灯</button><button className="release-label lotus-release" onClick={()=>{setKind('water');setComposerOpen(true);setAddPrompt(false)}} tabIndex={addPrompt?0:-1}>放流一盏莲花灯</button></div><span>已替你珍藏 {wishes.length} 个愿望</span></div>

    {composerOpen&&<div className="veil" onMouseDown={e=>e.target===e.currentTarget&&setComposerOpen(false)}><section className="wish-sheet" role="dialog" aria-modal="true" aria-labelledby="compose-title">
      <button className="close" onClick={()=>setComposerOpen(false)} aria-label="关闭"><X size={18}/></button><span className="sheet-kicker">题愿</span><h2 id="compose-title">今夜，你想把心愿交给哪里？</h2><p>{kind==='sky'?'让它随风升起，去往星河深处。':'让它顺水而行，在粼粼灯影中远游。'}</p>
      <div className="kind-picks" aria-label="选择祈愿方式"><button className={kind==='sky'?'chosen':''} onClick={()=>setKind('sky')}>孔明灯 · 放飞</button><button className={kind==='water'?'chosen':''} onClick={()=>setKind('water')}>莲花灯 · 放流</button></div>
      <div className="wish-preview">{kind==='sky'?<Lamp color={color} className="preview-lantern"/>:<LotusLamp color={color} className="preview-lotus"/>}</div><Textarea value={wishText} onChange={e=>setWishText(e.target.value.slice(0,80))} placeholder="愿……" className="wish-input" autoFocus/>
      <div className="compose-footer"><div className="color-picks" aria-label="选择愿灯样式">{(['amber','red','ivory'] as const).map(item=><button key={item} className={`${item} ${color===item?'chosen':''}`} onClick={()=>setColor(item)} aria-label={`选择${item}愿灯`}/>)}</div><span className="count">{wishText.length}/80</span><Button onClick={releaseWish} disabled={!wishText.trim()} className="confirm-release"><Sparkles size={16}/>写好，{kind==='sky'?'放飞':'放流'}</Button></div>
    </section></div>}

    {selected&&<div className="veil" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><article className="memory-card"><button className="close" onClick={()=>setSelected(null)} aria-label="关闭"><X size={18}/></button><span className="sheet-kicker">旧愿 · {selected.date}</span>{selected.kind==='water'?<LotusLamp color={selected.color} className="memory-lotus"/>:<Lamp color={selected.color} className="memory-lamp"/>}<blockquote>“{selected.text}”</blockquote><p>这盏灯已{selected.kind==='water'?'顺水':'乘风'}远行了一段时日。</p><Button variant="outline" onClick={()=>setSelected(null)} className="memory-close">收好这段心愿</Button></article></div>}

    {editingWish&&<div className="veil" onMouseDown={e=>e.target===e.currentTarget&&setEditingWish(null)}><section className="wish-sheet edit-sheet" role="dialog" aria-modal="true" aria-labelledby="edit-title"><i className="dunhuang-ornament" aria-hidden="true"/><i className="corner-flora corner-tl" aria-hidden="true"/><i className="corner-flora corner-tr" aria-hidden="true"/><i className="corner-flora corner-bl" aria-hidden="true"/><i className="corner-flora corner-br" aria-hidden="true"/><button className="close" onClick={()=>setEditingWish(null)} aria-label="合上旧愿"><X size={18}/></button><span className="sheet-kicker">旧愿续录 · {editingWish.date.replaceAll('-',' · ')}</span><h2 id="edit-title">旧愿重题</h2><p className="edit-prologue">一念未改，惟将心语重书。</p><Textarea value={editText} onChange={e=>setEditText(e.target.value.slice(0,80))} placeholder="愿将此念，重书于灯……" className="wish-input edit-input" autoFocus/><div className="edit-footer"><span className="count">余墨 {80-editText.length}</span><Button onClick={saveEdit} disabled={!editText.trim()} className="confirm-release edit-confirm"><Pencil size={15}/>落笔封愿</Button></div></section></div>}

    <aside className={`log-panel ${logOpen?'open':''}`} aria-hidden={!logOpen}><div className="log-head"><div><span className="sheet-kicker">祈录</span><h2>祈愿簿</h2></div><button className="close" onClick={()=>setLogOpen(false)} aria-label="关闭祈愿簿"><X size={18}/></button></div><p className="log-summary">一灯一愿，皆有归处。</p><div className="log-list">{wishes.map((w,i)=><article key={w.id} className={`log-entry ${logActionId===w.id?'actions-open':''}`}><button className="log-entry-main" onPointerDown={()=>startLogHold(w)} onPointerUp={()=>{stopLogHold();openLogWish(w)}} onPointerCancel={stopLogHold} onPointerLeave={stopLogHold} onContextMenu={e=>e.preventDefault()}><span className={`mini-lamp ${w.kind==='water'?'lotus-mini':''} ${w.color}`}/><time>{w.date.replaceAll('-','.')}</time><p>{w.text}</p><small>{i===0?`刚刚${w.kind==='water'?'放流':'放飞'}`:`已远行 ${Math.max(2,(i+1)*19)} 日 · ${w.kind==='water'?'莲花灯':'孔明灯'}`}</small></button><span className="log-entry-actions"><button onClick={()=>beginEdit(w)} aria-label="修改愿望"><Pencil size={15}/></button><button className="delete-action" onClick={()=>deleteWish(w.id)} aria-label="删除愿望"><Trash2 size={15}/></button></span></article>)}</div></aside>
  </main>;
}
