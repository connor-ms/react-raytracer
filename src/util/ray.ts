import { Vec3 } from "./vector";

export class Ray {
    constructor(public origin: Vec3, public direction: Vec3) {}

    at(t: number) {
        return this.origin.add(this.direction.scale(t));
    }
}
