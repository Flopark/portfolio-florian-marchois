'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    menu.querySelector('span').textContent = open ? '−' : '＋';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); }
  });
  nav?.addEventListener('click', event => { if(event.target.closest('a') && menu.getAttribute('aria-expanded') === 'true') menu.click(); });
  const progress = document.querySelector('.reading-progress');
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if(scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      scrollQueued = false;
    });
  }, { passive: true });
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.07 });
    document.querySelectorAll('.project-section, .project-card, .gallery-section, .contact-banner').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }
  const audios = [...document.querySelectorAll('audio')];
  document.querySelectorAll('[data-motion]').forEach(button=>button.addEventListener('click',()=>{
    const img=button.closest('.audio-card').querySelector('img');
    const play=button.getAttribute('aria-pressed')!=='true';
    img.src=play?img.dataset.animation:img.dataset.still;
    button.setAttribute('aria-pressed',String(play));button.textContent=play?'Arrêter l’animation':'Animer la déformée';
  }));
  audios.forEach(audio => audio.addEventListener('play', () => audios.forEach(other => { if(other !== audio) other.pause(); })));
  document.querySelectorAll('[data-audio]').forEach(button => {
    const audio = document.getElementById(button.dataset.audio);
    const update = () => { button.setAttribute('aria-pressed', String(!audio.paused)); button.innerHTML = audio.paused ? '<span class="play-icon">▷</span> Écouter la lame' : '<span class="play-icon">Ⅱ</span> Mettre en pause'; };
    button.addEventListener('click', async () => {
      if (!audio.paused) return audio.pause();
      try { await audio.play(); } catch { button.textContent = 'Lecture indisponible — réessayer'; }
    });
    ['play','pause','ended'].forEach(event => audio.addEventListener(event, update));
  });
  const canvas = document.querySelector('#signal');
  if(canvas && window.signalData) {
    const ctx=canvas.getContext('2d'); const values=window.signalData;
    let frame=0;
    const draw=()=>{
      const w=canvas.width,h=canvas.height;
      ctx.clearRect(0,0,w,h); ctx.lineWidth=1; ctx.strokeStyle='#29404d';
      for(let x=0;x<w;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=0;y<h;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.beginPath();ctx.strokeStyle='#91e4d3';ctx.lineWidth=2.4;
      const max=Math.max(...values.map(Math.abs))||1;
      values.forEach((v,i)=>{const x=i/(values.length-1)*w,y=h/2-v/max*h*.32;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
      const audio=document.querySelector('#hero-audio');
      if(audio && !audio.paused && !reduced && !document.documentElement.classList.contains('reduced-experience')){const x=(audio.currentTime/Math.max(audio.duration,1))*w;ctx.fillStyle='#dffbf1';ctx.fillRect(x,0,2,h);frame=requestAnimationFrame(draw);}
    };
    draw(); const audio=document.querySelector('#hero-audio');
    audio?.addEventListener('play',draw);audio?.addEventListener('pause',()=>{cancelAnimationFrame(frame);draw();});audio?.addEventListener('ended',()=>{cancelAnimationFrame(frame);draw();});
  }
  document.querySelectorAll('[data-flow]').forEach(button => button.addEventListener('click',()=>{
    const proposed=button.dataset.flow==='proposed';
    document.querySelectorAll('[data-flow]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('#flow-middle').textContent=proposed?'Entrepôts relais':'Entrepôt central';
    document.querySelector('#flow-mid-caption').textContent=proposed?'Mutualiser les stocks':'Distribution vers les boutiques';
    document.querySelector('#flow-last-caption').textContent=proposed?'Réapprovisionner selon le besoin':'Stock local important';
    document.querySelector('#flow-diagram').classList.toggle('proposed',proposed);
    document.querySelector('#flow-description').textContent=proposed?'La proposition rapproche le stock des marchés et fait remonter les besoins des boutiques. L’objectif est de mutualiser les stocks et de mieux déclencher les réapprovisionnements.':'Dans l’organisation étudiée, le stock est réparti dans les boutiques. Le projet questionne sa localisation et la manière de déclencher les réapprovisionnements.';
  }));
  const chart=document.querySelector('#scatter');
  if(chart && window.coilData?.length){
    const config={e:{label:'Entrefer (mm)',title:'Inductance en fonction de l’entrefer',insight:'L’entrefer est l’un des paramètres influents identifiés dans le rapport. Le nuage montre une tendance, que la régression multiple permet d’étudier avec les autres variables.'},s:{label:'Section du tore (mm²)',title:'Inductance en fonction de la section du tore',insight:'La section du tore est un autre paramètre majeur du modèle. À section plus élevée, le nuage fait apparaître une inductance généralement plus élevée.'},t:{label:'Température (°C)',title:'Inductance en fonction de la température',insight:'La température ne présente pas ici la même tendance visible que les dimensions géométriques. Le rapport ne la retient pas comme levier principal pour l’inductance.'}};
    const NS='http://www.w3.org/2000/svg';
    const node=(tag,attrs,text)=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;chart.append(n);return n;};
    let activeVariable='e';
    const plot=key=>{
      activeVariable=key;
      const d=window.coilData,c=config[key];const xvals=d.map(p=>p[key]),yvals=d.map(p=>p.l);
      let xmin=Math.min(...xvals),xmax=Math.max(...xvals),ymin=Math.min(...yvals),ymax=Math.max(...yvals);
      const xpad=(xmax-xmin)*.06,ypad=(ymax-ymin)*.08;xmin-=xpad;xmax+=xpad;ymin-=ypad;ymax+=ypad;
      const width=Math.max(250,chart.clientWidth), height=width<500?340:420, left=width<500?48:70, right=width-15, bottom=height-65;
      chart.setAttribute('viewBox',`0 0 ${width} ${height}`);
      const x=v=>left+(v-xmin)/(xmax-xmin)*(right-left),y=v=>bottom-(v-ymin)/(ymax-ymin)*(bottom-55);
      chart.replaceChildren();node('title',{id:'scatter-title'},c.title);node('desc',{id:'scatter-desc'},`${d.length} mesures. ${c.insight}`);
      for(let i=0;i<=4;i++){
        const yy=ymin+(ymax-ymin)*i/4,xx=xmin+(xmax-xmin)*i/4;
        node('line',{x1:left,x2:right,y1:y(yy),y2:y(yy),stroke:'#314351','stroke-dasharray':'3 5'});
        node('text',{x:left-10,y:y(yy)+5,'text-anchor':'end',fill:'#a9b7c5','font-size':14},yy.toFixed(1));
        if(width>500||i%2===0)node('text',{x:x(xx),y:bottom+25,'text-anchor':i===4?'end':i===0?'start':'middle',fill:'#a9b7c5','font-size':14},xx.toFixed(key==='e'?2:0));
      }
      node('text',{x:left,y:25,fill:'#eef3f7','font-size':14},'Inductance (mH)');
      node('text',{x:right,y:height-8,'text-anchor':'end',fill:'#eef3f7','font-size':14},c.label);
      d.forEach(p=>{const circle=node('circle',{cx:x(p[key]),cy:y(p.l),r:4.5,fill:'#91e4d3',opacity:.75});const title=document.createElementNS(NS,'title');title.textContent=`${c.label} : ${p[key]} · Inductance : ${p.l.toFixed(2)} mH`;circle.append(title);});
      document.querySelector('#chart-insight').textContent=c.insight;
    };
    document.querySelectorAll('[data-variable]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-variable]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));plot(button.dataset.variable);}));plot('e');
    let lastWidth=chart.clientWidth;
    new ResizeObserver(()=>{if(Math.abs(chart.clientWidth-lastWidth)>1){lastWidth=chart.clientWidth;plot(activeVariable);}}).observe(chart);
  }
});
