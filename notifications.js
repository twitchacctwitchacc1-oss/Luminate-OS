/* ===== Notifiche: generazione dinamica, banner, swipe per eliminare ===== */
const NT=[['💬','Messaggi','Marco: Ci vediamo stasera?'],['📞','Telefono','Chiamata persa da Giulia'],['⬇️','Aggiornamento','iOS 18.1 è disponibile'],['💬','Messaggi','Anna: Hai visto la foto?'],['🌦️','Meteo','Pioggia prevista alle 17:00'],['🎵','Spotify','Nuova uscita: Pulse']];
const NL=[];
function renderN(){$('#notifs').innerHTML=NL.length?NL.map((n,i)=>`<div class=n data-i=${i}><span style="font-size:26px">${n.i}</span><div><b>${n.a}</b><small>${n.b} · ${n.t.toLocaleTimeString('it',{hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join(''):'<p style="text-align:center;opacity:.7;margin-top:20px">Nessuna notifica</p>'}
function pushN(n){NL.unshift({...n,t:new Date()});renderN();const b=$('#banner');b.innerHTML=`<b>${n.i} ${n.a}</b><br><small>${n.b}</small>`;b.classList.add('show');clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('show'),3000)}
function startNotifications(){
  const add=()=>{const n=NT[Math.random()*NT.length|0];pushN({i:n[0],a:n[1],b:n[2]})};
  NT.slice(0,3).forEach(n=>NL.push({i:n[0],a:n[1],b:n[2],t:new Date()}));renderN();setInterval(add,30000)}
let nd=null;   // swipe orizzontale per eliminare
document.addEventListener('pointerdown',e=>{const n=e.target.closest('.n');if(n)nd={n,x:e.clientX}});
document.addEventListener('pointermove',e=>{if(nd)nd.n.style.transform=`translateX(${e.clientX-nd.x}px)`});
document.addEventListener('pointerup',e=>{if(!nd)return;const {n}=nd,dx=e.clientX-nd.x;nd=null;
  if(Math.abs(dx)>80){n.style.transform=`translateX(${dx>0?400:-400}px)`;n.style.opacity=0;setTimeout(()=>{NL.splice(+n.dataset.i,1);renderN()},300)}else n.style.transform=''});
