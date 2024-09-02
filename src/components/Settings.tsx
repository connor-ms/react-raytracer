import { useState } from "react";
import RenderManager from "../util/render-manager";
import { Vec3 } from "../util/vector";
import { Sphere, HittableList } from "../util/hittable";
import { Lambertian, Metal } from "../util/material";

interface SettingsProps {
    renderManager: RenderManager;
    //renderCount: number;
}

const ObjectSettings: React.FC<{ object: Sphere; index: number; world: HittableList }> = ({ object, index, world }) => {
    const [_, setDummyState] = useState(false); // Dummy state to force rerender
    const [deleted, setDeleted] = useState(false);

    return (
        deleted ? <></> :
            <div className="collapse collapse-arrow bg-base-200 mt-1">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">Object {index}</div>
                <div className="collapse-content label-text">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Material:</span>
                        </div>
                        <select className="select select-bordered select-sm" defaultValue={object.material.toString()} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            switch (event.target.value) {
                                case "Diffuse":
                                    object.material = new Lambertian(object.material.albedo);
                                    break;
                                case "Metal":
                                    object.material = new Metal(object.material.albedo);
                                    break;
                            }
                            setDummyState(prev => !prev);
                        }}>
                            <option>Diffuse</option>
                            <option>Metal</option>
                        </select>
                    </label>
                    <label className="input input-bordered flex items-center gap-1 h-10 mt-1">
                        Radius:
                        <input type="number" min="0" step="0.1" className="grow" value={object.radius} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.radius = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
                    </label>
                    r: {Math.floor(object.material.albedo.x * 256)}
                    <input type="range" min="0" max="1" step="0.01" value={object.material.albedo.x} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.material.albedo.x = Number.parseFloat(event.target.value); setDummyState(prev => !prev); }} />
                    g: {Math.floor(object.material.albedo.y * 256)}
                    <input type="range" min="0" max="1" step="0.01" value={object.material.albedo.y} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.material.albedo.y = Number.parseFloat(event.target.value); setDummyState(prev => !prev); }} />
                    b: {Math.floor(object.material.albedo.z * 256)}
                    <input type="range" min="0" max="1" step="0.01" value={object.material.albedo.z} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.material.albedo.z = Number.parseFloat(event.target.value); setDummyState(prev => !prev); }} />
                    <label className="input input-bordered flex items-center gap-1 h-10">
                        x:
                        <input type="number" className="grow" value={object.center.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.center.x = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
                    </label><label className="input input-bordered flex items-center gap-1 h-10">
                        y:
                        <input type="number" className="grow" value={object.center.y} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.center.y = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
                    </label><label className="input input-bordered flex items-center gap-1 h-10">
                        z:
                        <input type="number" className="grow" value={object.center.z} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { object.center.z = Number.parseFloat(event.target.value); setDummyState(prev => !prev) }} />
                    </label>
                    <button className="btn btn-block btn-link" onClick={() => {
                        world.remove(index);
                        setDeleted(true);
                    }}>Delete</button>
                </div>
            </div>
    )
}

const Settings: React.FC<SettingsProps> = ({ renderManager }) => {
    const [_, setDummyState] = useState(false); // Dummy state to force rerender

    return (
        <div>
            <div className="text-center label-text">
                Resolution: {renderManager.camera.imageWidth}x{renderManager.camera.imageHeight} - Samples: {renderManager.camera.totalSamples()} - Render time: TODO
            </div>
            <div className="bg-primary-content text-white rounded-lg w-[500px] my-1">
                <div className="join join-vertical w-full">
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" defaultChecked />
                        <div className="collapse-title text-xl font-medium">Info</div>
                        <div className="collapse-content label-text">
                            Resolution: {renderManager.camera.imageWidth}x{renderManager.camera.imageHeight}<br />
                            Total samples: {renderManager.camera.totalSamples()}<br />
                            Render time: TODO<br />
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" />
                        <div className="collapse-title text-xl font-medium">Camera</div>
                        <div className="collapse-content">
                            <div className="form-control label-text">
                                <label className="input input-bordered flex items-center gap-1 h-10 label-text">
                                    Samples per pixel:
                                    <input type="number" min="1" className="grow" value={renderManager.camera.samplesPerPixel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderManager.camera.samplesPerPixel = Number.parseInt(event.target.value); setDummyState(prev => !prev) }} />
                                </label>
                                Fov: {renderManager.camera.fov}&#176;
                                <input type="range" min="1" max="179" value={renderManager.camera.fov} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderManager.camera.fov = Number.parseInt(event.target.value); setDummyState(prev => !prev); }} />
                            </div>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" />
                        <div className="collapse-title text-xl font-medium">Objects</div>
                        <div className="collapse-content">
                            {renderManager.world.objects.map((hittable, index) => { return <ObjectSettings object={hittable as Sphere} index={index} world={renderManager.world} /> })}
                            <div className="text-center">
                                <button className="btn btn-primary btn-xs mt-2" onClick={() => {
                                    renderManager.world.add(new Sphere(new Vec3(), 0, new Metal(new Vec3(1, 1, 1))));
                                    setDummyState(prev => !prev);
                                }}>+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center label-text">(no changes will be shown until <a className="text-primary">Render</a> is clicked)</div>
        </div>
    );
}

export default Settings;