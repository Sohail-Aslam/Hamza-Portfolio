// src/pages/AboutObjectsPage.tsx
import { useState } from 'react';
import spriteImg from '../assets/about-objectsv2@2.webp';
import spriteData from '../assets/about-objectsv2@2.json';
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
    shrunkLeft: string; // Horizontal position when shrunk (CSS percentage)
    shrunkTop: string;  // Vertical position when shrunk (CSS percentage)
    rotation: number;
    scale: number; // Initial scale for the icon
    delay: number;
    heading:string,
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
            shrunkLeft: '22%', shrunkTop: '15%', // Shrunk position
            rotation: 0, scale: 1, delay: 500,
            shrunkWidth: '530px', shrunkHeight: '200px', shrunkText: 'I embarked on a self-taught coding journey, and from the moment I wrote my first Hello world!, I knew I had found the perfect career path to leverage my skills. My passion for mathematics has been a driving force, honing my problem-solving abilities and leading me to excel in various math Olympics', shrunkBorderColor: 'blue-700',
        },
        {
            name: 'atom.png', heading:"Current Focus",
            expandedLeft: '55%', expandedTop: '19%', // Original position
            shrunkLeft: '46%', shrunkTop: '38%', // Shrunk position
            rotation: 0, scale: 1, delay: 50,
            shrunkWidth: '243px', shrunkHeight: '250px', shrunkText: 'Fundamental data structures and operations.', shrunkBorderColor: 'purple-500',
        },
        {
            name: 'location (1).png', heading: "Where I'm based",
            expandedLeft: '42%', expandedTop: '28%', // Original position
            shrunkLeft: '69%', shrunkTop: '15%', // Shrunk position
            rotation: 0, scale: 1, delay: 400,
            shrunkWidth: '220px', shrunkHeight: '100px', shrunkText: 'Geographical data and mapping services.', shrunkBorderColor: 'red-500',
        },

        // --- Middle Row ---
        {
            name: 'cap.png', heading: "Education highlights",
            expandedLeft: '35%', expandedTop: '48%', // Original position
            shrunkLeft: '22%', shrunkTop: '38%', // Shrunk position
            rotation: 0, scale: 1, delay: 200,
            shrunkWidth: '258px', shrunkHeight: '130px', shrunkText: 'Academic records and learning paths.', shrunkBorderColor: 'pink-400',
        },
        {
            heading: "Tech I use/love",
            name: 'brain.png',
            expandedLeft: '70%', expandedTop: '20%', // Original position
            shrunkLeft: '69%', shrunkTop: '27%', // Shrunk position
            rotation: 0, scale: 1, delay: 100,
            shrunkWidth: '220px', shrunkHeight: '130px', shrunkText: 'Advanced AI and neural network processing.', shrunkBorderColor: 'white',
        },
        {
            name: 'date.png', heading: "Dev milestones.",
            expandedLeft: '40%', expandedTop: '63%', // Original position
            shrunkLeft: '46%', shrunkTop: '68%', // Shrunk position
            rotation: 0, scale: 1, delay: 300,
            shrunkWidth: '247px', shrunkHeight: '220px', shrunkText: 'Event scheduling and timeline management.', shrunkBorderColor: 'red-500',
        },
        {
            name: 'heart.png', heading: "What I do beyond coding",
            expandedLeft: '85%', expandedTop: '35%', // Original position
            shrunkLeft: '69%', shrunkTop: '42%', // Shrunk position
            rotation: 0, scale: 0.9, delay: 350,
            shrunkWidth: '243px', shrunkHeight: '200px', shrunkText: 'Emotional intelligence and user sentiment analysis.', shrunkBorderColor: 'rose-400',
        },

        // --- Bottom Row ---
        {
            name: 'wrench.png', heading: "Current Focus",
            expandedLeft: '59%', expandedTop: '45%', // Original position
            shrunkLeft: '22%', shrunkTop: '55%', // Shrunk position
            rotation: 0, scale: 1, delay: 550,
            shrunkWidth: '258px', shrunkHeight: '150px', shrunkText: 'System settings and maintenance tools.', shrunkBorderColor: 'cyan-400',
        },
        {
            name: 'text.png', heading: "Contact",
            expandedLeft: '15%', expandedTop: '75%', // Original position
            shrunkLeft: '22%', shrunkTop: '75%', // Shrunk position
            rotation: 0, scale: 1, delay: 450,
            shrunkWidth: '259px', shrunkHeight: '152px', shrunkText: 'Content creation and textual analysis.', shrunkBorderColor: 'blue-200',
        },
        {
            name: 'achiv..png', heading: "Achivement",
            expandedLeft: '55%', expandedTop: '67%', // Original position
            shrunkLeft: '69%', shrunkTop: '80%', // Shrunk position
            rotation: 0, scale: 1, delay: 0,
            shrunkWidth: '215px', shrunkHeight: '100px', shrunkText: 'User achievements and milestones.', shrunkBorderColor: 'yellow-300',
        },
        {
            heading: "Expertise area",
            name: 'briefcase.png',
            expandedLeft: '79%', expandedTop: '79%', // Original position
            shrunkLeft: '69%', shrunkTop: '62.4%', // Shrunk position (kept the same as original in your example)
            rotation: 0, scale: 1, delay: 150,
            shrunkWidth: '215px', shrunkHeight: '148px', shrunkText: 'Business assets and financial management.', shrunkBorderColor: 'amber-300',
        },
    ];

    const handleToggleAllShrink = () => {
        setAreAllShrunk(prevState => !prevState);
    };

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Button to trigger the animation for all elements */}
            <button
                onClick={handleToggleAllShrink}
                className="absolute top-4 left-4 z-10 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer pointer-events-auto rounded-md"
            >
                {areAllShrunk ? 'Expand All Objects' : 'Shrink All Objects'}
            </button>

            {/* Fixed container to center the layout and constrain width */}
            <div className="relative mx-auto w-full max-w-[1200px] h-full">
                {shapes.map((shape, index) => {
                    const id = `about-shape-${index}`;
                    const transformFromBomb = hitElementsTransforms.get(id);
                    const frame = getFrameByName(shape.name);

                    // Determine current position based on areAllShrunk state
                    const currentLeft = areAllShrunk ? shape.shrunkLeft : shape.expandedLeft;
                    const currentTop = areAllShrunk ? shape.shrunkTop : shape.expandedTop;

                    // This transform is only for the initial centering and scale/rotation,
                    // and any bomb effects. The position is handled by left/top.
                    let wrapperTransform = `translate(-50%, -50%) scale(${shape.scale}) rotate(${shape.rotation}deg)`;
                    if (transformFromBomb) {
                        wrapperTransform += ` ${transformFromBomb}`;
                    }

                    // Icon wrapper scale and translation for the shrunk state
                    // This transform applies to the div holding the image
                    // Modified to align top-left when shrunk, and remain centered when expanded
                    let iconWrapperTransform = `translate(-50%, -50%) scale(${shape.scale})`; // Default expanded state, still centered
                    if (areAllShrunk) {
                        // When shrunk, align top-left (remove -50%, -50%) and apply shrink scale
                        iconWrapperTransform = `translate(-15px, -15px) scale(0.3)`;
                    }

                    let infoBoxStyles: React.CSSProperties = {
                        width: '0',
                        height: '0',
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'width 0.7s ease-out, height 0.7s ease-out, opacity 0.5s ease-out 0.2s, transform 0.7s ease-out',
                        transformOrigin: 'top left', // Ensure scaling/translating is relative to the top-left
                        // Apply borderColor directly as an inline style using Tailwind's CSS variables
                        borderColor: shape.shrunkBorderColor ? `var(--tw-border-${shape.shrunkBorderColor})` : 'black',
                    };

                    let infoBoxClasses = `absolute border-3 border-solid rounded-xl
                                          flex flex-col justify-start items-start p-2 gap-1
                                          `;

                    // The 'if (shape.shrunkBorderColor)' block that used to add classes
                    // via string concatenation can now be entirely removed or commented out:
                    // if (shape.shrunkBorderColor) {
                    //     infoBoxClasses += ` border-${shape.shrunkBorderColor}`;
                    // } else {
                    //     infoBoxClasses += ` border-black`;
                    // }

                    if (areAllShrunk) {
                        const targetWidth = shape.shrunkWidth ? parseFloat(shape.shrunkWidth) : frame.w * 0.3;
                        const targetHeight = shape.shrunkHeight ? parseFloat(shape.shrunkHeight) : frame.h * 0.3;

                        let offsetX = 0;
                        let offsetY = 0;

                        // Calculate offset for expand direction
                        switch (shape.expandDirection) {
                            case 'top':
                                offsetY = -targetHeight;
                                break;
                            case 'left':
                                offsetX = -targetWidth;
                                break;
                            case 'bottom':
                                // No offset needed as it expands downwards
                                break;
                            case 'right':
                                // No offset needed as it expands to the right
                                break;
                        }

                        infoBoxStyles = {
                            width: shape.shrunkWidth || `${targetWidth}px`,
                            height: shape.shrunkHeight || `${targetHeight}px`,
                            transform: `translate(${offsetX}px, ${offsetY}px)`,
                            opacity: 1,
                            pointerEvents: 'auto',
                            transition: 'width 0.7s ease-out, height 0.7s ease-out, opacity 0.5s ease-out 0.2s, transform 0.7s ease-out',
                            transformOrigin: 'top left',
                            // Apply borderColor here as well for the shrunk state
                            borderColor: shape.shrunkBorderColor ? `var(--tw-border-${shape.shrunkBorderColor})` : 'black',
                        };
                    }

                    return (
                        <div
                            key={id}
                            ref={(el: HTMLDivElement | null) => {
                                if (el) elementRefs.current[id] = el;
                            }}
                            className="absolute transition-all duration-700 ease-in-out"
                            style={{
                                left: currentLeft,
                                top: currentTop,
                                transform: wrapperTransform,
                                animationDelay: `${shape.delay}ms`,
                                willChange: 'left, top, transform',
                                zIndex: 0,
                            }}
                        >
                            {/* Inner wrapper for the icon to handle its specific scaling and position */}
                            <div
                                className="absolute transition-transform duration-700 ease-in-out"
                                style={{
                                    width: `${frame.w}px`, // Define the intrinsic size of the icon area
                                    height: `${frame.h}px`, // Define the intrinsic size of the icon area
                                    transform: iconWrapperTransform, // Apply the icon's scaling/translation here
                                    transformOrigin: 'top left', // Scale from the top left of the icon's original frame
                                    zIndex: 20,
                                }}
                            >
                                <img
                                    src={spriteImg}
                                    alt={`Icon for ${shape.name}`}
                                    style={{
                                        objectFit: 'none',
                                        objectPosition: `${-frame.x}px ${-frame.y}px`,
                                        width: '100%', // Make the image fill its container
                                        height: '100%', // Make the image fill its container
                                    }}
                                />
                            </div>

                            <div
                                className={infoBoxClasses}
                                style={infoBoxStyles} // Apply the style object here
                            >
                               
                               {areAllShrunk && (
                                    <>
                                        <div className="font-bold text-lg text-black whitespace-nowrap overflow-hidden text-ellipsis pl-4">
                                            {shape.heading.replace('.png', '').replace('.jpg', '')}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {shape.shrunkText || `More details about ${shape.name.replace('.png', '').replace('.jpg', '')} can be found here.`}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}