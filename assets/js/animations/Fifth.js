import { DOM, Animate, Tick, OMath } from '../index.js';
import '../packages/matter.min.js';

export class Fifth {
    constructor() {
        const _this = this;

        const svg = DOM.query('#fifth .animation svg')[0];
        const container = DOM.query('#fifth .animation')[0];

        const NUM = 5;

        const svgns = 'http://www.w3.org/2000/svg';
        const circles = [];

        const world = {
            width: 100,
            height: 100,
        };
        const balls = [];
        const nml = [0, 1];

        let engine;
        let ground, leftWall, rightWall;
        const vec = { x: 0, y: 0 };

        let lastWidth, lastRatio;

        let time = 0;

        {
            initSVG();
            initPhysics();
            handlers();
        }

        function initSVG() {
            for (let i = 0; i < NUM; i++) {
                const circle = document.createElementNS(svgns, 'circle');
                circle.setAttributeNS(null, 'cx', 0);
                circle.setAttributeNS(null, 'cy', 0);
                circle.setAttributeNS(null, 'r', 17);
                DOM.setup(circle);
                svg.appendChild(circle);

                circles.push(circle);
            }
        }

        function initPhysics() {
            engine = Matter.Engine.create();
            engine.world.gravity.y = 0.7;

            for (let i = 0; i < NUM; i++) {
                const ball = Matter.Bodies.circle(50, 0, 17.5, { restitution: 0.8, friction: 0.01 });
                balls.push(ball);
            }
        }

        function handlers() {
            window.addEventListener('resize', resize);
            window.addEventListener('orientationchange', resize);
        }

        function resize({ isForce } = {}) {
            if (!_this.isActive) return;
            const width = window.innerWidth;

            const ratio = (() => {
                if (width < 1025) return 100 / 110;
                const rect = container.getBoundingClientRect();
                return rect.width / rect.height;
            })();

            svg.setAttributeNS(null, 'viewBox', `0 0 100 ${100 / ratio}`);
            svg.setAttributeNS(null, 'height', 100 / ratio);

            // double check has actually changed
            if (!isForce && width === lastWidth && lastRatio === ratio) return;
            lastWidth = width;
            lastRatio = ratio;

            reset(ratio);
        }

        function reset(ratio) {
            Matter.World.clear(engine.world, false);
            engine.world.gravity.y = 0.7;

            world.height = 100 / ratio;
            const th = 100;
            ground = Matter.Bodies.rectangle(50, world.height + 0.5 * th, 100, th, { isStatic: true });
            leftWall = Matter.Bodies.rectangle(-0.5 * th, 0, th, world.height * 3, {
                isStatic: true,
            });
            rightWall = Matter.Bodies.rectangle(100 + 0.5 * th, 0, th, world.height * 3, {
                isStatic: true,
            });

            balls.forEach((ball) => {
                vec.x = OMath.random(0, 100);
                vec.y = OMath.random(0, -300);
                Matter.Body.setPosition(ball, vec);
                vec.x = OMath.random(-1, 1);
                vec.y = 0;
                Matter.Body.setVelocity(ball, vec);
            });

            Matter.World.add(engine.world, [ground, leftWall, rightWall, ...balls]);
        }

        function update(dt) {
            time += dt * 0.0012;
            const gravity = OMath.mix(-0.1, 0.7, OMath.smoothstep(-0.8, 0.5, Math.sin(time)));
            engine.world.gravity.y = gravity;
            Matter.Engine.update(engine, Math.min(dt, 20));

            balls.forEach((ball, i) => {
                circles[i].css({
                    x: ball.position.x,
                    y: ball.position.y,
                });

                if (ball.position.y > world.height) {
                    vec.x = ball.position.x;
                    vec.y = 0;
                    Matter.Body.setPosition(ball, vec);
                }
            });
        }

        this.animateIn = () => {
            time = 0;
            _this.isActive = true;
            resize({ isForce: true });
            Tick.add(update);
        };

        this.animateOut = () => {
            _this.isActive = false;
            Tick.remove(update);
        };
    }
}

function reflect(out, v, n) {
    var d = v[0] * n[0] + v[1] * n[1];
    out[0] = v[0] - 2 * n[0] * d;
    out[1] = v[1] - 2 * n[1] * d;
}

function normalize(out, a) {
    var x = a[0],
        y = a[1];
    var len = x * x + y * y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    return out;
}
