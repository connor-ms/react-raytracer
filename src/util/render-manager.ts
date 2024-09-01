import Camera from "./camera";
import { HittableList, Sphere } from "./hittable";
import { Lambertian, Metal } from "./material";
import { Vec3 } from "./vector";

export default class RenderManager {
    public camera: Camera;
    public world: HittableList;

    private workers: Worker[];
    private hasWorkerFinished: boolean[];
    private startTime?: DOMHighResTimeStamp;
    private context?: CanvasRenderingContext2D;

    constructor(threadCount: number) {
        this.workers = new Array<Worker>(threadCount);
        this.hasWorkerFinished = new Array<boolean>(threadCount).fill(false);

        // Create a worker for each "thread"
        for (let i = 0; i < threadCount; i++) {
            this.workers[i] = new Worker(new URL("../util/render-worker.ts", import.meta.url), { type: "module" });
            this.workers[i].onmessage = this.handleWorkerMessage.bind(this);
        }

        // Construct the default camera & scene
        this.camera = new Camera(700, 396, new Vec3(), 10, 90, 100);
        this.world = new HittableList();

        // Add ground object
        this.world.add(new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0, new Lambertian(new Vec3(0.8, 0.8, 0.0))));
        // Add center sphere
        this.world.add(new Sphere(new Vec3(0.0, 0.0, -1.2), 0.2, new Lambertian(new Vec3(0.1, 0.2, 0.5))));
        // Add left sphere
        this.world.add(new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.5, new Metal(new Vec3(0.8, 0.8, 0.8))));
        // Add right sphere
        this.world.add(new Sphere(new Vec3(1.0, 0.0, -1.0), 0.5, new Metal(new Vec3(0.8, 0.6, 0.2))));
    }

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    begin() {
        this.hasWorkerFinished.fill(false);
        this.startTime = performance.now();

        let workerCount = this.workers.length;
        let step = Math.floor(this.camera.imageHeight / workerCount);

        for (let i = 0; i < workerCount; i++) {
            this.workers[i].postMessage({
                message: "render",
                camera: JSON.stringify(this.camera),
                world: JSON.stringify(this.world),
                index: i,
                start: step * i,
                end: step * (i + 1),
            });
        }
    }

    handleWorkerMessage(event: MessageEvent<{ index: number; data: Uint8ClampedArray; start: number; end: number }>) {
        console.log(`Worker ${event.data.index} finished in ${performance.now() - this.startTime!}ms.`);

        let imageData = new ImageData(event.data.data, this.camera.imageWidth);
        this.context!.putImageData(imageData, 0, event.data.start);

        this.hasWorkerFinished[event.data.index] = true;

        if (this.hasWorkerFinished.every((value) => value === true)) {
            console.log("All workers finished in " + (performance.now() - this.startTime!) + "ms");
        }
    }
}
