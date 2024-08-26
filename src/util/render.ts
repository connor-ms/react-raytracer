import Camera from "./camera";
import { HittableList, Sphere } from "./hittable";
import { Lambertian, Metal } from "./material";
import { Vec3 } from "./vector";

export class Renderer {
    public world: HittableList;
    public cam: Camera;
    public frameTime: number;

    constructor() {
        this.frameTime = 0;

        this.world = new HittableList();
        // this.world.add(new Sphere(new Vec3(0, 0, -1), 0.5));
        // this.world.add(new Sphere(new Vec3(0, -100.5, -1), 100));

        let material_ground = new Lambertian(new Vec3(0.8, 0.8, 0.0));
        let material_center = new Lambertian(new Vec3(0.1, 0.2, 0.5));
        let material_left = new Metal(new Vec3(0.8, 0.8, 0.8));
        let material_right = new Metal(new Vec3(0.8, 0.6, 0.2));

        this.world.add(new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0, material_ground));
        this.world.add(new Sphere(new Vec3(0.0, 0.0, -1.2), 0.2, material_center));
        this.world.add(new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.5, material_left));
        this.world.add(new Sphere(new Vec3(1.0, 0.0, -1.0), 0.5, material_right));

        this.cam = new Camera(700, 16 / 9);
    }

    buildFrame(imageData: ImageData) {
        let startTime = performance.now();

        this.cam.render(this.world, imageData);

        this.frameTime = performance.now() - startTime;
    }
}
