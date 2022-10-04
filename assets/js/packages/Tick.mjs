export class TickClass {
    constructor() {
        this.queue = [];
        let last = performance.now();

        const tick = (time) => {
            const delta = Math.min(150, time - last);
            last = time;

            for (let i = this.queue.length - 1; i >= 0; i--) {
                let callback = this.queue[i];
                if (callback.fps) {
                    if (time - callback.last < 1000 / callback.fps) continue;
                    callback(++callback.frame);
                    callback.last = time;
                    continue;
                }
                callback(delta, time);
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    add(callback, fps) {
        if (fps) {
            callback.fps = fps;
            callback.last = -Infinity;
            callback.frame = -1;
        }
        if (!this.queue.includes(callback)) this.queue.unshift(callback);
    }

    remove(callback) {
        if (this.queue.includes(callback)) this.queue.splice(this.queue.indexOf(callback), 1);
    }
}

export const Tick = new TickClass();
