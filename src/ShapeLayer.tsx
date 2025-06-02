import spriteImg from './assets/spritenew2@0.5x.webp';
import spriteData from './assets/stripenew2@0.5x.json';
import { useBomb } from './component/BombContext'; // adjust path as needed

// If you need useEffect for other purposes in this component, uncomment this line:
// import { useEffect } from 'react';

interface Frame {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface CustomShape {
    name: string;
    left: string;
    top: string;
    rotation: number;
    scale: number;
    delay: number;
}

const getFrameByName = (name: string): Frame => {
    // Asserting the type of spriteData.frames for safer access
    const frame = (spriteData.frames as Record<string, { frame: Frame }>)[name]?.frame;
    if (!frame) throw new Error(`Frame "${name}" not found in spriteData.frames`);
    return frame;
};

export default function ShapeLayer() {
    const { elementRefs, hitElementsTransforms } = useBomb();
    const shapes: CustomShape[] = [
        { name: '470d3c201173311.666ff73151897 (1) (1) (1).png', left: '15%', top: '20%', rotation: 10, scale: 0.4, delay: 0 },//owl
        { name: '6845771.png', left: '90%', top: '8%', rotation: -20, scale: .5, delay: 50 },//dice
        { name: '8017929.png', left: '20%', top: '38%', rotation: 45, scale: 0.5, delay: 100 },//bomb
        { name: '8055961.png', left: '75%', top: '70%', rotation: -5, scale: 0.42, delay: 150 },//test tube
        { name: '11368543.png', left: '5%', top: '50%', rotation: 25, scale: 0.38, delay: 200 },// pop pink glass
        { name: 'abstract-preview-18-p-500.png', left: '92%', top: '40%', rotation: -30, scale: 0.48, delay: 250 },//blue pink triangle
        { name: 'abstract-preview-24-p-500.png', left: '40%', top: '10%', rotation: 15, scale: 0.3, delay: 300 },//blue pluffy 
        { name: 'abstract-preview-34-p-500.png', left: '25%', top: '50%', rotation: -10, scale: 0.55, delay: 350 },//9 dots plate, Pink
        { name: 'abstract-preview-43-p-500.png', left: '55%', top: '85%', rotation: 0, scale: 0.4, delay: 400 },//3 circle shape
        { name: 'abstract-preview-51-p-500.png', left: '4%', top: '12%', rotation: 60, scale: 0.32, delay: 450 },
        { name: 'abstract-vol3-preview-8-p-500.png', left: '10%', top: '70%', rotation: -40, scale: 0.45, delay: 500 },
        { name: 'abstract-vol3-preview-12.png', left: '95%', top: '60%', rotation: 30, scale: 0.52, delay: 550 },//cactus
        { name: 'inflatable-vol2-21-p-500.png', left: '35%', top: '35%', rotation: -15, scale: 0.37, delay: 600 },
        { name: 'm010t0519_j_shape_element_30aug22.png', left: '65%', top: '20%', rotation: 50, scale: 0.49, delay: 650 },
        { name: 'shape_14.png', left: '20%', top: '9%', rotation: -25, scale: 0.33, delay: 700 },
        { name: 'shape_18.png', left: '85%', top: '93%', rotation: 10, scale: 0.7, delay: 750 },//C Pink shape
        { name: 'shape_27.png', left: '75%', top: '45%', rotation: -35, scale: 0.41, delay: 800 },
        { name: 'star.png', left: '84%', top: '25%', rotation: 20, scale: 0.28, delay: 850 },//star
    ];

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {shapes.map((shape, index) => {
                const id = `shape-${index}`;
                const transform = hitElementsTransforms.get(id);
                const frame = getFrameByName(shape.name);

                return (
                    <div
                        key={shape.name} // Using shape.name as key for uniqueness
                        ref={(el: HTMLDivElement | null) => { // Explicitly type the ref callback parameter
                            if (el) elementRefs.current[id] = el;
                        }}
                        className="absolute transition-transform duration-700 ease-out"
                        style={{
                            left: shape.left,
                            top: shape.top,
                            width: `${frame.w}px`,
                            height: `${frame.h}px`,
                            // Combine initial transform with any bomb-induced transform
                            transform: `translate(-50%, -50%) scale(${shape.scale}) rotate(${shape.rotation}deg)` + (transform ? ` ${transform}` : ''),
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
                                objectPosition: `${-frame.x}px ${-frame.y}px`,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}