import { Animate } from '../packages/Animate.js';

const transforms = new Map([
    ['opacity', 1],
    ['perspective', 0],
    ['x', 0],
    ['y', 0],
    ['z', 0],
    ['scale', 1],
    ['scaleX', null],
    ['scaleY', null],
    ['rotate', 0],
    ['rotateX', null],
    ['rotateY', null],
    ['rotateZ', null],
    ['skewX', null],
    ['skewY', null],
]);

const numberProperties = ['opacity', 'zIndex', 'fontWeight', 'strokeDashoffset'];

export class DOM {
    static setup(node) {
        // Already setup
        if (node.isDOM) return node;

        // Add animatable properties to node
        node.transforms = {};
        transforms.forEach((value, key) => {
            node.transforms[key] = value;
        });

        // Attach alias helpers
        node.animate = (duration, values) => {
            return this.animate(node, duration, values);
        };
        node.css = (styles) => {
            this.css(node, styles);
        };
        node.isDOM = true;
        return node;
    }

    static create(tagName = 'div', className) {
        const node = document.createElement(tagName);
        if (className) node.className = className;
        this.setup(node);
        return node;
    }

    static query(selectors, root = document) {
        const list = root.querySelectorAll(selectors);
        list.forEach((node) => {
            this.setup(node);
        });
        return list;
    }

    static css(node, styles) {
        let isTransform = false;
        for (let key in styles) {
            // Check if a tracked property, will apply in transform function
            if (transforms.has(key)) {
                node.transforms[key] = styles[key];
                delete styles[key];
                isTransform = true;
                continue;
            }

            // Automatically add px to number values
            if (typeof styles[key] === 'string' || numberProperties.includes(key)) continue;
            styles[key] += 'px';
        }
        Object.assign(node.style, styles);
        if (isTransform) this.transform(node);
        return this;
    }

    static transform(node) {
        let transform = ``;
        const trans = node.transforms;
        if (trans.perspective) {
            transform += `perspective(${trans.perspective}px)`;
        }

        if (trans.x || trans.y || trans.z) {
            transform +=
                ` translate3d(` + // split
                `${typeof trans.x === 'string' ? trans.x : trans.x + 'px'}, ` +
                `${typeof trans.y === 'string' ? trans.y : trans.y + 'px'}, ` +
                `${typeof trans.z === 'string' ? trans.z : trans.z + 'px'}` +
                `)`;
        }

        if (trans.skewX || trans.skewY) {
            transform +=
                ` skew(` + // split
                `${trans.skewX || 0}deg, ` +
                `${trans.skewY || 0}deg` +
                `)`;
        }

        if (trans.rotateY) transform += ` rotateY(${trans.rotateY}deg)`;
        if (trans.rotateX) transform += ` rotateX(${trans.rotateX}deg)`;
        if (trans.rotateZ) transform += ` rotateZ(${trans.rotateZ}deg)`;
        if (trans.rotate) transform += ` rotate(${trans.rotate}deg)`;

        if (trans.scale !== 1 || trans.scaleX || trans.scaleY) {
            transform +=
                ` scale(` + // Split
                `${trans['scaleX'] || trans.scale}, ` +
                `${trans['scaleY'] || trans.scale}` +
                `)`;
        }

        node.style.transform = transform;
        node.style.opacity = trans.opacity;
        return node;
    }

    static animate(node, duration, values) {
        if (typeof duration !== 'number') console.warn('DOM animate missing duration');

        // Convert string selector into dom nodes
        if (typeof node === 'string') node = this.query(node);

        const anim = new Animate(node.transforms, duration, values);
        anim.onUpdate(() => this.transform(node));
        return anim;
    }
}
