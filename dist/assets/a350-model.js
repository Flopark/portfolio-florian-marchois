// The supplied aircraft is centered after applying its original glTF transforms.
export async function loadA350(T) {
 const {GLTFLoader}=await import('./vendor/GLTFLoader.js');
 const {scene:model}=await new GLTFLoader().loadAsync(new URL('./a350-user.glb',import.meta.url).href);
 model.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3());
 const center=bounds.getCenter(new T.Vector3());
 model.position.sub(center);
 const normalized=new T.Group();normalized.add(model);
 normalized.scale.setScalar(7/Math.max(size.x,size.y,size.z));
 const root=new T.Group();root.add(normalized);
 return root;
}
