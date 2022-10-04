import { DOM, Animate } from '../index.js';

export class Home {
    constructor() {
        const _this = this;

        const paths = DOM.query('.home .top svg path');

        this.animateIn = (isMobile) => {
            paths.forEach((path, i) => {
                // Randomly rotate and flip the circle
                const scaleX = Math.random() > 0.5 ? 1 : -1;
                const rotate = Math.floor(Math.random() * 360);
                const length = path.getTotalLength();

                path.css({
                    opacity: 1,
                    scaleX,
                    rotate,
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });

                new Animate(path.style, 1500, {
                    strokeDashoffset: 0,
                    ease: 'inOutCubic',
                    delay: i * 150,
                });
            });
        };

        this.animateOut = () => { };
    }
}
