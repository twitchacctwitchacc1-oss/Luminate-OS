/* ===== Stato globale e utilità ===== */
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const S={wifi:1,bt:1,air:0,torch:0,rot:0,br:1,vol:.6,dark:0,bat:87,play:0,tr:0,prog:0,photos:[],open:[],cur:null};
const scr=$('#screen'),ph=$('#phone');

/* ===== Impostazioni condivise (toggle, slider, dark, luminosità) ===== */
function set(k,v){S[k]=v;if(k=='air'&&v)S.wifi=S.bt=0;if((k=='wifi'||k=='bt')&&v)S.air=0;if(k=='br')S.br=Math.max(.15,v);sync()}
function sync(){
  $$('.tb').forEach(b=>b.classList.toggle('on',!!S[b.dataset.t]));
  $$('.sl').forEach(s=>$('i',s).style.height=S[s.dataset.k]*100+'%');
  $$('input[data-k]').forEach(i=>i.checked=!!S[i.dataset.k]);
  $$('input[data-r]').forEach(i=>i.value=S[i.dataset.r]*100);
  ph.classList.toggle('dark',!!S.dark);$('#dim').style.opacity=(1-S.br)*.75;$('#torch').classList.toggle('on',!!S.torch);
  $('#sys').textContent=`${S.air?'✈':'▂▄▆'} ${S.wifi?'WiFi':''} ${S.bat}%`}

/* ===== Navigazione: app, home, switcher, tendine ===== */
function openApp(id,el){
  let w=$('#a-'+id);if(!w){w=document.createElement('div');w.className='app';w.id='a-'+id;$('#appwrap').append(w);APPS[id].init(w)}
  if(el){const r=el.getBoundingClientRect(),s=scr.getBoundingClientRect();w.style.transformOrigin=`${r.left-s.left+r.width/2}px ${r.top-s.top+r.height/2}px`}
  $$('.app.on').forEach(x=>x.classList.remove('on'));w.classList.add('on');S.cur=id;
  if(!S.open.includes(id))S.open.push(id);$('#home').classList.add('away');sw(0);ov(0,0)}
function home(){$$('.app.on').forEach(x=>x.classList.remove('on'));S.cur=null;$('#home').classList.remove('away');sw(0);ov(0,0)}
function sw(on){const s=$('#sw');s.classList.toggle('on',!!on);if(!on)return;
  s.innerHTML=S.open.length?S.open.map(id=>`<div class=cd data-o=${id} style="background:${APPS[id].c}">${APPS[id].i}<small style="color:#fff">${APPS[id].n}</small><b data-x=${id}>✕</b></div>`).join(''):'<p style="margin:auto">Nessuna app aperta</p>'}
const ov=(a,b)=>{$('#shade').classList.toggle('open',!!a);$('#cc').classList.toggle('open',!!b)};
const ovOpen=()=>$('#shade').classList.contains('open')||$('#cc').classList.contains('open');

/* ===== Gesture (swipe) ===== */
let g=null;
scr.addEventListener('pointerdown',e=>{if(e.target.closest('.sl,input[type=range],.n'))return;const r=scr.getBoundingClientRect();g={x:e.clientX-r.left,y:e.clientY-r.top,w:r.width,h:r.height}});
addEventListener('pointerup',e=>{
  if(!g)return;const r=scr.getBoundingClientRect(),{x,y,w,h}=g,dx=e.clientX-r.left-x,dy=e.clientY-r.top-y;g=null;
  if(!$('#lock').classList.contains('up')){if(dy<-60)$('#lock').classList.add('up');return}   // sblocco
  if(Math.abs(dy)<45||Math.abs(dy)<Math.abs(dx))return;
  if(dy<0){if(ovOpen())ov(0,0);else if(y>h-45)$('#sw').classList.contains('on')?home():sw(1)}  // su: chiudi / switcher
  else if(y<50){if(x>w*.6)ov(0,1);else if(x<w*.3&&S.cur)home();else ov(1,0)}                    // giù: CC / home / tendina
});
$('#lock').onclick=()=>$('#lock').classList.add('up');
$('#bar').onclick=home;
$('#island').onclick=()=>{if(ovOpen())ov(0,0);else if(S.cur||$('#sw').classList.contains('on'))home()};

/* ===== Click delegati ===== */
document.addEventListener('click',e=>{const t=e.target;let x;
  if(x=t.closest('[data-app]'))openApp(x.dataset.app,$('.ic',x));
  else if(x=t.closest('.tb'))set(x.dataset.t,S[x.dataset.t]?0:1);
  else if(x=t.closest('[data-x]')){const id=x.dataset.x;S.open=S.open.filter(i=>i!=id);$('#a-'+id)?.remove();sw(1)}
  else if(x=t.closest('[data-o]'))openApp(x.dataset.o);
  else if(t.id=='sw')home()});
document.addEventListener('change',e=>{const k=e.target.dataset.k;if(k)set(k,+e.target.checked)});
document.addEventListener('input',e=>{const k=e.target.dataset.r;if(k)set(k,e.target.value/100)});
$$('.sl').forEach(s=>{const f=e=>{const r=s.getBoundingClientRect();set(s.dataset.k,Math.min(1,Math.max(0,1-(e.clientY-r.top)/r.height)))};
  s.onpointerdown=e=>{s.setPointerCapture(e.pointerId);f(e);s.onpointermove=f};s.onpointerup=()=>s.onpointermove=null});

/* ===== Orologio di sistema, batteria, musica ===== */
let sec=0;
function tick(){const d=new Date(),t=d.toLocaleTimeString('it',{hour:'2-digit',minute:'2-digit'});
  $('#clk').textContent=$('#lt').textContent=$('#bigclk').textContent=t;
  $('#ld').textContent=d.toLocaleDateString('it',{weekday:'long',day:'numeric',month:'long'});
  if(++sec%60==0&&S.bat>1){S.bat--;sync()}
  if(S.play){S.prog++;if(S.prog>=TR[S.tr][2])musicGo(1);$$('.pf').forEach(e=>e.style.width=S.prog/TR[S.tr][2]*100+'%')}
  clockTick()}

/* ===== Avvio ===== */
addEventListener('load',()=>{
  const mk=id=>`<div class=it data-app=${id}><div class=ic style="--c:${APPS[id].c}">${APPS[id].i}</div>${APPS[id].n}</div>`;
  $('#grid').innerHTML=['clk','wea','cal','set'].map(mk).join('');
  $('#dock').innerHTML=['tel','msg','spo','cam'].map(mk).join('');
  sync();refreshMP();tick();setInterval(tick,1000);startNotifications()});
