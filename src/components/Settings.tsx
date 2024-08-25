import { useState } from "react";
import { Renderer } from "../util/render";

interface SettingsProps {
    renderer: Renderer;
    renderCount: number;
}

const Settings: React.FC<SettingsProps> = ({ renderer }) => {
    const [_, setDummyState] = useState(false); // Dummy state to force rerender

    return (
        <div>
            <div className="text-center label-text">
                Resolution: {renderer.cam.imageWidth}x{renderer.cam.imageHeight} - Samples: {renderer.cam.totalSamples()} - Render time: {renderer.frameTime}ms
            </div>
            <div className="bg-primary-content text-white rounded-lg w-[500px] my-1">
                <div className="join join-vertical w-full">
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" defaultChecked />
                        <div className="collapse-title text-xl font-medium">Info</div>
                        <div className="collapse-content label-text">
                            Resolution: {renderer.cam.imageWidth}x{renderer.cam.imageHeight}<br />
                            Total samples: {renderer.cam.totalSamples()}<br />
                            Render time: {renderer.frameTime}ms<br />
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" />
                        <div className="collapse-title text-xl font-medium">Camera</div>
                        <div className="collapse-content">
                            <div className="form-control label-text">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Enable supersampling</span>
                                    <input type="checkbox" className="toggle toggle-primary" onClick={() => { renderer.cam.superSample = !renderer.cam.superSample; }} defaultChecked={renderer.cam.superSample} />
                                </label>
                                <label className="input input-bordered flex items-center gap-1 h-10 label-text">
                                    Samples per pixel:
                                    <input type="number" min="1" className="grow" value={renderer.cam.samplesPerPixel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cam.samplesPerPixel = Number.parseInt(event.target.value); setDummyState(prev => !prev) }} />
                                </label>
                                Fov: {renderer.cam.fov}&#176;
                                <input type="range" min="1" max="179" value={renderer.cam.fov} className="range range-xs" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cam.fov = Number.parseInt(event.target.value); setDummyState(prev => !prev); console.log(renderer.cam.fov) }} />
                            </div>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" />
                        <div className="collapse-title text-xl font-medium">World</div>
                        <div className="collapse-content">
                            <p>hello</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="accordian" />
                        <div className="collapse-title text-xl font-medium">Objects</div>
                        <div className="collapse-content">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="checkbox" />
                                <div className="collapse-title text-xl font-medium">Object 1</div>
                                <div className="collapse-content">
                                    <p>hello</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-primary btn-xs mt-2" onClick={() => { alert("Yoohoo!") }}>+</button>
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