export default class Interval {
    public static empty = new Interval(Infinity, -Infinity);
    public static universe = new Interval(-Infinity, Infinity);

    constructor(public min: number, public max: number) {}

    size(): number {
        return this.max - this.min;
    }

    contains(x: number) {
        return this.min <= x && x <= this.max;
    }

    surrounds(x: number) {
        return this.min < x && x < this.max;
    }

    clamp(x: number) {
        if (x < this.min) return this.min;
        if (x > this.max) return this.max;
        return x;
    }
}
