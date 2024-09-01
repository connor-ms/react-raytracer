import Interval from "./interval";
import { Lambertian, Material, Metal } from "./material";
import { Ray } from "./ray";
import { Vec3 } from "./vector";

export class HitRecord {
    public p: Vec3;
    public normal: Vec3;
    public material?: Material;
    public t: number;
    public frontFace: boolean;

    constructor() {
        this.p = new Vec3();
        this.normal = new Vec3();
        this.t = 0;
        this.frontFace = true;
    }

    setFaceNormal(r: Ray, outward_normal: Vec3) {
        // Sets the hit record normal vector.
        // NOTE: the parameter `outward_normal` is assumed to have unit length.

        this.frontFace = r.direction.dot(outward_normal) < 0;
        this.normal = this.frontFace ? outward_normal : outward_normal.scale(-1);
    }

    set(other: HitRecord) {
        this.p = other.p;
        this.normal = other.normal;
        this.t = other.t;
        this.frontFace = other.frontFace;
        this.material = other.material;
    }
}

export abstract class Hittable {
    abstract hit(ray: Ray, ray_t: Interval, hit_record: HitRecord): boolean;
}

export class Sphere implements Hittable {
    constructor(public center: Vec3, public radius: number, public material: Material) {
        this.radius = Math.max(0, radius);
    }

    hit(ray: Ray, ray_t: Interval, hitRec: HitRecord) {
        let oc = this.center.subtract(ray.origin);
        let a = ray.direction.length2();
        let h = ray.direction.dot(oc);
        let c = oc.length2() - this.radius * this.radius;

        let discriminant = h * h - a * c;
        if (discriminant < 0) return false;

        let sqrt = Math.sqrt(discriminant);

        let root = (h - sqrt) / a;
        if (!ray_t.surrounds(root)) {
            root = (h + sqrt) / a;
            if (!ray_t.surrounds(root)) return false;
        }

        hitRec.t = root;
        hitRec.p = ray.at(hitRec.t);
        hitRec.setFaceNormal(ray, hitRec.p.subtract(this.center).divide(this.radius));
        hitRec.material = this.material;

        return true;
    }
}

export class HittableList extends Hittable {
    public objects: Array<Hittable>;

    constructor(object?: Hittable) {
        super();

        this.objects = new Array<Hittable>();

        if (object) {
            this.add(object);
        }
    }

    add(object: Hittable) {
        this.objects.push(object);
    }

    remove(index: number) {
        delete this.objects[index];
    }

    clear() {
        this.objects = [];
    }

    hit(ray: Ray, ray_t: Interval, hitRec: HitRecord) {
        let temp: HitRecord = new HitRecord();
        let hasHit = false;
        let closest = ray_t.max;

        for (const object of this.objects) {
            if (object && object.hit(ray, new Interval(ray_t.min, closest), temp)) {
                hasHit = true;
                closest = temp.t;
                hitRec.set(temp);
            }
        }

        return hasHit;
    }

    static from(serialized: string) {
        const parsedData = JSON.parse(serialized);
        const hittableList = new HittableList();

        parsedData.objects.forEach((obj: any) => {
            let material: Material;

            if (obj.material.type === "Metal") {
                material = new Metal(new Vec3(obj.material.albedo.x, obj.material.albedo.y, obj.material.albedo.z));
            } else {
                material = new Lambertian(new Vec3(obj.material.albedo.x, obj.material.albedo.y, obj.material.albedo.z));
            }

            const center = new Vec3(obj.center.x, obj.center.y, obj.center.z);
            hittableList.add(new Sphere(center, obj.radius, material));
        });

        return hittableList;
    }
}
