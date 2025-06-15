not perfect, first make icons go to their shrunk place and shrunk then show box, when expand they hide box and go to fix position

// src/pages/AboutObjectsPage.tsx
import { useState } from 'react';
import spriteImg from '../assets/aboutv3.webp';
import spriteData from '../assets/aboutv3.json';
import { useBomb } from '../component/BombContext';

interface Frame {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface CustomShape {
    name: string;
    expandedLeft: string; // Initial horizontal position when not shrunk
    expandedTop: string;  // Initial vertical position when not shrunk
    rotation: number;
    scale: number; // Initial scale for the icon
    delay: number;
    heading: string,
    // Properties for the shrunk state (when the box appears)
    shrunkWidth?: string; // Width of the info box when shrunk (e.g., '150px')
    shrunkHeight?: string; // Height of the info box when shrunk (e.g., '100px')
    shrunkText?: string; // Custom text content for the info box
    shrunkBorderColor?: string; // Tailwind CSS class for the border color (e.g., 'blue-500')
    expandDirection?: 'top' | 'bottom' | 'left' | 'right'; // Direction the box "grows" from the icon's position
}

const getFrameByName = (name: string): Frame => {
    const frame = (spriteData.frames as Record<string, { frame: Frame }>)[name]?.frame;
    if (!frame) throw new Error(`Frame "${name}" not found in spriteData.frames`);
    return frame;
};

export default function AboutObjects() {
    const { elementRefs, hitElementsTransforms } = useBomb();
    const [areAllShrunk, setAreAllShrunk] = useState(false);

    const shapes: CustomShape[] = [
        // --- Top Row ---
        {
            name: 'user.png', heading: "Dev philosophy",
            expandedLeft: '34%', expandedTop: '17%', // Original position
            rotation: 0, scale: 1, delay: 500,
            shrunkWidth: '530px', shrunkHeight: '200px', shrunkText: 'I embarked on a self-taught coding journey, and from the moment I wrote my first Hello world!, I knew I had found the perfect career path to leverage my skills. My passion for mathematics has been a driving force, honing my problem-solving abilities and leading me to excel in various math Olympics', shrunkBorderColor: 'blue-700',
        },
        {
            name: 'atom.png', heading: "Current Focus",
            expandedLeft: '55%', expandedTop: '19%', // Original position
            rotation: 0, scale: 1, delay: 50,
            shrunkWidth: '260px', shrunkHeight: '250px', shrunkText: 'Fundamental data structures and operations.', shrunkBorderColor: 'purple-500',
        },
        {
            name: 'location (1).png', heading: "Where I'm based",
            expandedLeft: '42%', expandedTop: '28%', // Original position
            rotation: 0, scale: 1, delay: 400,
            shrunkWidth: '260px', shrunkHeight: '100px', shrunkText: 'Geographical data and mapping services.', shrunkBorderColor: 'red-500',
        },

        // --- Middle Row ---
        {
            name: 'cap.png', heading: "Education highlights",
            expandedLeft: '35%', expandedTop: '48%', // Original position
            rotation: 0, scale: 1, delay: 200,
            shrunkWidth: '260px', shrunkHeight: '130px', shrunkText: 'Academic records and learning paths.', shrunkBorderColor: 'pink-400',
        },
        {
            heading: "Tech I use/love",
            name: 'brain.png',
            expandedLeft: '70%', expandedTop: '20%', // Original position
            rotation: 0, scale: 1, delay: 100,
            shrunkWidth: '260px', shrunkHeight: '130px', shrunkText: 'Advanced AI and neural network processing.', shrunkBorderColor: 'white',
        },
        {
            name: 'date.png', heading: "Dev milestones.",
            expandedLeft: '40%', expandedTop: '63%', // Original position
            rotation: 0, scale: 1, delay: 300,
            shrunkWidth: '260px', shrunkHeight: '220px', shrunkText: 'Event scheduling and timeline management.', shrunkBorderColor: 'red-500',
        },
        {
            name: 'heart.png', heading: "What I do beyond coding",
            expandedLeft: '85%', expandedTop: '35%', // Original position
            rotation: 0, scale: 0.9, delay: 350,
            shrunkWidth: '260px', shrunkHeight: '200px', shrunkText: 'Emotional intelligence and user sentiment analysis.', shrunkBorderColor: 'rose-400',
        },

        // --- Bottom Row ---
        {
            name: 'wrench.png', heading: "Current Focus",
            expandedLeft: '59%', expandedTop: '45%', // Original position
            rotation: 0, scale: 1, delay: 550,
            shrunkWidth: '260px', shrunkHeight: '150px', shrunkText: 'System settings and maintenance tools.', shrunkBorderColor: 'cyan-400',
        },
        {
            name: 'text.png', heading: "Contact",
            expandedLeft: '15%', expandedTop: '75%', // Original position
            rotation: 0, scale: 1, delay: 450,
            shrunkWidth: '260px', shrunkHeight: '152px', shrunkText: 'Content creation and textual analysis.', shrunkBorderColor: 'blue-200',
        },
        {
            name: 'achiv..png', heading: "Achivement",
            expandedLeft: '55%', expandedTop: '67%', // Original position
            rotation: 0, scale: 1, delay: 0,
            shrunkWidth: '260px', shrunkHeight: '100px', shrunkText: 'User achievements and milestones.', shrunkBorderColor: 'yellow-300',
        },
        {
            heading: "Expertise area",
            name: 'briefcase.png',
            expandedLeft: '79%', expandedTop: '79%', // Original position
            rotation: 0, scale: 1, delay: 150,
            shrunkWidth: '260px', shrunkHeight: '148px', shrunkText: 'Business assets and financial management.', shrunkBorderColor: 'amber-300',
        },
    ];

    const handleToggleAllShrink = () => {
        setAreAllShrunk(prevState => !prevState);
    };

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <button
                onClick={handleToggleAllShrink}
                className="absolute top-4 left-4 z-10 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer pointer-events-auto rounded-md"
            >
                {areAllShrunk ? 'Expand All Objects' : 'Shrink All Objects'}
            </button>

            {/* Conditional container based on areAllShrunk */}
            {areAllShrunk ? (
                <div className="relative mx-auto w-full max-w-[1200px] overflow-auto flex flex-wrap justify-center items-start gap-5 p-18 pointer-events-auto">
                    {shapes.map((shape, index) => {
                        const id = `about-shape-${index}`;
                        const transformFromBomb = hitElementsTransforms.get(id);
                        const frame = getFrameByName(shape.name);

                        // Icon wrapper scale and translation for the shrunk state
                        let iconWrapperTransform = `translate(-15px, -15px) scale(0.5)`;

                        const infoBoxStyles: React.CSSProperties = {
                            width: shape.shrunkWidth,
                            height: shape.shrunkHeight,
                            opacity: 1,
                            pointerEvents: 'auto',
                            borderColor: shape.shrunkBorderColor ? `var(--tw-border-${shape.shrunkBorderColor})` : 'black',
                        };

                        const infoBoxClasses = `relative border-3 border-solid rounded-xl bg-white
                                                flex flex-col justify-start items-start p-2 gap-1
                                                overflow-hidden`; // Added overflow-hidden to contain text

                        return (
                            <div
                                key={id}
                                ref={(el: HTMLDivElement | null) => {
                                    if (el) elementRefs.current[id] = el;
                                }}
                                className="relative"
                                style={{
                                    // No fixed left/top when shrunk; flexbox/grid handles it
                                    // Apply bomb transform to the outer container if needed
                                    transform: transformFromBomb,
                                    zIndex: 0,
                                    // Set a min-width/height for the flex item to ensure it takes space
                                    minWidth: '250px', // Adjust as needed
                                    minHeight: '150px', // Adjust as needed
                                }}
                            >
                                <div
                                    className="absolute"
                                    style={{
                                        width: `${frame.w}px`,
                                        height: `${frame.h}px`,
                                        transform: iconWrapperTransform,
                                        transformOrigin: 'top left',
                                        zIndex: 20,
                                    }}
                                >
                                    <img
                                        src={spriteImg}
                                        alt={`Icon for ${shape.name}`}
                                        style={{
                                            objectFit: 'none',
                                            objectPosition: `${-frame.x}px ${-frame.y}px`,
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                </div>

                                <div
                                    className={infoBoxClasses}
                                    style={infoBoxStyles}
                                >
                                    <div className="font-bold text-lg text-black whitespace-nowrap overflow-hidden text-ellipsis pl-4">
                                        {shape.heading.replace('.png', '').replace('.jpg', '')}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {shape.shrunkText || `More details about ${shape.name.replace('.png', '').replace('.jpg', '')} can be found here.`}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Original layout for expanded state
                <div className="relative mx-auto w-70% max-w-[1100px] h-full">
                    {shapes.map((shape, index) => {
                        const id = `about-shape-${index}`;
                        const transformFromBomb = hitElementsTransforms.get(id);
                        const frame = getFrameByName(shape.name);

                        const currentLeft = shape.expandedLeft;
                        const currentTop = shape.expandedTop;

                        let wrapperTransform = `translate(-50%, -50%) scale(${shape.scale}) rotate(${shape.rotation}deg)`;
                        if (transformFromBomb) {
                            wrapperTransform += ` ${transformFromBomb}`;
                        }

                        let iconWrapperTransform = `translate(-50%, -50%) scale(${shape.scale})`;

                        const infoBoxStyles: React.CSSProperties = {
                            width: '0',
                            height: '0',
                            opacity: 0,
                            pointerEvents: 'none',
                            borderColor: shape.shrunkBorderColor ? `var(--tw-border-${shape.shrunkBorderColor})` : 'black',
                        };

                        const infoBoxClasses = `absolute border-3 border-solid rounded-xl
                                                flex flex-col justify-start items-start p-2 gap-1`;

                        return (
                            <div
                                key={id}
                                ref={(el: HTMLDivElement | null) => {
                                    if (el) elementRefs.current[id] = el;
                                }}
                                className="absolute"
                                style={{
                                    left: currentLeft,
                                    top: currentTop,
                                    transform: wrapperTransform,
                                    zIndex: 0,
                                }}
                            >
                                <div
                                    className="absolute"
                                    style={{
                                        width: `${frame.w}px`,
                                        height: `${frame.h}px`,
                                        transform: iconWrapperTransform,
                                        transformOrigin: 'top left',
                                        zIndex: 20,
                                    }}
                                >
                                    <img
                                        src={spriteImg}
                                        alt={`Icon for ${shape.name}`}
                                        style={{
                                            objectFit: 'none',
                                            objectPosition: `${-frame.x}px ${-frame.y}px`,
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                </div>

                                {/* Info box is hidden/zero-sized when expanded */}
                                <div
                                    className={infoBoxClasses}
                                    style={infoBoxStyles}
                                >
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
