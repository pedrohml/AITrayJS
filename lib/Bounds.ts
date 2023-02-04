
export class Bounds {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(obj?: any) {
        obj ||= {};
        this.x = obj.x || 0;
        this.y = obj.y || 0;
        this.width = obj.width || 0;
        this.height = obj.height || 0;
    }

    public interseect(otherBounds: Bounds) {
        let left = Math.max(this.x, otherBounds.x);
        let right = Math.min(this.x + this.width, otherBounds.x + otherBounds.width);
        let top = Math.max(this.y, otherBounds.y);
        let bottom = Math.min(this.y + this.height, otherBounds.y + otherBounds.height);

        if (left < right && top < bottom)
            return new Bounds({ x: left, y: top, width: right - left, height: bottom - top });
        else
            return new Bounds();
    };
}
