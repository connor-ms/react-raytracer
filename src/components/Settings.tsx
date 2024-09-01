// import { useState } from "react";
// //import { Renderer } from "../util/render-worker";
// import { HittableList, Sphere } from "../util/hittable";
// import { Lambertian, Metal } from "../util/material";
// import { Vec3 } from "../util/vector";

// interface SettingsProps {
//     renderer: Renderer;
//     renderCount: number;
// }

// const ObjectSettings: React.FC<{ object: Sphere; index: number; world: HittableList }> = ({ object, index, world }) => {
//     const [_, setDummyState] = useState(false); // Dummy state to force rerender
//     const [deleted, setDeleted] = useState(false);

//     return (
//         deleted ? <></> :
//             <div className="collapse collapse-arrow bg-base-200 mt-1">
//                 <input type="checkbox" />
//                 <div className="collapse-title text-xl font-medium">Object {index}</div>
//                 <div className="collapse-content label-text">
//                     <label className="form-control w-full">
//                         <div className="label">
//                             <span className="label-text">Material:</span>
//                         </div>
//                         <select className="select select-bordered select-sm" defaultValue={object.material.toString()} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//                             switch (event.target.value) {
//                                 case "Diffuse":
//                                     object.material = new Lambertian(object.material.albedo);
//                                     break;
//                                 case "Metal":
//                                     object.material = new Metal(object.material.albedo);
//                                     break;
//                             }
//                             setDummyState(prev => !prev);
//                         }}>
//                             <option>Diffuse</option>
//                             <option>Metal</option>
//                         </select>
//                     </label>
//                     <label className="input input-bordered flex items-center gap-1 h-10 mt-1">
//                         Radius:
//                         <input type="number" min="0" step="0.1" className="grow" value={object.radius} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.radius = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
//                     </label>
//                     r: {Math.floor(object.material.albedo.x * 256)}
//                     <input type="range" min="0" max="1" step="0.01" value={object.material.albedo.x} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.material.albedo.x = Number.parseFloat(event.target.value); setDummyState(prev => !prev); }} />
//                     g: {Math.floor(object.material.albedo.y * 256)}
//                     <input type="range" min="0" max="1" step="0.01" value={object.material.albedo.y} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.material.albedo.y = Number.parseFloat(event.target.value); setDummyState(prev => !prev); }} />
//                     b: {Math.floor(object.material.albedo.z * 256)}
//                     <input type="range" min="0" max="1" step="0.01" value={object.material.albedo.z} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.material.albedo.z = Number.parseFloat(event.target.value); setDummyState(prev => !prev); }} />
//                     <label className="input input-bordered flex items-center gap-1 h-10">
//                         x:
//                         <input type="number" className="grow" value={object.center.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.center.x = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
//                     </label><label className="input input-bordered flex items-center gap-1 h-10">
//                         y:
//                         <input type="number" className="grow" value={object.center.y} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.center.y = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
//                     </label><label className="input input-bordered flex items-center gap-1 h-10">
//                         z:
//                         <input type="number" className="grow" value={object.center.z} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.center.z = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
//                     </label>
//                     <button className="btn btn-block btn-link" onClick={() => {
//                         world.remove(index);
//                         setDeleted(true);
//                     }}>Delete</button>
//                 </div>
//             </div>
//     )
// }

// const Settings: React.FC<SettingsProps> = ({ renderer }) => {
//     const [_, setDummyState] = useState(false); // Dummy state to force rerender

//     return (
//         <div>
//             <div className="text-center label-text">
//                 Resolution: {renderer.cam.imageWidth}x{renderer.cam.imageHeight} - Samples: {renderer.cam.totalSamples()} - Render time: {renderer.frameTime}ms
//             </div>
//             <div className="bg-primary-content text-white rounded-lg w-[500px] my-1">
//                 <div className="join join-vertical w-full">
//                     <div className="collapse collapse-arrow join-item border-base-300 border">
//                         <input type="radio" name="accordian" defaultChecked />
//                         <div className="collapse-title text-xl font-medium">Info</div>
//                         <div className="collapse-content label-text">
//                             Resolution: {renderer.cam.imageWidth}x{renderer.cam.imageHeight}<br />
//                             Total samples: {renderer.cam.totalSamples()}<br />
//                             Render time: {renderer.frameTime}ms<br />
//                         </div>
//                     </div>
//                     <div className="collapse collapse-arrow join-item border-base-300 border">
//                         <input type="radio" name="accordian" />
//                         <div className="collapse-title text-xl font-medium">Camera</div>
//                         <div className="collapse-content">
//                             <div className="form-control label-text">
//                                 <label className="label cursor-pointer">
//                                     <span className="label-text">Enable supersampling</span>
//                                     <input type="checkbox" className="toggle toggle-primary" onClick={() => { renderer.cam.superSample = !renderer.cam.superSample; }} defaultChecked={renderer.cam.superSample} />
//                                 </label>
//                                 <label className="input input-bordered flex items-center gap-1 h-10 label-text">
//                                     Samples per pixel:
//                                     <input type="number" min="1" className="grow" value={renderer.cam.samplesPerPixel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cam.samplesPerPixel = Number.parseInt(event.target.value); setDummyState(prev => !prev) }} />
//                                 </label>
//                                 Fov: {renderer.cam.fov}&#176;
//                                 <input type="range" min="1" max="179" value={renderer.cam.fov} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cam.fov = Number.parseInt(event.target.value); setDummyState(prev => !prev); console.log(renderer.cam.fov) }} />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="collapse collapse-arrow join-item border-base-300 border">
//                         <input type="radio" name="accordian" />
//                         <div className="collapse-title text-xl font-medium">Objects</div>
//                         <div className="collapse-content">
//                             {renderer.world.objects.map((hittable, index) => { return <ObjectSettings object={hittable as Sphere} index={index} world={renderer.world} /> })}
//                             <div className="text-center">
//                                 <button className="btn btn-primary btn-xs mt-2" onClick={() => {
//                                     renderer.world.add(new Sphere(new Vec3(), 0, new Metal(new Vec3(1, 1, 1))));
//                                     setDummyState(prev => !prev); console.log(renderer.cam.fov)
//                                 }}>+</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="text-center label-text">(no changes will be shown until <a className="text-primary">Render</a> is clicked)</div>
//         </div>
//     );
// }

// export default Settings;