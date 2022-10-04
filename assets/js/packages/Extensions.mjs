let counter = Date.now() % 1e9;

export class OMath {
    static sign(x) {
        x = +x;
        if (x === 0 || isNaN(x)) return Number(x);
        return x > 0 ? 1 : -1;
    }

    static round(value, precision = 0) {
        let p = Math.pow(10, precision);
        return Math.round(value * p) / p;
    }

    static random(min, max, precision = 0) {
        if (typeof min === 'undefined') return Math.random();
        if (min === max) return min;

        min = min || 0;
        max = max || 1;

        return this.round(min + Math.random() * (max - min), precision);
    }

    static flip(a = -1, b = 1) {
        return Math.random() > 0.5 ? a : b;
    }

    static degrees(radians) {
        return radians * (180 / Math.PI);
    }

    static radians(degrees) {
        return degrees * (Math.PI / 180);
    }

    static clamp(value, min = 0, max = 1) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }

    static map(value, oldMin = -1, oldMax = 1, newMin = 0, newMax = 1, isClamp) {
        const newValue = ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
        if (isClamp) return this.clamp(newValue, Math.min(newMin, newMax), Math.max(newMin, newMax));
        return newValue;
    }

    static mix(a, b, alpha) {
        return a * (1.0 - alpha) + b * alpha;
    }

    static step(edge, value) {
        return value < edge ? 0 : 1;
    }

    static smoothstep(min, max, value) {
        const x = this.clamp((value - min) / (max - min));
        return x * x * (3 - 2 * x);
    }

    static fract(value) {
        return value - Math.floor(value);
    }

    static mod(value, n) {
        return ((value % n) + n) % n;
    }

    static guid() {
        return ((Math.random() * 1e9) >>> 0) + counter++;
    }

    static padInt(num, digits = 2, isLimit) {
        if (isLimit) num = Math.min(num, Math.pow(10, digits) - 1);
        let str = Math.floor(num).toString();
        return (
            Math.pow(10, Math.max(0, digits - str.length))
                .toString()
                .slice(1) + str
        );
    }

    static powerOfTwo(value) {
        return Math.log2(value) % 1 === 0;
    }
}

export class OArray {
    static shuffle(arr) {
        let i = arr.length;
        let temp, r;
        while (i !== 0) {
            r = OMath.random(0, i, 0);
            i -= 1;
            temp = arr[i];
            arr[i] = arr[r];
            arr[r] = temp;
        }
        return arr;
    }

    static random(arr, range) {
        let value = OMath.random(0, arr.length - 1);
        if (!range) return arr[value];

        // Range is number of returned values before can repeat
        if (!arr.randomStore) arr.randomStore = [];
        range = Math.min(range, arr.length);
        while (~arr.randomStore.indexOf(value)) if ((value += 1) > arr.length - 1) value = 0;
        arr.randomStore.push(value);
        if (arr.randomStore.length >= range) arr.randomStore.shift();
        return arr[value];
    }

    static remove(arr, element) {
        const index = arr.indexOf(element);
        if (~index) return arr.splice(index, 1);
    }

    static last(arr) {
        return arr[this.length - 1];
    }

    static filterList(arr, items) {
        for (let i = arr.length - 1; i >= 0; i--) if (!arr[i].includes(items)) arr.splice(i, 1);
        return arr;
    }

    static excludeList(arr, items) {
        for (let i = arr.length - 1; i >= 0; i--) if (arr[i].includes(items)) arr.splice(i, 1);
        return arr;
    }
}

export class OString {
    static includes(str, match) {
        if (!Array.isArray(match)) return ~str.indexOf(match);
        for (let i = match.length - 1; i >= 0; i--) {
            if (~str.indexOf(match[i])) return true;
        }
        return false;
    }

    static includesAll(str, match) {
        if (!Array.isArray(match)) return ~str.indexOf(match);
        for (let i = match.length - 1; i >= 0; i--) {
            if (!~str.indexOf(match[i])) return false;
        }
        return true;
    }

    static equals(str, match) {
        if (!Array.isArray(match)) return str === match;
        for (let i = match.length - 1; i >= 0; i--) {
            if (str === match[i]) return str;
        }
        return false;
    }

    static replaceAll(str, find, replace) {
        return str.split(find).join(replace);
    }

    static delimit(str, delimiter = ',') {
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    }

    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export class OPromise {
    static create() {
        let _res;
        const promise = new Promise((res) => (_res = res));
        promise.resolve = _res;
        return promise;
    }
}

// window.get = async function (url, options = { credentials: 'same-origin' }) {
//     options.method = 'GET';
//     let e = await fetch(url, options);
//     if (!e.ok) return e;
//     let text = await e.text();
//     if (text.charAt(0).includes(['[', '{'])) {
//         try {
//             return JSON.parse(text);
//         } catch (e) {}
//     }
//     return text;
// };

// window.post = async function (url, body, options = {}) {
//     options.method = 'POST';
//     options.body = body;

//     let e = await fetch(url, options);
//     if (!e.ok) return e;
//     let text = await e.text();
//     if (text.charAt(0).includes(['[', '{'])) {
//         try {
//             return JSON.parse(text);
//         } catch (e) {}
//     }
//     return text;
// };
