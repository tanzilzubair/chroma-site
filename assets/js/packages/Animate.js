import { Tick } from './Tick.mjs';
import { Easing } from './Easing.mjs';

let queue = [];
let defaultEase = 'outCubic';

Tick.add(render);

function render(delta, t) {
    for (let i = queue.length - 1; i >= 0; i--) {
        let task = queue[i];
        task.update && task.update(delta, t);
    }
}

export function Timeout(duration) {
    const anim = new Animate(null, duration);
    const promise = anim.promise();
    promise.clear = anim.stop;
    return promise;
}

export class Animate {
    constructor(object, duration, values) {
        // Catch arrays and nodelists
        if (object && !!object.forEach && typeof object[0] === 'object')
            return this.stagger(object, duration, values);
        this.elapsed = 0;
        this.object = object;
        this.duration = duration;
        this.delay = 0;
        this.suffix = {};

        this.from = {};
        this.to = Object.assign({}, values);

        ['ease', 'delay', 'spring', 'damping', 'repeat', 'repeatDelay', 'yoyo', 'yoyoEase'].forEach((key) => {
            if (this.to[key] !== undefined) {
                this[key] = this.to[key];
                delete this.to[key];
            }
        });

        if (!Easing[this.ease]) this.ease = defaultEase;
        if (this.yoyo)
            this.yoyoEase =
                Easing[this.yoyoEase] ||
                (() => {
                    if (this.ease.includes('inOut') || this.ease === 'linear') return Easing[this.ease];
                    if (this.ease.includes('out')) return Easing[this.ease.replace('out', 'in')];
                    return Easing[this.ease.replace('in', 'out')];
                })();
        this.ease = Easing[this.ease];

        ['update', 'complete'].forEach((key) => {
            if (this.to[key] !== undefined) {
                if (!this[key + 'Callbacks']) this[key + 'Callbacks'] = [];
                this[key + 'Callbacks'].push(this.to[key]);
                delete this.to[key];
            }
        });

        if (object && !object._anims) {
            Object.defineProperty(object, '_anims', {
                enumerable: false,
                writable: true,
            });
            object._anims = {};
        }

        for (let key in this.to) {
            object._anims[key] && object._anims[key].override(key);
            this.from[key] = object[key];
            object._anims[key] = this;

            // Supports string suffixes - eg 50%
            if (typeof this.from[key] === 'string') {
                const suffixSplit = this.from[key].split(/([^\d-.]+)/);
                this.from[key] = Number.parseFloat(this.from[key]);
                if (typeof this.to[key] === 'string') this.to[key] = Number.parseFloat(this.to[key]);
                if (suffixSplit.length > 2) this.suffix[key] = suffixSplit[suffixSplit.length - 2];
            }
        }

        queue.push(this);
        return this;
    }

    update(delta) {
        this.elapsed += delta;
        const alpha = Math.max(0, Math.min(1, (this.elapsed - this.delay) / this.duration));
        const easeAlpha = this.ease(alpha, this.spring, this.damping);

        for (let key in this.to) {
            this.object[key] = this.from[key] + (this.to[key] - this.from[key]) * easeAlpha;
            if (this.suffix[key]) this.object[key] += this.suffix[key];
        }

        if (this.updateCallbacks) this.updateCallbacks.forEach((f) => f && f());
        if (alpha === 1) this.complete();
    }

    complete() {
        if (this.repeat) {
            if (this.repeat > 0) this.repeat--;
            this.elapsed = 0;
            this.delay = this.repeatDelay || 0;
            if (this.yoyo) this.reverse();
            return;
        }

        for (let key in this.to) {
            delete this.object._anims[key];
        }

        this.stop();
        if (this.completeCallbacks) this.completeCallbacks.forEach((f) => f && f());
        if (this._promise) this._promise.resolve();
    }

    stop() {
        if (queue.includes(this)) queue.splice(queue.indexOf(this), 1);
    }

    stagger(objects, duration, values) {
        const step = values.stagger || 0;
        const stagger =
            typeof values.stagger === 'function'
                ? values.stagger
                : (i, total) => (step < 0 ? -step * (total - 1) + step * i : step * i);

        const callback = values.staggerComplete;
        if (values.stagger) delete values.stagger;
        if (values.staggerComplete) delete values.staggerComplete;

        const delay = values.delay || 0;
        let longest;
        const anims = objects.map((object, i) => {
            values.delay = delay + stagger(i, objects.length);
            const anim = new Animate(object, duration, values);
            if (!longest || values.delay > longest.delay) longest = anim;
            return anim;
        });
        if (callback) longest.onComplete(callback);
        return anims;
    }

    reverse() {
        for (let key in this.to) {
            const newFrom = this.to[key];
            this.to[key] = this.from[key];
            this.from[key] = newFrom;
        }
        const newYoyoEase = this.ease;
        this.ease = this.yoyoEase;
        this.yoyoEase = newYoyoEase;
    }

    override(key) {
        delete this.from[key];
        delete this.to[key];

        if (!Object.keys(this.to).length) this.stop();
    }

    onUpdate(f) {
        if (!this.updateCallbacks) this.updateCallbacks = [];
        this.updateCallbacks.push(f);
        return this;
    }

    onComplete(f) {
        if (!this.completeCallbacks) this.completeCallbacks = [];
        this.completeCallbacks.push(f);
        return this;
    }

    promise() {
        if (this._promise) return this._promise;
        return (this._promise = createPromise());
    }

    static clear(object) {
        if (!object || !object._anims) return;
        for (let key in object._anims) {
            object._anims[key].stop();
            delete object._anims[key];
        }
    }

    static setDefaultEase(ease) {
        defaultEase = ease;
    }
}

function createPromise() {
    let _res;
    const promise = new Promise((res) => (_res = res));
    promise.resolve = _res;
    return promise;
}
