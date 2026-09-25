const NS='http://www.w3.org/2000/svg';
const node=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text)n.textContent=text;return n;};
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('reduced-experience');
function animateRoutes(host,paths,container){
 let frame=0,visible=false,paused=false,elapsed=0,last=0;
 const button=host.parentElement.querySelector('.diagram-motion');
 const particles=paths.map((path,i)=>{const p=node('rect',{width:7,height:7,rx:2,fill:path.classList.contains('information')?'#167a72':'#b24c66'});container.append(p);return {path,p,length:path.getTotalLength(),phase:i*.18};});
 function draw(now){frame=0;if(!visible||document.hidden||paused||reduced()){last=0;return;}if(last)elapsed+=Math.min(60,now-last);last=now;particles.forEach(({path,p,length,phase})=>{const at=path.getPointAtLength(((elapsed/6500+phase)%1)*length);p.setAttribute('x',at.x-3.5);p.setAttribute('y',at.y-3.5);});frame=requestAnimationFrame(draw);}
 const request=()=>{if(!frame&&visible&&!paused&&!document.hidden&&!reduced())frame=requestAnimationFrame(draw);};
 particles.forEach(({path,p,length,phase})=>{const at=path.getPointAtLength(phase%1*length);p.setAttribute('x',at.x);p.setAttribute('y',at.y);});
 const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0;last=0;}});observer.observe(host);
 const visibility=()=>{last=0;request();};document.addEventListener('visibilitychange',visibility);
 const onPreference=()=>{if(button){button.disabled=reduced();button.textContent=reduced()?'Animations réduites':paused?'Animer les flux':'Mettre les flux en pause';}if(reduced()){cancelAnimationFrame(frame);frame=0;last=0;}request();};
 document.addEventListener('portfolio-motion-change',onPreference);
 const click=()=>{paused=!paused;button.setAttribute('aria-pressed',String(!paused));button.textContent=paused?'Animer les flux':'Mettre les flux en pause';if(paused){cancelAnimationFrame(frame);frame=0;last=0;}else request();};
 button?.setAttribute('aria-pressed','true');if(button)button.textContent='Mettre les flux en pause';button?.addEventListener('click',click);onPreference();
 return ()=>{cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('portfolio-motion-change',onPreference);button?.removeEventListener('click',click);container.replaceChildren();};
}
const map=document.querySelector('#logistics-map');
if(map){
 const routes=document.querySelector('#logistics-routes'),buildings=document.querySelector('#logistics-buildings'),parcels=document.querySelector('#logistics-parcels');let stop=()=>{};
 const france=[349,160],shops=[[142,120],[110,220],[176,359],[197,453],[361,235],[425,338],[660,270],[704,394],[625,140]];
 const hubsC=[[139,174],[190,366],[399,275],[624,265],[506,166]];
 function building(pos,type,label,anchor='middle'){
  const [x,y]=pos,g=node('g',{transform:`translate(${x} ${y})`,class:`logistics-node ${type}`});
  g.append(node('circle',{r:type==='shop'?11:17,fill:type==='factory'?'#783249':type==='shop'?'#f8f0eb':'#fff',stroke:type==='warehouse'?'#167a72':'#963854','stroke-width':2}));
  if(type==='shop'){g.append(node('path',{d:'M-5 -3H5V5H-5ZM-6 -3L-4 -7H4L6 -3',fill:'none',stroke:'#963854','stroke-width':1.5}));}
  else{g.append(node('path',{d:'M-10 7V-5L0 -11L10 -5V7ZM-4 7V0H4V7',fill:'none',stroke:type==='factory'?'white':type==='existing'?'#354458':'#167a72','stroke-width':2}));}
  if(label){const text=node('text',{x:anchor==='start'?21:anchor==='end'?-21:0,y:anchor==='middle'?32:4,'text-anchor':anchor,class:'map-label'},label);g.append(text);}
  buildings.append(g);
 }
 function route(from,to,info=false){const a=info?to:from,b=info?from:to;const curve=Math.min(95,Math.abs(a[0]-b[0])*.25+24);const d=`M${a[0]} ${a[1]}Q${(a[0]+b[0])/2} ${(a[1]+b[1])/2-curve-(info?12:0)} ${b[0]} ${b[1]}`;const path=node('path',{d,fill:'none',class:info?'supply-route information':'supply-route','marker-end':info?'url(#info-arrow)':'url(#cargo-arrow)'});routes.append(path);return path;}
 function render(state){stop();routes.replaceChildren();buildings.replaceChildren();let paths=[];
  building(france,'factory','France','start');
  if(state==='before'){building(hubsC[4],'existing','Entrepôt existant');paths.push(route(france,hubsC[4]));shops.forEach((p,i)=>{building(p,'shop');paths.push(route(i>=6?hubsC[4]:france,p));});}
  if(state==='warehouses'){
   hubsC.forEach((p,i)=>{building(p,i===4?'existing':'warehouse',i===4?'Entrepôt existant':'');paths.push(route(france,p),route(france,p,true));});
   shops.forEach((p,i)=>{building(p,'shop');paths.push(route(hubsC[[0,0,1,1,2,2,3,3,4][i]],p));});
  }
  if(state==='hubs'){
   const hubs=[[[205,190],'New York · 60%'],[[232,408],'São Paulo · 25%'],[[188,168],'Toronto · 15%']];
   hubs.forEach(([p,label],i)=>{building(p,'warehouse',label,i===2?'end':'start');paths.push(route(france,p));});
  }
  const copy={before:['Un stock dispersé dans les boutiques','Le diagnostic présenté pour les produits C décrit une usine et un entrepôt en France, une distribution mondiale et des stocks importants en magasins.','France → boutiques'],warehouses:['Les warehouses regroupent les stocks','Pour les produits C, les entrepôts régionaux rapprochent le stock des marchés. Les besoins remontent vers la France ; la proposition prévoit de commander uniquement lorsqu’un manque apparaît.','Produits → marchés · Informations → production'],hubs:['Trois hubs pour les Amériques','Pour les produits B, notre proposition découple les flux dès la sortie de l’usine en France. La répartition étudiée est de 60 % vers New York, 25 % vers São Paulo et 15 % vers Toronto.','New York 60 % · São Paulo 25 % · Toronto 15 %']}[state];
  document.querySelector('#logistics-title').textContent=copy[0];document.querySelector('#logistics-copy').textContent=copy[1];document.querySelector('#logistics-facts').textContent=copy[2];document.querySelector('#map-title').textContent=copy[0];
  document.querySelectorAll('[data-logistics]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.logistics===state)));
  map.dataset.state=state;stop=animateRoutes(map.parentElement,paths,parcels);
 }
 document.querySelectorAll('[data-logistics]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.logistics)));render('before');
}
const workshop=document.querySelector('#workshop-svg');
if(workshop){
 const machines=document.querySelector('#workshop-machines'),queue=document.querySelector('#workshop-queue'),parts=document.querySelector('#workshop-parts');
 function machine(x,y,title,sub,critical=false){const g=node('g',{transform:`translate(${x} ${y})`,class:critical?'machine critical':'machine'});g.append(node('path',{d:'M0 0L25 -18H115L90 0Z',fill:'#a8b4bd'}),node('path',{d:'M90 0L115 -18V68L90 88Z',fill:'#566a78'}),node('rect',{x:0,y:0,width:90,height:88,rx:3,fill:critical?'#d49649':'#c5ced2'}),node('rect',{x:12,y:17,width:49,height:51,rx:3,fill:'#233747'}),node('rect',{x:66,y:20,width:15,height:24,fill:'#7ea9b4'}),node('circle',{cx:25,cy:83,r:3,fill:'#e8bb55'}),node('text',{x:50,y:116,'text-anchor':'middle',class:'machine-name'},title),node('text',{x:50,y:136,'text-anchor':'middle',class:'machine-sub'},sub));machines.append(g);}
 machine(80,75,'BOÎTIERS','Flux d’entrée');machine(80,280,'SFPACK','Flux d’entrée');machine(445,175,'CU22','Usinage partagé',true);machine(810,80,'AVAL','Autres opérations');machine(810,280,'ASSEMBLAGE','Synchroniser les flux');
 for(let i=0;i<5;i++)queue.append(node('rect',{x:290+i*23,y:205,width:17,height:17,rx:2,fill:'#e3a251',transform:`rotate(-12 ${298+i*23} 213)`}));
 const paths=['M150 170H385Q440 170 440 245H700Q760 245 760 160H870','M150 365H385Q440 365 440 245H700Q760 245 760 365H870'].map(d=>{const p=node('path',{d,fill:'none',stroke:'none'});workshop.append(p);return p;});
 let stop=animateRoutes(workshop.parentElement,paths,parts);
 const texts={queue:'Le CU22 est identifié comme poste critique dans le rapport. Les pièces en attente illustrent ce mécanisme ; leur nombre n’est pas une mesure de l’étude.',flows:'Les boîtiers et le SFPACK sollicitent la même ressource. Suivre les deux flux aide à comprendre pourquoi la disponibilité du CU22 se répercute en aval.',layout:'Le plan issu de la soutenance montre l’implantation proposée. Il complète le diagnostic de charge par une réflexion sur les déplacements et les zones de travail.'};
 document.querySelectorAll('[data-workshop]').forEach(b=>b.addEventListener('click',()=>{const state=b.dataset.workshop;document.querySelectorAll('[data-workshop]').forEach(a=>a.setAttribute('aria-pressed',String(a===b)));queue.style.opacity=state==='queue'?'1':'.15';workshop.hidden=state==='layout';workshop.style.display=state==='layout'?'none':'';document.querySelector('#workshop-layout').hidden=state!=='layout';document.querySelector('#workshop-insight').textContent=texts[state];stop();if(state!=='layout')stop=animateRoutes(workshop.parentElement,paths,parts);}));
}
