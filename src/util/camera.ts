import { HitRecord, Hittable } from "./hittable";
import Interval from "./interval";
import { Ray } from "./ray";
import { Vec3 } from "./vector";

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export default class Camera {
    private pixelOrigin; // Location of pixel 0, 0
    private pixelDeltaU; // Offset to pixel to the right
    private pixelDeltaV; // Offset to pixel below

    constructor(
        public imageWidth: number,
        public imageHeight: number,
        public center: Vec3,
        public maxDepth: number,
        public fov: number,
        public samplesPerPixel: number
    ) {
        this.pixelOrigin = new Vec3();
        this.pixelDeltaU = new Vec3();
        this.pixelDeltaV = new Vec3();
    }

    static from(data: string): Camera {
        const parsedData = JSON.parse(data);

        return new Camera(
            parsedData.imageWidth,
            parsedData.imageHeight,
            new Vec3(parsedData.center.x, parsedData.center.y, parsedData.center.z),
            parsedData.maxDepth,
            parsedData.fov,
            parsedData.samplesPerPixel
        );
    }

    public render(world: Hittable, from: number, to: number) {
        if (to > this.imageHeight) {
            console.warn(`Warning: Camera 'to' value out of bounds. Clamping from ${to} to ${this.imageHeight}.`);
            to = this.imageHeight;
        }

        let byteCount = (to - from) * this.imageWidth;
        let data = new Uint8ClampedArray(byteCount * 4);

        let focalLength = 1;
        let theta = degreesToRadians(this.fov);
        let h = Math.tan(theta / 2);
        let viewportHeight = 2 * h * focalLength;
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

        for (let y = from; y < to; y++) {
            for (let x = 0; x < this.imageWidth; x++) {
                let pixelColor = new Vec3();
                let r = this.getRay(x, y);

                for (let sample = 0; sample < this.samplesPerPixel; sample++) {
                    r = this.getRay(x, y);
                    pixelColor = pixelColor.add(this.rayColor(r, this.maxDepth, world));
                }
                pixelColor = pixelColor.divide(this.samplesPerPixel);

                this.setPixel(data, x, y - from, pixelColor);
            }
        }

        return data;
    }

    public totalSamples() {
        return this.imageWidth * this.imageHeight * this.samplesPerPixel;
    }

    private getRay(x: number, y: number) {
        let offset = new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
        let pixelSample = this.pixelOrigin.add(this.pixelDeltaU.scale(x + offset.x)).add(this.pixelDeltaV.scale(y + offset.y));

        return new Ray(this.center, pixelSample.subtract(this.center));
    }

    private rayColor(r: Ray, depth: number, world: Hittable): Vec3 {
        if (depth <= 0) return new Vec3(0, 0, 0);

        // Hittable objects
        let hitRec = new HitRecord();
        if (world.hit(r, new Interval(0.01, Infinity), hitRec)) {
            //return hitRec.normal.add(new Vec3(1, 1, 1)).scale(0.5);

            let scattered = new Ray(new Vec3(), new Vec3());
            let attenuation = new Vec3();
            if (hitRec.material?.scatter(r, hitRec, attenuation, scattered)) {
                return this.rayColor(scattered, depth - 1, world).multiply(attenuation);
            }
            //let direction = Vec3.randomOnHemisphere(hitRec.normal); // Not really accurate reflection
            // let direction = hitRec.normal.add(Vec3.randomUnitSphere().normalize()); // True Lambertian Reflection
            // return this.rayColor(new Ray(hitRec.p, direction), depth - 1, world).scale(0.5);
            return new Vec3(0, 0, 0);
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
