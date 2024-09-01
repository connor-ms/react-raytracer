import Camera from "./camera";
import { HittableList } from "./hittable";

interface RenderWorker {
    message: string;
    camera: string;
    world: string;
    index: number;
    start: number;
    end: number;
}

self.onmessage = (e: MessageEvent<RenderWorker>) => {
    const worker = e.data;

    if (worker.message === "render") {
        // Deserialize any necessary objects
        let camera = Camera.from(worker.camera);
        let world = HittableList.from(worker.world);

        // Render the scene and return the finished portion of the image
        let scene = camera.render(world, worker.start, worker.end);
        self.postMessage({ index: worker.index, data: scene, start: worker.start, end: worker.end });
    } else {
        console.log("Unidentified message received.");
    }
};
