import { DOM, Animate, OMath, Tick } from '../index.js';

export class Third {
    constructor() {
        const _this = this;

        const svg = DOM.query('#third .animation svg')[0];

        const svgns = 'http://www.w3.org/2000/svg';

        const ellipses = [];

        // Group to rotate
        const group = document.createElementNS(svgns, 'g');
        DOM.setup(group);
        group.css({
            transformOrigin: '50%',
            rotate: -30,
        });

        svg.appendChild(group);

        for (let i = 0; i < 15; i++) {
            const ellipse = document.createElementNS(svgns, 'ellipse');
            ellipse.setAttributeNS(null, 'cx', 50);
            ellipse.setAttributeNS(null, 'cy', 50);
            ellipse.setAttributeNS(null, 'rx', 48);
            ellipse.setAttributeNS(null, 'ry', 48);
            DOM.setup(ellipse);
            group.appendChild(ellipse);

            ellipse.initial = {
                cx: 50,
                rx: 48,
                ry: 48,
            };
            ellipse.anim = {};

            ellipses.push(ellipse);
        }

        function update(dt, time) {
            ellipses.forEach((ellipse, i) => {
                ellipse.anim.time += dt * 0.001 * 0.1;
                const a = OMath.mod(1 - i / 14 - ellipse.anim.time, 1.0);

                const R = 55;
                const h = (0.5 - Math.pow(Math.abs(a - 0.5) * 2.0, 1.5) * 0.5) * R;
                const r = Math.sqrt(2 * R * h - h * h);

                const ar = 0.5;

                const cx = OMath.mix(11, 89, a);
                const rx = r * ar;
                const ry = r;

                ellipse.setAttributeNS(null, 'cx', OMath.mix(ellipse.initial.cx, cx, ellipse.anim.mult));
                ellipse.setAttributeNS(null, 'rx', OMath.mix(ellipse.initial.rx, rx, ellipse.anim.mult));
                ellipse.setAttributeNS(null, 'ry', OMath.mix(ellipse.initial.ry, ry, ellipse.anim.mult));
            });
        }

        this.animateIn = (isMobile) => {
            ellipses.forEach((ellipse, i) => {
                ellipse.anim.time = 0;
                ellipse.anim.mult = 0;
                new Animate(ellipse.anim, 1200, {
                    mult: 1,
                    delay: (isMobile ? 0 : 100) + i * 20,
                    ease: 'inOutQuint',
                });
            });

            Tick.add(update);
        };

        this.animateOut = () => {
            Tick.remove(update);
        };
    }
}
