export class Vec3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

    set(other: Vec3) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
    }

    add(other: Vec3) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vec3) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiply(other: Vec3) {
        return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    scale(val: number) {
        return new Vec3(this.x * val, this.y * val, this.z * val);
    }

    divide(val: number) {
        return this.scale(1 / val);
    }

    length() {
        return Math.sqrt(this.length2());
    }

    length2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    normalize() {
        let l = this.length();
        return this.divide(l);
    }

    dot(other: Vec3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    nearZero() {
        let s = 1e-8;
        return Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s;
    }

    reflect(other: Vec3) {
        return this.subtract(other.scale(this.dot(other) * 2));
    }

    static random(min?: number, max?: number) {
        if (min && max) {
            const getRandom = () => {
                return Math.random() * (max - min) + min;
            };

            return new Vec3(getRandom(), getRandom(), getRandom());
        } else {
            return new Vec3(Math.random(), Math.random(), Math.random());
        }
    }

    static randomUnitSphere() {
        while (true) {
            let p = Vec3.random(-1, 1);
            if (p.length2() < 1) return p;
        }
    }

    static randomOnHemisphere(normal: Vec3) {
        let on_unit_sphere = Vec3.randomUnitSphere().normalize();
        if (on_unit_sphere.dot(normal) > 0.0)
            // In the same hemisphere as the normal
            return on_unit_sphere;
        else return on_unit_sphere.scale(-1);
    }
}
