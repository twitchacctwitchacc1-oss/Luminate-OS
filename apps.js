/* ===== Musica condivisa (Spotify, pannello di controllo, tendina) ===== */
const TR=[['Midnight Drive','Neon Waves',184,'#FF3B30'],['Golden Hour','Lila',212,'#FF9500'],['Ocean Eyes','Blue Mono',196,'#007AFF'],['Pulse','Kairo',171,'#34C759']];
const mp=()=>{const t=TR[S.tr];return `<div class=mpi style="--c:${t[3]}"><i class=cv></i><div class=mt><b>${t[0]}</b><small>${t[1]}</small><div class=pb><i class=pf style="width:${S.prog/t[2]*100}%"></i></div></div><span data-a=prev>⏮</span><span data-a=play>${S.play?'⏸':'▶️'}</span><span data-a=next>⏭</span></div>`};
const refreshMP=()=>$$('.mp').forEach(e=>e.innerHTML=mp());
const musicGo=d=>{S.tr=(S.tr+d+TR.length)%TR.length;S.prog=0;refreshMP()};
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(!a)return;
  if(a=='play'){S.play=!S.play;refreshMP()}else musicGo(a=='next'?1:-1)});
const fmt=s=>`${String(s/60|0).padStart(2,0)}:${String(s%60|0).padStart(2,0)}`;
function clockTick(){const d=new Date(),s=d.getSeconds(),m=d.getMinutes()+s/60,h=d.getHours()%12+m/60;
  [['hh',h*30],['mh',m*6],['sh',s*6]].forEach(([i,a])=>{const e=$('#'+i);e&&e.setAttribute('transform',`rotate(${a} 100 100)`)})}

