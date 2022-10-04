export class EmitterClass {
    constructor() {
        this.events = [];
    }

    on(name, callback) {
        this.events.push({ name, callback });
    }

    off(name, callback) {
        for (let i = this.events.length - 1; i >= 0; i--) {
            if (this.events[i].name === name && this.events[i].callback === callback)
                this.events.splice(i, 1);
        }
    }

    emit(name, data = {}) {
        this.events.forEach((event) => {
            if (event.name === name) event.callback(data);
        });
    }
}

export const Emitter = new EmitterClass();
