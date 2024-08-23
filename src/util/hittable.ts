import Interval from "./interval";
import { Ray } from "./ray";
import { Vec3 } from "./vector";

export class HitRecord {
    public p: Vec3;
    public normal: Vec3;
    public t: number;
    public front_face: boolean;

    constructor() {
        this.p = new Vec3();
        this.normal = new Vec3();
        this.t = 0;
        this.front_face = true;
    }

    set_face_normal(r: Ray, outward_normal: Vec3) {
        // Sets the hit record normal vector.
        // NOTE: the parameter `outward_normal` is assumed to have unit length.

        this.front_face = r.direction.dot(outward_normal) < 0;
        this.normal = this.front_face ? outward_normal : outward_normal.scale(-1);
    }

    set(other: HitRecord) {
        this.p = other.p;
        this.normal = other.normal;
        this.t = other.t;
        this.front_face = other.front_face;
    }
}

export abstract class Hittable {
    abstract hit(ray: Ray, ray_t: Interval, hit_record: HitRecord): boolean;
}

export class Sphere implements Hittable {
    constructor(public center: Vec3, public radius: number) {
        this.radius = Math.max(0, radius);
    }

    hit(ray: Ray, ray_t: Interval, hit_record: HitRecord) {
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

        hit_record.t = root;
        hit_record.p = ray.at(hit_record.t);

        let outward_normal = hit_record.p.subtract(this.center).divide(this.radius);
        hit_record.set_face_normal(ray, outward_normal);

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

    clear() {
        this.objects = [];
    }

    hit(ray: Ray, ray_t: Interval, hit_record: HitRecord) {
        let temp_rec: HitRecord = new HitRecord();
        let hit_anything = false;
        let closest_so_far = ray_t.max;

        for (const object of this.objects) {
            if (object.hit(ray, new Interval(ray_t.min, closest_so_far), temp_rec)) {
                hit_anything = true;
                closest_so_far = temp_rec.t;
                hit_record.set(temp_rec);
            }
        }

        return hit_anything;
    }
}