/* ===== App ===== */
const APPS={
/* --- Messaggi --- */
msg:{n:'Messaggi',i:'💬',c:'linear-gradient(#5be26a,#1fb83e)',init(w){
  const C=[['Marco','🧑','Ci vediamo stasera?','18:42'],['Anna','👩','Hai visto la foto?','17:05'],['Mamma','👵','Chiamami quando puoi','Ieri'],['Luca','🧔','Grazie mille!','Lun']].map(([n,a,l,t])=>({n,a,t,m:[{me:0,x:l}]}));
  const R=['Perfetto 👍','Ahah davvero?','Ok, ci sentiamo dopo','Dammi cinque minuti','Che bella idea!','😂😂','Non vedo l’ora'];let cur=0;
  const list=()=>{w.innerHTML=`<h1>Messaggi</h1><div class="card body">${C.map((c,i)=>`<div class=row data-c=${i}><span class=av>${c.a}</span><div style=flex:1><b>${c.n}</b><br><small>${c.m.at(-1).x}</small></div><small>${c.t}</small></div>`).join('')}</div>`};
  const chat=i=>{cur=i;const c=C[i];w.innerHTML=`<div class=nav><a data-back>‹ Chat</a><b>${c.n}</b><span></span></div><div class="body msgs">${c.m.map(m=>`<div class="b ${m.me?'me':''}">${m.x}</div>`).join('')}</div><div class=inp><span>🎙</span><input placeholder=iMessage><span data-e>😊</span><span data-s style=color:var(--blue)>⬆️</span></div>`;
    const b=$('.body',w),inp=$('input',w);b.scrollTop=1e5;
    const add=(me,x)=>{c.m.push({me,x});b.insertAdjacentHTML('beforeend',`<div class="b ${me?'me':''}">${x}</div>`);b.scrollTop=1e5};
    w.send=()=>{if(!inp.value.trim())return;add(1,inp.value);inp.value='';setTimeout(()=>add(0,R[Math.random()*R.length|0]),1000+Math.random()*1000)};
    w.emo=()=>inp.value+='😊';inp.onkeydown=e=>e.key=='Enter'&&w.send()};
  w.onclick=e=>{const t=e.target,c=t.closest('[data-c]');if(c)chat(+c.dataset.c);else if(t.closest('[data-back]'))list();else if(t.closest('[data-s]'))w.send();else if(t.closest('[data-e]'))w.emo()};list()}},
/* --- Chiamate --- */
tel:{n:'Telefono',i:'📞',c:'linear-gradient(#5be26a,#1fb83e)',init(w){
  let n='',T=0,iv;const H=[['Giulia','missed','09:12'],['Marco','in','Ieri'],['+39 02 1234567','out','Lun']];
  const pad=()=>{w.innerHTML=`<div class=disp>${n||'&nbsp;'}</div><div class=pad>${[...'123456789*0#'].map(k=>`<button data-k=${k}>${k}</button>`).join('')}</div><div style=text-align:center><button class=call data-call>📞</button></div><h3>Recenti</h3><div class="card body">${H.map(h=>`<div class=row style="color:${h[1]=='missed'?'#FF3B30':'inherit'}"><span>${h[1]=='out'?'↗':'↙'}</span><b style=flex:1>${h[0]}</b><small>${h[2]}</small></div>`).join('')}</div>`};
  w.onclick=e=>{const k=e.target.closest('[data-k]'),t=e.target;
    if(k){n+=k.dataset.k;$('.disp',w).textContent=n}
    else if(t.closest('[data-call]')){T=0;w.innerHTML=`<div class=incall><h2>${n||'Sconosciuto'}</h2><p id=ct>Chiamata in corso...</p><button class=call data-end style=background:#FF3B30>📵</button></div>`;
      iv=setInterval(()=>$('#ct',w).textContent=fmt(++T),1000)}
    else if(t.closest('[data-end]')){clearInterval(iv);H.unshift([n||'Numero sconosciuto','out','Ora']);n='';pad()}};pad()}},
/* --- Spotify --- */
spo:{n:'Spotify',i:'🎧',c:'linear-gradient(#2ee66d,#0b7d36)',init(w){w.classList.add('dk');
  w.innerHTML=`<h1>La tua libreria</h1><div class="card body">${TR.map((t,i)=>`<div class=row data-t=${i}><i class=cv style=--c:${t[3]}></i><div style=flex:1><b>${t[0]}</b><br><small>${t[1]}</small></div><small>${fmt(t[2])}</small></div>`).join('')}</div><div class="mp card"></div>`;
  refreshMP();w.onclick=e=>{const r=e.target.closest('[data-t]');if(r){S.tr=+r.dataset.t;S.prog=0;S.play=1;refreshMP()}}}},
/* --- Fotocamera --- */
cam:{n:'Fotocamera',i:'📷',c:'linear-gradient(#777,#222)',init(w){w.classList.add('dk');
  const v=()=>w.innerHTML=`<div class=vf><i></i></div><div class=cb><span class=th data-g>🖼</span><button class=sh data-sh></button><span style=width:30px></span></div>`;
  const gal=()=>w.innerHTML=`<div class=nav><a data-back>‹ Fotocamera</a><b>Foto</b><span></span></div><div class="body gal">${S.photos.map(c=>`<i style="background:${c}"></i>`).join('')||'<p>Nessuna foto: scatta la prima.</p>'}</div>`;
  w.onclick=e=>{const t=e.target;if(t.closest('[data-sh]')){const f=$('#flash');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),120);
      S.photos.unshift(`linear-gradient(${Math.random()*360|0}deg,hsl(${Math.random()*360|0},70%,60%),hsl(${Math.random()*360|0},70%,35%))`)}
    else if(t.closest('[data-g]'))gal();else if(t.closest('[data-back]'))v()};v()}},
