export class Vec2 extends Array {
    constructor(x = 0, y = x) {
        super(x, y);
        return this;
    }

    get x() {
        return this[0];
    }

    set x(v) {
        this[0] = v;
    }

    get y() {
        return this[1];
    }

    set y(v) {
        this[1] = v;
    }

    set(x, y = x) {
        if (x.length) return this.copy(x);
        this[0] = x;
        this[1] = y;
        return this;
    }

    copy(v) {
        this[0] = v[0];
        this[1] = v[1];
        return this;
    }

    len() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }
}

export class MouseClass {
    constructor() {
        const _this = this;
        this.pixel = new Vec2();
        this.normal = new Vec2(0.5);
        this.tilt = new Vec2();
        this.normalFlip = new Vec2(0.5);

        let width, height;

        {
            handlers();
        }

        function handlers() {
            window.addEventListener('pointerdown', down);
            window.addEventListener('pointermove', move);
            window.addEventListener('touchmove', move);
            window.addEventListener('pointerup', up);
            window.addEventListener('resize', resize);
            window.addEventListener('orientationchange', resize);
            resize();
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
        }

        function down(e) {
            updateMouse(e);
        }

        function move(e) {
            updateMouse(e);
        }

        function up() {}

        function updateMouse(e) {
            if (e.changedTouches && e.changedTouches.length) {
                e.x = e.changedTouches[0].pageX;
                e.y = e.changedTouches[0].pageY;
            }
            if (e.x === undefined) {
                e.x = e.pageX;
                e.y = e.pageY;
            }

            _this.pixel.set(e.x, e.y);

            _this.normal.x = _this.pixel.x / width;
            _this.normal.y = _this.pixel.y / height;

            _this.normalFlip.x = _this.normal.x;
            _this.normalFlip.y = 1.0 - _this.normal.y;

            _this.tilt.x = _this.normalFlip.x * 2.0 - 1.0;
            _this.tilt.y = _this.normalFlip.y * 2.0 - 1.0;
        }
    }
    static create(type, className) {
        const node = document.createElement(type);
        if (className) node.className = className;
        this.setup(node);
        return noe;
    }
}

export const Mouse = new MouseClass();
