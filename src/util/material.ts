import { HitRecord } from "./hittable";
import { Ray } from "./ray";
import { Vec3 } from "./vector";

export abstract class Material {
    public abstract albedo: Vec3;
    abstract scatter(rayIn: Ray, hitRec: HitRecord, attenuation: Vec3, rayOut: Ray): boolean;
}

export class Lambertian implements Material {
    constructor(public albedo: Vec3) {}

    scatter(_: Ray, hitRec: HitRecord, attenuation: Vec3, rayOut: Ray) {
        let scatter_direction = hitRec.normal.add(Vec3.randomUnitSphere().normalize());

        if (scatter_direction.nearZero()) {
            scatter_direction = hitRec.normal;
        }

        rayOut.set(new Ray(hitRec.p, scatter_direction));
        attenuation.set(this.albedo);
        return true;
    }
}

export class Metal implements Material {
    constructor(public albedo: Vec3) {}

    scatter(rayIn: Ray, hitRec: HitRecord, attenuation: Vec3, rayOut: Ray) {
        let reflected = rayIn.direction.reflect(hitRec.normal);
        rayOut.set(new Ray(hitRec.p, reflected));
        attenuation.set(this.albedo);
        return true;
    }
}