/* --- Impostazioni --- */
set:{n:'Impostazioni',i:'⚙️',c:'linear-gradient(#aaa,#555)',init(w){
  const sw=k=>`<label class=sw><input type=checkbox data-k=${k}><i></i></label>`,nav=t=>`<div class=nav><a data-back>‹ Impostazioni</a><b>${t}</b><span></span></div>`;
  const pg={'':()=>`<h1>Impostazioni</h1><div class=card>${[['wifi','📶','#007AFF','Wi-Fi'],['bt','🔷','#007AFF','Bluetooth'],['bat','🔋','#34C759','Batteria'],['disp','☀️','#5856D6','Display'],['snd','🔊','#FF3B30','Suoni']].map(([k,i,c,n])=>`<div class=row data-p=${k}><span class=si style=background:${c}>${i}</span><b style=flex:1>${n}</b>›</div>`).join('')}</div>`,
    wifi:()=>nav('Wi-Fi')+`<div class=card><div class=row><b style=flex:1>Wi-Fi</b>${sw('wifi')}</div></div><div class=card>${['Casa-5G ✓','FRITZ!Box 7590','Vodafone-Guest','TIM-12345'].map(n=>`<div class=row>📶 ${n}</div>`).join('')}</div>`,
    bt:()=>nav('Bluetooth')+`<div class=card><div class=row><b style=flex:1>Bluetooth</b>${sw('bt')}</div></div><div class=card>${['AirPods Pro','Auto','Altoparlante JBL'].map(n=>`<div class=row>🔷 ${n}</div>`).join('')}</div>`,
    bat:()=>nav('Batteria')+`<h1 style=text-align:center>${S.bat}%</h1><div class="card bars">${[60,80,45,90,70,55,S.bat].map(h=>`<i style=height:${h}%></i>`).join('')}</div><small>Ultimi 7 giorni</small>`,
    disp:()=>nav('Display')+`<div class=card><div class=row><span>☀️</span><input type=range data-r=br min=15 max=100></div><div class=row><b style=flex:1>Modalità scura</b>${sw('dark')}</div></div>`,
    snd:()=>nav('Suoni')+`<div class=card><div class=row><span>🔊</span><input type=range data-r=vol min=0 max=100></div></div>`};
  const go=p=>{w.innerHTML=pg[p]();sync()};
  w.onclick=e=>{const p=e.target.closest('[data-p]');if(p)go(p.dataset.p);else if(e.target.closest('[data-back]'))go('')};go('')}},
/* --- Orologio --- */
clk:{n:'Orologio',i:'🕐',c:'linear-gradient(#333,#000)',init(w){w.classList.add('dk');
  let tab=0,tiv,siv,acc=0,t0=0,run=0;const fs=ms=>fmt(ms/1000)+'.'+String(ms%1000/10|0).padStart(2,0);
  const r=()=>{let h='';
    if(tab==0)h=`<svg viewBox="0 0 200 200" stroke="currentColor"><circle class=face cx=100 cy=100 r=96 stroke-width=2 />${[...Array(12)].map((_,i)=>`<line x1=100 y1=8 x2=100 y2=17 stroke-width=3 transform="rotate(${i*30} 100 100)"/>`).join('')}<line id=hh x1=100 y1=100 x2=100 y2=55 stroke-width=5 stroke-linecap=round /><line id=mh x1=100 y1=100 x2=100 y2=30 stroke-width=3 stroke-linecap=round /><line id=sh x1=100 y1=110 x2=100 y2=20 stroke="#FF9500" stroke-width=2 /></svg>`;
    if(tab==1)h=`<div class=disp id=td>01:00</div><div style=text-align:center><input id=tm type=number min=1 value=1 style="width:60px;font-size:20px"> min <button class=btn data-ts>Avvia</button></div>`;
    if(tab==2)h=`<div class=disp id=sd>${fs(acc)}</div><div style=text-align:center><button class=btn data-ss>Start / Stop</button><button class=btn style=background:#555 data-sr>Reset</button></div>`;
    if(tab==3)h=`<h2>Sveglie</h2><div class=card>${[['07:00','Lavoro'],['08:30','Weekend'],['22:45','Dormire']].map(a=>`<div class=row><div style=flex:1><b style=font-size:28px>${a[0]}</b><br><small>${a[1]}</small></div><label class=sw><input type=checkbox ${a[0]=='07:00'?'checked':''}><i></i></label></div>`).join('')}</div>`;
    w.innerHTML=`<div class=body>${h}</div><div class=tbar>${['Orologio','Timer','Cronometro','Sveglia'].map((t,i)=>`<span class="${i==tab?'a':''}" data-tab=${i}>${t}</span>`).join('')}</div>`;clockTick()};
  w.onclick=e=>{const t=e.target,x=t.closest('[data-tab]');
    if(x){tab=+x.dataset.tab;r()}
    else if(t.closest('[data-ts]')){clearInterval(tiv);let T=Math.max(1,+$('#tm',w).value)*60;const d=$('#td',w);d.textContent=fmt(T);
      tiv=setInterval(()=>{d.textContent=fmt(--T);if(T<=0){clearInterval(tiv);d.textContent='Fine!';pushN({i:'⏱',a:'Timer',b:'Timer scaduto'})}},1000)}
    else if(t.closest('[data-ss]')){run=!run;if(run){t0=Date.now()-acc;siv=setInterval(()=>{acc=Date.now()-t0;const d=$('#sd',w);d&&(d.textContent=fs(acc))},50)}else clearInterval(siv)}
    else if(t.closest('[data-sr]')){clearInterval(siv);run=0;acc=0;r()}};r()}},
