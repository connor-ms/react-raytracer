import { HitRecord, Hittable } from "./hittable";
import Interval from "./interval";
import { Ray } from "./ray";
import { Vec3 } from "./vector";

export default class Camera {
    public imageWidth;
    public imageHeight;
    public aspectRatio;
    public antialias;

    private center; // Camera position
    private pixelOrigin; // Location of pixel 0, 0
    private pixelDeltaU; // Offset to pixel to the right
    private pixelDeltaV; // Offset to pixel below
    private samplesPerPixel;

    constructor(imageWidth: number, aspectRatio: number) {
        this.aspectRatio = aspectRatio;
        this.imageWidth = imageWidth;
        this.imageHeight = Math.max(1, Math.round(this.imageWidth / this.aspectRatio));
        this.center = new Vec3();

        this.antialias = false;
        // Only used if antialiasing is enabled
        this.samplesPerPixel = 10;

        let focalLength = 1;
        let viewportHeight = 2;
        let viewportWidth = viewportHeight * (this.imageWidth / this.imageHeight);

        // Calculate the vectors across the horizontal and down the vertical viewport edges.
        let viewportU = new Vec3(viewportWidth, 0, 0);
        let viewportV = new Vec3(0, -viewportHeight, 0);

        // Calculate the horizontal and vertical delta vectors from pixel to pixel.
        this.pixelDeltaU = viewportU.divide(this.imageWidth);
        this.pixelDeltaV = viewportV.divide(this.imageHeight);

        // Calculate the location of the upper left pixel.
        let viewportOrigin = this.center.subtract(new Vec3(0, 0, focalLength)).subtract(viewportU.divide(2)).subtract(viewportV.divide(2));
        this.pixelOrigin = viewportOrigin.add(this.pixelDeltaU.add(this.pixelDeltaV).divide(2));
    }

    public render(world: Hittable, imageData: ImageData) {
        for (let y = 0; y < this.imageHeight; y++) {
            for (let x = 0; x < this.imageWidth; x++) {
                let pixelColor = new Vec3();
                let r = this.getRay(x, y);

                if (this.antialias) {
                    for (let sample = 0; sample < this.samplesPerPixel; sample++) {
                        r = this.getRay(x, y);
                        pixelColor = pixelColor.add(this.rayColor(r, world));
                    }
                    pixelColor = pixelColor.divide(this.samplesPerPixel);
                } else {
                    pixelColor = this.rayColor(r, world);
                }

                this.setPixel(imageData.data, x, y, pixelColor);
            }
        }
    }

    private getRay(x: number, y: number) {
        let offset = new Vec3();

        if (this.antialias) offset = new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);

        let pixelSample = this.pixelOrigin.add(this.pixelDeltaU.scale(x + offset.x)).add(this.pixelDeltaV.scale(y + offset.y));

        return new Ray(this.center, pixelSample.subtract(this.center));
    }

    private rayColor(r: Ray, world: Hittable) {
        // Hittable objects
        let hitRec = new HitRecord();
        if (world.hit(r, new Interval(0, Infinity), hitRec)) {
            return hitRec.normal.add(new Vec3(1, 1, 1)).scale(0.5);
        }

        // Background
        let unitDirection = r.direction.normalize();
        let a = 0.5 * (unitDirection.y + 1.0);
        return new Vec3(1.0, 1.0, 1.0).scale(1.0 - a).add(new Vec3(0.5, 0.7, 1.0).scale(a));
    }

    private setPixel(data: Uint8ClampedArray, x: number, y: number, color: Vec3) {
        const index = (y * this.imageWidth + x) * 4;
        let interval = new Interval(0, 0.9999);
        data[index] = Math.round(interval.clamp(color.x) * 256);
        data[index + 1] = Math.round(interval.clamp(color.y) * 256);
        data[index + 2] = Math.round(interval.clamp(color.z) * 256);
        data[index + 3] = 256;
    }
}
