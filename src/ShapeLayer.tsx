import { useEffect, useState, } from 'react';
import spriteImg from './assets/spritenew2@0.5x.webp';
import spriteData from './assets/stripenew2@0.5x.json';
import { useBomb } from './component/BombContext'; // adjust path as needed

interface Frame {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Shape {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    delay: number;
    left: string;
    top: string;
    rotation: number;
    scale: number;
}

const createRandomLayout = (count: number) => {
    const positions = [];
    const centerGap = 0;
    const verticalPadding = 0;

    for (let i = 0; i < count; i++) {
        const isLeftSide = Math.random() > 0.5;
        let leftPercent;
        if (isLeftSide) {
            leftPercent = Math.random() * (50 - centerGap / 2);
        } else {
            leftPercent = 50 + centerGap / 2 + Math.random() * (50 - centerGap / 2);
        }

        const topPercent = verticalPadding + Math.random() * (70 - 2 * verticalPadding);

        positions.push({
            left: `${leftPercent}%`,
            top: `${topPercent}%`,
        });
    }

    return positions;
};

export default function ShapeLayer() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const {
        elementRefs,
        hitElementsTransforms,
    } = useBomb();

    useEffect(() => {
        const frameEntries = Object.entries(spriteData.frames);
        const layoutPositions = createRandomLayout(frameEntries.length);

        const parsedShapes = frameEntries.map(([name, val], i) => {
            const { x, y, w, h } = val.frame;
            const { left, top } = layoutPositions[i];

            return {
                name,
                x: -x,
                y: -y,
                width: w,
                height: h,
                delay: i * 50,
                left,
                top,
                rotation: Math.random() * 15 - 7.5,
                scale: 0.35 + Math.random() * 0.1
            };
        });

        setShapes(parsedShapes);
    }, []);

    if (shapes.length === 0) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {shapes.map((shape, index) => {
                const id = `shape-${index}`;
                const transform = hitElementsTransforms.get(id);

                return (
                    <div
                        key={shape.name}
                        ref={(el) => {
                            elementRefs.current[id] = el;
                        }}
                        className="absolute transition-transform duration-700 ease-out"
                        style={{
                            left: shape.left,
                            top: shape.top,
                            width: `${shape.width}px`,
                            height: `${shape.height}px`,
                            transform: `translate(-50%, -50%) scale(${shape.scale}) rotate(${shape.rotation}deg)` + (transform ? ` ${transform}` : "")
                            ,
                            animationDelay: `${shape.delay}ms`,
                            willChange: 'transform',
                            zIndex: 0,
                        }}
                    >
                        <img
                            src={spriteImg}
                            alt=""
                            className="w-full h-full"
                            style={{
                                objectFit: 'none',
                                objectPosition: `${shape.x}px ${shape.y}px`,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