/* --- Meteo --- */
wea:{n:'Meteo',i:'⛅',c:'linear-gradient(#4facfe,#00c6fb)',init(w){w.classList.add('dk');w.style.background='linear-gradient(#4facfe,#2a6fd6)';
  const I=['☀️','⛅','🌧️','🌤️','⛈️'],L=['Soleggiato','Nuvoloso','Pioggia','Sereno','Temporale'],D=['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],t=16+Math.random()*10|0,i=Math.random()*5|0,d=new Date();
  w.innerHTML=`<div class=wt><h2>Milano</h2><div class=big>${I[i]}</div><h1 style=font-size:72px;font-weight:200>${t}°</h1><p>${L[i]}</p></div><div class="card hs" style=margin-top:30px>${[1,2,3,4,5].map(k=>`<div><small>${D[(d.getDay()+k)%7]}</small><div style=font-size:30px>${I[Math.random()*5|0]}</div>${t+(Math.random()*8-4|0)}°</div>`).join('')}</div>`}},
/* --- Calendario --- */
cal:{n:'Calendario',i:'📅',c:'linear-gradient(#fff,#ddd)',init(w){
  let d=new Date();d.setDate(1);const E={3:'Riunione team',12:'Compleanno Anna',18:'Dentista',25:'Cena con Marco'};
  const r=()=>{const y=d.getFullYear(),m=d.getMonth(),off=(d.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=new Date();
    w.innerHTML=`<div class=nav><a data-n=-1>‹</a><b style=text-transform:capitalize>${d.toLocaleString('it',{month:'long'})} ${y}</b><a data-n=1>›</a></div><div class=cg>${[...'LMMGVSD'].map(x=>`<small>${x}</small>`).join('')}${'<i></i>'.repeat(off)}${Array.from({length:n},(_,i)=>`<span class="${E[i+1]?'ev ':''}${td.getDate()==i+1&&td.getMonth()==m&&td.getFullYear()==y?'td':''}">${i+1}</span>`).join('')}</div><h3>Eventi</h3><div class="card body">${Object.entries(E).map(([k,v])=>`<div class=row><b>${k}</b> ${v}</div>`).join('')}</div>`};
  w.onclick=e=>{const n=e.target.closest('[data-n]');if(n){d.setMonth(d.getMonth()+ +n.dataset.n);r()}};r()}}
};
