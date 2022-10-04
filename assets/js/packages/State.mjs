export class StateClass {
    constructor() {
        this.data = {};
        this.events = {};
        // this.previousData = {};
    }

    link(props, callback) {
        if (!Array.isArray(props)) props = [props];
        let isPropsExist = false;

        // link to specific state prop
        props.forEach((prop) => {
            if (this.data[prop] !== undefined) isPropsExist = true;
            if (!this.events[prop]) this.events[prop] = [];
            this.events[prop].push(callback);
        });

        // Call immediately to populate with current state
        if (isPropsExist) callback && callback(this.data);
    }

    unlink(props, callback) {
        if (!Array.isArray(props)) props = [props];
        props.forEach((prop) => {
            if (!this.events[prop]) return;
            if (this.events[prop].includes(callback))
                this.events[prop].splice(this.events[prop].indexOf(callback), 1);
        });
    }

    push(data) {
        let callbacks = [];

        for (let prop in data) {
            if (this.data[prop] === data[prop]) {
                delete data[prop];
                continue;
            }

            if (!this.events[prop]) continue;
            this.events[prop].forEach((callback) => {
                if (!callbacks.includes(callback)) callbacks.push(callback);
            });
        }

        if (Object.entries(data).length === 0) return;
        // this.previousData = this.data;
        // this.data = Object.assign({ ...this.data }, data);

        Object.assign(this.data, data);

        if (!callbacks.length) return;
        callbacks.forEach((callback) => callback && callback(this.data));
    }
}

export const State = new StateClass();
