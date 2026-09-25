// Lightweight authored A350-900 interpretation. No downloaded model or external texture.
export function createA350(T){
 const plane=new T.Group();
 const white=new T.MeshStandardMaterial({color:0xf8f9fa,metalness:.25,roughness:.3});
 const silver=new T.MeshStandardMaterial({color:0xb6c0cb,metalness:.7,roughness:.35});
 const navy=new T.MeshStandardMaterial({color:0x08172d,roughness:.4});
 const red=new T.MeshStandardMaterial({color:0xe32636,roughness:.4});
 const add=(geo,mat,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);plane.add(m);return m;};
 // Long, smoothly tapered body along X; the nose points left.
 const profile=[[-3.4,0],[-3.32,.075],[-3.16,.19],[-2.95,.275],[-2.6,.31],[-1.9,.32],[1.9,.32],[2.45,.27],[2.95,.16],[3.4,.015]];
 const fuselage=new T.LatheGeometry(profile.map(([x,r])=>new T.Vector2(r,x)),40);fuselage.rotateZ(-Math.PI/2);add(fuselage,white);
 function panel(points,mat,depth=.035){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return new T.Mesh(new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.015,bevelThickness:.008,bevelSegments:1,steps:1}),mat);}
 for(const side of [-1,1]){
  // Swept wings and curved, upturned tips.
  const wing=panel([[-.9,.22],[.18,2.15],[1.13,3.03],[1.37,3.06],[.87,1.35],[.94,.23]],white);
  wing.rotation.x=side*Math.PI/2;wing.position.y=-.08;plane.add(wing);
  const tip=panel([[1.1,0],[1.36,0],[1.53,.35],[1.47,.46]],white);tip.position.set(0,-.02,side*3.02);plane.add(tip);
  const tail=panel([[2.35,.14],[2.94,1.18],[3.18,1.2],[3.07,.14]],white);tail.rotation.x=side*Math.PI/2;tail.position.y=.04;plane.add(tail);
  // Large turbofan nacelles, dark inlets and visible spinner.
  const eng=new T.CylinderGeometry(.255,.23,1.02,28,1,true);eng.rotateZ(Math.PI/2);add(eng,white,-.12,-.38,side*1.05);
  const inlet=new T.TorusGeometry(.234,.026,8,32);inlet.rotateY(Math.PI/2);add(inlet,silver,-.63,-.38,side*1.05);
  const fan=new T.CircleGeometry(.222,28);fan.rotateY(-Math.PI/2);add(fan,navy,-.625,-.38,side*1.05);
  const spinner=new T.ConeGeometry(.078,.17,16);spinner.rotateZ(Math.PI/2);add(spinner,silver,-.69,-.38,side*1.05);
  const pylon=panel([[-.2,0],[.48,0],[.28,.3],[-.08,.32]],silver);pylon.position.set(0,-.36,side*1.05);plane.add(pylon);
  // Characteristic dark cockpit mask and passenger windows.
  const cockpit=panel([[-3.18,.04],[-3.06,.17],[-2.74,.18],[-2.7,.055]],navy,.009);cockpit.position.z=side*.24;plane.add(cockpit);
  const windowGeo=new T.SphereGeometry(.027,6,4);
  const windows=new T.InstancedMesh(windowGeo,navy,42);const matrix=new T.Matrix4();
  for(let i=0;i<42;i++){matrix.makeScale(.8,1.2,.2);matrix.setPosition(-2.38+i*.112,.075,side*.315);windows.setMatrixAt(i,matrix);}plane.add(windows);
  // Fuselage wordmark, as locally generated vector-like canvas lettering.
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#071c39';ctx.font='bold 86px Arial';ctx.fillText('AIRFRANCE',20,92);ctx.fillStyle='#e52336';ctx.beginPath();ctx.moveTo(645,92);ctx.lineTo(690,25);ctx.lineTo(721,25);ctx.lineTo(676,92);ctx.fill();
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  const logo=new T.Mesh(new T.PlaneGeometry(2.25,.281),new T.MeshBasicMaterial({map:texture,transparent:true,side:T.FrontSide,depthWrite:false}));
  logo.position.set(-1.3,.17,side*.29);if(side===-1)logo.rotation.y=Math.PI;plane.add(logo);
 }
 const fin=panel([[2.04,.19],[2.72,1.38],[3.08,1.4],[3.02,.19]],white,.055);fin.position.z=-.027;plane.add(fin);
 for(const side of [-1,1]){
  const blueStripe=panel([[2.25,.29],[2.83,1.37],[3.02,1.38],[2.49,.29]],navy,.008);blueStripe.position.z=side*.052;plane.add(blueStripe);
  const redStripe=panel([[2.61,.29],[3.06,1.18],[3.05,.88],[2.75,.29]],red,.008);redStripe.position.z=side*.054;plane.add(redStripe);
 }
 plane.userData.description='Interprétation 3D de l’Airbus A350-900 aux couleurs Air France';
 return plane;
}
