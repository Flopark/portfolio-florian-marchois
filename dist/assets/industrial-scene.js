// A schematic production line, not a reconstruction of a client's factory.
export function createFactory(T){
 const root=new T.Group(), machines=[], parcels=[];
 const alloy=new T.MeshStandardMaterial({color:0xc6cdd0,metalness:.65,roughness:.3});
 const dark=new T.MeshStandardMaterial({color:0x26343d,metalness:.55,roughness:.4});
 const brass=new T.MeshStandardMaterial({color:0xe9ad61,metalness:.55,roughness:.35});
 const glass=new T.MeshStandardMaterial({color:0x3c7c87,metalness:.45,roughness:.2});
 function box(parent,x,y,z,w,h,d,mat){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;}
 box(root,0,-1.15,0,7,.12,2.7,dark);
 for(let i=0;i<4;i++){
  const station=new T.Group();station.position.x=(i-1.5)*1.6;root.add(station);machines.push(station);
  box(station,0,-.68,0,1.1,.8,1.25,alloy);
  box(station,0,-.15,-.46,1.1,1.5,.24,alloy);
  box(station,-.46,.08,.14,.16,1.1,1.05,alloy);
  box(station,.46,.08,.14,.16,1.1,1.05,alloy);
  box(station,0,.6,.05,1.1,.18,1.25,alloy);
  box(station,0,.15,-.31,.66,.65,.03,glass);
  box(station,.58,.12,.4,.2,.3,.24,dark);
  box(station,.59,.17,.53,.12,.11,.015,brass);
  box(station,0,.25,.07,.13,.48,.16,dark);
  box(station,0,.73,-.3,.1,.13,.1,brass);
 }
 // Continuous roller conveyor through the four work cells.
 box(root,0,-.28,.55,6.65,.12,.68,dark);
 for(const z of [.17,.93])box(root,0,-.12,z,6.65,.13,.07,alloy);
 const rollerGeo=new T.CylinderGeometry(.055,.055,.68,8);
 for(let i=0;i<39;i++){const m=new T.Mesh(rollerGeo,alloy);m.rotation.x=Math.PI/2;m.position.set(-3.2+i*.17,-.18,.55);root.add(m);}
 for(let i=0;i<5;i++)parcels.push(box(root,0,-.04,.55,.34,.2,.4,brass));
 root.rotation.set(.32,0,0);
 return {root,update(amount,progress){
  root.visible=amount>.015;root.scale.setScalar(amount);root.position.y=-.25;
  machines.forEach((m,i)=>{m.position.y=(1-amount)*(1+i*.3);});
  parcels.forEach((m,i)=>{m.position.x=-3.05+((i*1.25+progress*2)%6.1);});
 }};
}
