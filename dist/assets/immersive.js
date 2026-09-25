// Native scroll is the timeline. WebGL is an optional, locally hosted layer.
const media = matchMedia('(prefers-reduced-motion: reduce)');
let manual = false;
try { manual = localStorage.getItem('portfolio-reduced') === 'true'; } catch {}
let reduced = media.matches || manual;
const preference = document.querySelector('.motion-preference');
const scenes = [];
function preferenceUI() {
 document.documentElement.classList.toggle('reduced-experience', reduced);
 document.dispatchEvent(new Event('portfolio-motion-change'));
 preference?.setAttribute('aria-pressed', String(reduced));
 if(preference) preference.textContent = reduced ? 'Animations réduites' : 'Réduire les animations';
 scenes.forEach(s => s.request());
 document.querySelectorAll('[data-motion],#blade-play').forEach(button=>{button.disabled=reduced;});
 if(reduced)document.querySelectorAll('[data-animation]').forEach(img=>{img.src=img.dataset.still;const button=img.closest('.audio-card')?.querySelector('[data-motion]');if(button){button.setAttribute('aria-pressed','false');button.textContent='Animer la déformée';}});
 if(reduced) { const b=document.querySelector('#blade-play'); if(b){b.setAttribute('aria-pressed','false');b.textContent='Animer la lame';} }
}
preference?.addEventListener('click', () => {
 manual = !reduced; reduced = media.matches || manual;
 try { localStorage.setItem('portfolio-reduced',String(manual)); } catch {}
 preferenceUI();
});
media.addEventListener('change', () => { reduced=media.matches||manual;preferenceUI(); });
preferenceUI();
let library;
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const mix = (a,b,t) => a+(b-a)*t;
const smooth = t => t*t*(3-2*t);
async function createScene(host) {
 const T = await (library ||= import('./vendor/three.module.min.js'));
 const kind = host.dataset.scene;
 const mobile = matchMedia('(max-width:800px)').matches;
 const renderer = new T.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.5));
 renderer.setClearColor(0x091420,0);
 renderer.outputColorSpace=T.SRGBColorSpace;
 host.append(renderer.domElement);
 renderer.domElement.setAttribute('aria-hidden','true');
 const scene = new T.Scene();
 const camera = new T.PerspectiveCamera(36,1,.1,60);
 camera.position.set(0,1,11);
 scene.add(new T.HemisphereLight(0xe2fff3,0x172632,2.8));
 const key = new T.DirectionalLight(0xf4e3cb,4);key.position.set(3,5,4);scene.add(key);
 const rim = new T.DirectionalLight(0x8ccbbf,3);rim.position.set(-4,-1,2);scene.add(rim);
 const group = new T.Group();scene.add(group);
 let aircraft;
 if(kind==='air'||kind==='journey'){
  const {loadA350}=await import('./a350-model.js');aircraft=await loadA350(T);scene.add(aircraft);
  host.dataset.model='a350-user-glb';
 }
 let factory;
 if(kind==='journey'){const {createFactory}=await import('./industrial-scene.js');factory=createFactory(T);group.add(factory.root);}
 const metal = new T.MeshStandardMaterial({color:0x819c96,metalness:.72,roughness:.3});
 const shape = new T.Shape(); const w=.22,h=1.65,r=.08;
 shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,-h+r);shape.quadraticCurveTo(-w,-h,-w+r,-h);
 const bladeGeometry = new T.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:4});bladeGeometry.center();
 const blades = Array.from({length:20},()=>{let mesh=new T.Mesh(bladeGeometry,metal);group.add(mesh);return mesh;});
 const dotGeometry=new T.SphereGeometry(.055,8,6), dotMaterial=new T.MeshBasicMaterial({color:0xb9e9d8});
 const dots=Array.from({length:20},()=>{let mesh=new T.Mesh(dotGeometry,dotMaterial);group.add(mesh);return mesh;});
 const linePositions=new Float32Array(20*24*6);
 const lineGeometry=new T.BufferGeometry();lineGeometry.setAttribute('position',new T.BufferAttribute(linePositions,3));
 const lines=new T.LineSegments(lineGeometry,new T.LineBasicMaterial({color:0x87b4aa,transparent:true,opacity:.38}));lines.frustumCulled=false;group.add(lines);
 const spherePosition=i=>{const y=1-2*(i+.5)/20, radius=Math.sqrt(1-y*y),a=i*2.399963;return new T.Vector3(2.65*radius*Math.cos(a),2.65*y,2.65*radius*Math.sin(a));};
 const positions=Array.from({length:20},()=>new T.Vector3());
 let frame=0,visible=false,pointer={x:0,y:0},pointerTarget={x:0,y:0},playing=false,mode=1,proposed=document.querySelector('[data-flow="proposed"]')?.getAttribute('aria-pressed')==='true',bottleneck=true;
 const story=host.closest('.journey, .feedback-layout');
 const steps=story?[...story.querySelectorAll('[data-step]')]:[];
 const labGeometry=new T.BoxGeometry(4.7,.13,1.05,64,1,4);
 const base=labGeometry.attributes.position.array.slice();
 const lab=new T.Mesh(labGeometry,metal.clone());lab.visible=kind==='blade';scene.add(lab);
 if(kind==='blade') group.visible=false;
 function progress() {
  if(!story) return kind==='air'?3+clamp((innerHeight-host.getBoundingClientRect().top)/(innerHeight+host.clientHeight))*1.5:['flow','capacity'].includes(kind)?2:kind==='hero'?clamp(-host.getBoundingClientRect().top/innerHeight)*.7:0;
  const target=innerHeight*(mobile?.65:.5);
  let p=0;
  steps.forEach((s,i)=>{const box=s.getBoundingClientRect();if(box.top<target)p=i+clamp((target-box.top)/Math.max(box.height,1));});
  const active=Math.min(steps.length-1,Math.floor(p));
  steps.forEach((s,i)=>s.classList.toggle('is-active',i===active));
  host.querySelector('.scene-index').textContent=`0${active+1} — 0${steps.length}`;
  return kind==='air'?3+p*.55:clamp(p,0,3);
 }
 function render(time=0) {
  frame=0;if(!visible||document.hidden)return;
  pointer.x=mix(pointer.x,reduced?0:pointerTarget.x,.13);pointer.y=mix(pointer.y,reduced?0:pointerTarget.y,.13);
  if(reduced)playing=false;
  const p=reduced?(kind==='air'?3:['flow','capacity'].includes(kind)?2:0):progress();
  host.dataset.progress=p.toFixed(2);
  const explode=smooth(clamp(p)),network=smooth(clamp(p-1)),air=smooth(clamp(p-2));
  const angle=reduced?0:pointer.x*.95;
  group.rotation.set(.2+explode*.1+pointer.y*(reduced?0:.65),-.5+ p*.45+angle,-.3+network*.3+angle*.16);
  camera.position.z=11+Math.sin(p/3*Math.PI)*1.6;
  if(factory)camera.position.z=Math.max(camera.position.z,network*4.5/(Math.tan(Math.PI/10)*camera.aspect));
  camera.position.y=1-air*.5;camera.lookAt(0,0,0);
  if(aircraft){
   const arrival=kind==='air'?1:smooth(clamp((p-2.65)/.35));
   camera.position.z=Math.max(camera.position.z,arrival*4.1/(Math.tan(Math.PI/10)*camera.aspect));
   aircraft.visible=arrival>.01;
   aircraft.scale.setScalar(.3+arrival*.7);
   const flight=p-3;
   aircraft.position.set((1-arrival)*4+pointer.x*.6,(1-arrival)*-1+Math.sin(flight*1.4)*.25-pointer.y*.35,0);
   aircraft.rotation.set(.38+Math.sin(flight*1.3)*.25+pointer.y*.7,-.6+flight*.65+pointer.x*1.1,-.12+Math.sin(flight*1.6)*.19-pointer.x*.3);
   host.dataset.attitude=[aircraft.rotation.x,aircraft.rotation.y,aircraft.rotation.z].map(v=>v.toFixed(3)).join(',');
   rim.color.set(0xbfdfff);key.color.set(0xffffff);
   group.scale.setScalar(1-arrival);
   group.visible=arrival<.99;
   if(kind==='journey'){
    const colors=[0x251811,0x211333,0x352011,0x172d48];
    const accents=[0xffbe88,0xcca7ff,0xffc961,0xc1dcff];
    const i=Math.min(2,Math.floor(p)),f=smooth(p-i);
    document.body.style.setProperty('--journey-bg','#'+new T.Color(colors[i]).lerp(new T.Color(colors[i+1]),f).getHexString());
    document.body.style.setProperty('--journey-accent','#'+new T.Color(accents[i]).lerp(new T.Color(accents[i+1]),f).getHexString());
    host.closest('.journey').style.background='var(--journey-bg)';
    metal.color.set(accents[i]).lerp(new T.Color(accents[i+1]),f);
    host.querySelector('.scene-label span').textContent=arrival>.6?'AIRBUS A350-900 / AIR FRANCE':network>.4?'POSTES DE PRODUCTION / CONVOYEURS':'MATIÈRE / SYSTÈMES / COLLECTIF';
   }
  }
  blades.forEach((b,i)=>{
   const a=i/20*Math.PI*2;
   const stack=new T.Vector3((i-9.5)*.18,0,(i-9.5)*.12);
   const opened=new T.Vector3(Math.cos(a)*2.2,Math.sin(a)*1.7,(i-9.5)*.14);
   const grid=factory?new T.Vector3((Math.floor(i/5)-1.5)*1.6,-.1,(i%5-2)*.18):new T.Vector3((i%5-2)*1.15,(Math.floor(i/5)-1.5)*1.2,Math.sin(i)*.3);
   const pos=stack.lerp(opened,explode).lerp(grid,network);
   if(kind==='flow'&&proposed){pos.x*=.8;pos.y*=.6;pos.z+=(i%5===2?1:-.3);}
   positions[i].copy(pos);b.position.copy(pos);b.rotation.set(explode*.3,explode*a*.45,explode*Math.sin(a)*.2);
   b.scale.setScalar(mix(1,.08,network));b.visible=network<.98;
   dots[i].position.copy(pos);dots[i].visible=!factory&&network>.05;dots[i].scale.setScalar(network*(kind==='capacity'&&bottleneck&&i===7?3:1));
  });
  let offset=0;
  for(let i=0;i<20;i++)for(let j=0;j<24;j++){
   const end=(i+ (i%3===0?5:1))%20;
   for(const t of [j/24,(j+1)/24]){
    const pos=positions[i].clone().lerp(positions[end],t);
    linePositions[offset++]=pos.x;linePositions[offset++]=pos.y;linePositions[offset++]=pos.z;
   }
  }
  lines.visible=!factory&&network>.05;
  if(factory){factory.update(network,p);host.dataset.industrial=network.toFixed(2);}
lines.material.opacity=network*.38;lineGeometry.attributes.position.needsUpdate=true;
  if(kind==='blade'){
   lab.rotation.set(.5+pointer.y*.5,-.25+pointer.x*.8,-.12+pointer.x*.1);const values=labGeometry.attributes.position.array;
   const phase=playing&&!reduced?Math.sin(time*.003):.65;
   for(let i=0;i<values.length;i+=3){const x=base[i]/2.35;values[i+1]=base[i+1]+phase*.23*(mode===1?Math.cos(x*Math.PI):Math.sin(x*1.5*Math.PI));}
   labGeometry.attributes.position.needsUpdate=true;labGeometry.computeVertexNormals();
  }
  renderer.render(scene,camera);host.dataset.ready='true';host.dataset.drawCalls=renderer.info.render.calls;
  if(kind==='blade'&&playing&&!reduced) request();
  if(Math.abs(pointer.x-(reduced?0:pointerTarget.x))+Math.abs(pointer.y-(reduced?0:pointerTarget.y))>.001)request();
 }
 function request(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
 function resize(){const b=host.getBoundingClientRect();if(b.width&&b.height){renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();request();}}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'50px'});observer.observe(host);
 window.addEventListener('scroll',request,{passive:true});document.addEventListener('visibilitychange',request);
 const pointerArea=story||host.closest('.hero,.blade-lab,.air-arrival')||host;
 pointerArea.addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch')return;const b=pointerArea.getBoundingClientRect();pointerTarget={x:clamp((e.clientX-b.left)/b.width)-.5,y:clamp(e.clientY/innerHeight)-.5};request();});
 pointerArea.addEventListener('pointerleave',()=>{pointerTarget={x:0,y:0};request();});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();host.dataset.ready='false';cancelAnimationFrame(frame);frame=0;});
 renderer.domElement.addEventListener('webglcontextrestored',request);
 if(kind==='flow')document.querySelectorAll('[data-flow]').forEach(button=>button.addEventListener('click',()=>{proposed=button.dataset.flow==='proposed';host.querySelector('.scene-label span').textContent=proposed?'RÉSEAU RÉORGANISÉ / SCHÉMA ABSTRAIT':'DISTRIBUTION / SCHÉMA ABSTRAIT';request();}));
 if(kind==='capacity'){
  dots[7].material=new T.MeshBasicMaterial({color:0xe7ac78});
  document.querySelectorAll('[data-capacity]').forEach(button=>button.addEventListener('click',()=>{
   bottleneck=button.dataset.capacity==='bottleneck';
   document.querySelectorAll('[data-capacity]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   dots[7].material.color.set(bottleneck?0xe7ac78:0xb9e9d8);
   document.querySelector('#capacity-insight').textContent=bottleneck?'Le point cuivré représente un poste limitant. Augmenter la capacité d’un autre poste ne suffit pas à lever cette contrainte.':'Les postes sont interdépendants. Un changement de capacité doit être examiné avec les gammes, les transferts et les contraintes d’implantation.';request();
  }));
 }
 if(kind==='blade'){
  const play=document.querySelector('#blade-play');
  play.addEventListener('click',()=>{if(reduced)return;playing=!playing;play.setAttribute('aria-pressed',String(playing));play.textContent=playing?'Mettre en pause':'Animer la lame';request();});
  document.querySelector('#blade-mode').addEventListener('change',e=>{mode=Number(e.target.value);request();});
  document.querySelector('#blade-material').addEventListener('change',e=>{lab.material.color.set({composite:0x718b83,aluminium:0xd1dae0,bois:0xad7950}[e.target.value]);lab.material.metalness=e.target.value==='aluminium'?.8:.2;request();});
 }
 scenes.push({request});resize();
}
const lazy = new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;lazy.unobserve(entry.target);
 createScene(entry.target).catch(()=>{entry.target.dataset.ready='false';entry.target.dataset.fallback='true';});
}),{rootMargin:'250px'});
document.querySelectorAll('[data-scene]').forEach(host=>lazy.observe(host));
