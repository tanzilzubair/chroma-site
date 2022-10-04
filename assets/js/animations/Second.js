import { DOM, Animate, OMath } from '../index.js';

export class Second {
    constructor() {
        const _this = this;

        const svg = DOM.query('#second .animation svg')[0];

        const svgns = 'http://www.w3.org/2000/svg';
        const circles = [];

        for (let i = 0; i < 23; i++) {
            const a = i / 22;
            const circle = document.createElementNS(svgns, 'circle');
            circle.setAttributeNS(null, 'cx', 50);
            circle.setAttributeNS(null, 'cy', 50);
            circle.setAttributeNS(null, 'r', 48);
            DOM.setup(circle);
            svg.appendChild(circle);

            circle.initial = {
                cx: 50,
                r: 48,
            };
            circle.final = {
                cx: 50 + i * 1.2 - 2.4 * Math.max(0, i - 14),
                r: OMath.mix(48, 15, a),
            };
            circle.alt = {
                cx: 50 - i * 1.2 + 2.4 * Math.max(0, i - 14),
                r: OMath.mix(48, 15, a),
            };

            circle.anim = {};

            circles.push(circle);
        }
        circles.reverse();

        function animate(circle, i, isMobile, isFirst) {
            if (!_this.isActive) return;

            new Animate(circle.anim, 1500, {
                cx: circle.anim.dir ? circle.final.cx : circle.alt.cx,
                r: circle.final.r,
                delay: (isMobile ? 0 : 100) + (isFirst ? i * 30 : 2000),
                ease: 'inOutCubic',
                update: () => {
                    circle.setAttributeNS(null, 'cx', circle.anim.cx);
                    circle.setAttributeNS(null, 'r', circle.anim.r);
                },
                complete: () => {
                    animate(circle, i, isMobile, false);
                },
            });

            circle.anim.dir = !circle.anim.dir;
        }

        this.animateIn = (isMobile) => {
            _this.isActive = true;
            circles.forEach((circle, i) => {
                circle.anim.cx = circle.initial.cx;
                circle.anim.r = circle.initial.r;
                circle.anim.dir = true;
                animate(circle, i, isMobile, true);

                // new Animate(circle.anim, 1500, {
                //     cx: circle.final.cx,
                //     r: circle.final.r,
                //     delay: (isMobile ? 0 : 100) + i * 30,
                //     ease: 'inOutQuint',
                //     update: () => {
                //         circle.setAttributeNS(null, 'cx', circle.anim.cx);
                //         circle.setAttributeNS(null, 'r', circle.anim.r);
                //     },
                // });
            });
        };

        this.animateOut = () => {
            _this.isActive = false;
        };
    }
}
