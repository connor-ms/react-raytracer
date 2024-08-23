import Camera from "./camera";
import { HittableList, Sphere } from "./hittable";
import { Vec3 } from "./vector";

export interface Settings {
    viewHeight: number;
    viewWidth: number;
}

export class Renderer {
    private frameTime: number;
    private frameCount: number;
    private single: boolean;

    private world: HittableList;
    public cam: Camera;

    constructor() {
        this.frameTime = 0;
        this.frameCount = 0;
        this.single = false;

        this.world = new HittableList();
        this.world.add(new Sphere(new Vec3(0, 0, -1), 0.5));
        this.world.add(new Sphere(new Vec3(0, -100.5, -1), 100));

        this.cam = new Camera(700, 16 / 9);
    }

    buildFrame(ctx: CanvasRenderingContext2D, frameCount: number) {
        if (this.single) return;

        let startTime = performance.now();

        const imageData = ctx.createImageData(this.cam.imageWidth, this.cam.imageHeight);

        this.cam.render(this.world, imageData);

        ctx.putImageData(imageData, 0, 0);

        this.frameTime += performance.now() - startTime;
        this.frameCount++;

        console.log(`Rendered in ${this.frameTime}ms`);

        if (this.frameCount === 50) {
            console.log("Average frametime: " + this.frameTime / this.frameCount);
            this.frameTime = 0;
            this.frameCount = 0;
        }

        this.single = true;
    }
}
