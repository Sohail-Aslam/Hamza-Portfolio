// src/pages/AboutObjects.tsx

import { useState, useRef, useEffect, useCallback } from 'react';
import spriteImg from '../../assets/spritesheets/aboutv3.webp';
import spriteData from '../../assets/spritesheets/aboutv3.json'
import { useBomb } from '../../Context/BombContext'
import RopeCanvas from '../RopeCanvs';

export default function AboutObjects() {
    const { elementRefs, hitElementsTransforms } = useBomb();
    const [areAllShrunk, setAreAllShrunk] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    interface Frame {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    const [currentContainerWidth, setCurrentContainerWidth] = useState(0);

    interface CustomShape {
        name: string;
        expandedLeft: string;
        expandedTop: string;
        rotation: number;
        scale: number;
        delay: number;
        heading: string;
        shrunkWidth: string;
        shrunkHeight: string;
        shrunkText?: string;
        shrunkBorderColor?: string;
        colSpan?: number;
    }

    const getFrameByName = (name: string): Frame => {
        const frame = (spriteData.frames as Record<string, { frame: Frame }>)[name]?.frame;
        if (!frame) throw new Error(`Frame "${name}" not found in spriteData.frames`);
        return frame;
    };

    const parsePixelValue = (pixelString: string): number => {
        return parseFloat(pixelString.replace('px', ''));
    };

    const shapes: CustomShape[] = [
        { name: 'user.png', heading: "Dev philosophy", expandedLeft: '34%', expandedTop: '17%', rotation: 0, scale: 1, delay: 500, shrunkWidth: '530px', shrunkHeight: '200px', shrunkText: 'I embarked on a self-taught coding journey, and from the moment I wrote my first Hello world!, I knew I had found the perfect career path to leverage my skills. My passion for mathematics has been a driving force, honing my problem-solving abilities and leading me to excel in various math Olympics', shrunkBorderColor: 'blue-700', colSpan: 2 },
        { name: 'atom.png', heading: "Current Focus", expandedLeft: '55%', expandedTop: '19%', rotation: 0, scale: 1, delay: 50, shrunkWidth: '260px', shrunkHeight: '250px', shrunkText: 'Fundamental data structures and operations.', shrunkBorderColor: 'purple-500' },
        { name: 'location (1).png', heading: "Where I\'m based", expandedLeft: '42%', expandedTop: '28%', rotation: 0, scale: 1, delay: 400, shrunkWidth: '260px', shrunkHeight: '100px', shrunkText: 'Geographical data and mapping services.', shrunkBorderColor: 'red-500' },
        { name: 'cap.png', heading: "Education highlights", expandedLeft: '35%', expandedTop: '48%', rotation: 0, scale: 1, delay: 200, shrunkWidth: '260px', shrunkHeight: '130px', shrunkText: 'Academic records and learning paths.', shrunkBorderColor: 'pink-400' },
        { heading: "Tech I use/love", name: 'brain.png', expandedLeft: '70%', expandedTop: '20%', rotation: 0, scale: 1, delay: 100, shrunkWidth: '260px', shrunkHeight: '130px', shrunkText: 'Advanced AI and neural network processing.', shrunkBorderColor: 'white' },
        { name: 'date.png', heading: "Dev milestones.", expandedLeft: '40%', expandedTop: '63%', rotation: 0, scale: 1, delay: 300, shrunkWidth: '260px', shrunkHeight: '220px', shrunkText: 'Event scheduling and timeline management.', shrunkBorderColor: 'red-500' },
        { name: 'heart.png', heading: "What I do beyond coding", expandedLeft: '85%', expandedTop: '35%', rotation: 0, scale: 0.9, delay: 350, shrunkWidth: '260px', shrunkHeight: '200px', shrunkText: 'Emotional intelligence and user sentiment analysis.', shrunkBorderColor: 'rose-400' },
        { name: 'wrench.png', heading: "Current Focus", expandedLeft: '59%', expandedTop: '45%', rotation: 0, scale: 1, delay: 550, shrunkWidth: '260px', shrunkHeight: '150px', shrunkText: 'System settings and maintenance tools.', shrunkBorderColor: 'cyan-400' },
        { name: 'text.png', heading: "Contact", expandedLeft: '15%', expandedTop: '75%', rotation: 0, scale: 1, delay: 450, shrunkWidth: '260px', shrunkHeight: '152px', shrunkText: 'Content creation and textual analysis.', shrunkBorderColor: 'blue-200' },
        { name: 'achiv..png', heading: "Achivement", expandedLeft: '55%', expandedTop: '67%', rotation: 0, scale: 1, delay: 0, shrunkWidth: '260px', shrunkHeight: '100px', shrunkText: 'User achievements and milestones.', shrunkBorderColor: 'yellow-300' },
        { heading: "Expertise area", name: 'briefcase.png', expandedLeft: '79%', expandedTop: '79%', rotation: 0, scale: 1, delay: 150, shrunkWidth: '260px', shrunkHeight: '148px', shrunkText: 'Business assets and financial management.', shrunkBorderColor: 'amber-300' },
    ];

    const getGridParameters = useCallback((width: number) => {
        let cols = 4;
        let columnGap = 20;
        let rowGap = 20;
        let paddingTop = 120;
        let paddingLeft = 20;
        let paddingRight = 20;

        if (width < 600) {
            cols = 1;
            columnGap = 15;
            rowGap = 15;
            paddingTop = 60;
            paddingLeft = 10;
            paddingRight = 10;
        } else if (width < 989) { // Adjusted breakpoint for clarity
            cols = 2;
            columnGap = 20;
            rowGap = 20;
            paddingTop = 70;
            paddingLeft = 15;
            paddingRight = 15;
        } else if (width < 1200) {
            cols = 3;
            columnGap = 25;
            rowGap = 25;
            paddingTop = 80;
            paddingLeft = 20;
            paddingRight = 20;
        }

        const availableWidth = width - paddingLeft - paddingRight - (columnGap * (cols - 1));
        const baseItemWidth = availableWidth / cols;

        return { cols, columnGap, rowGap, paddingTop, paddingLeft, baseItemWidth };
    }, []);

    const calculateShrunkPositions = useCallback((containerWidth: number) => {
        if (containerWidth === 0) {
            return { positions: new Map(), maxContainerHeight: 0, paddingTop: 0 };
        }

        const positions = new Map<string, { left: number, top: number }>();

        const { cols, columnGap, rowGap, paddingTop, paddingLeft, baseItemWidth } = getGridParameters(containerWidth);

        const columnHeights: number[] = Array(cols).fill(paddingTop);
        const columnXPositions: number[] = [];
        for (let i = 0; i < cols; i++) {
            columnXPositions.push(paddingLeft + (i * (baseItemWidth + columnGap)));
        }

        const indexedShapes = shapes.map((shape, originalIndex) => ({ shape, originalIndex }));
        indexedShapes.sort((a, b) => a.originalIndex - b.originalIndex);

        indexedShapes.forEach(({ shape, originalIndex }) => {
            const id = `about-shape-${originalIndex}`;
            // Ensure colSpan doesn't exceed the number of available columns
            const actualColSpan = Math.min(shape.colSpan || 1, cols);

            let bestColumnIndex = -1;
            let minHeight = Infinity;

            // Find the best starting column for the item
            for (let i = 0; i <= cols - actualColSpan; i++) {
                let maxBlockHeightInCurrentSpot = 0;
                for (let j = 0; j < actualColSpan; j++) {
                    maxBlockHeightInCurrentSpot = Math.max(maxBlockHeightInCurrentSpot, columnHeights[i + j]);
                }

                if (maxBlockHeightInCurrentSpot < minHeight) {
                    minHeight = maxBlockHeightInCurrentSpot;
                    bestColumnIndex = i;
                }
            }

            // Fallback if no suitable column found (shouldn't happen with correct logic)
            if (bestColumnIndex === -1) {
                bestColumnIndex = 0;
            }

            const currentLeft = columnXPositions[bestColumnIndex];
            const currentTop = minHeight;

            positions.set(id, { left: currentLeft, top: currentTop });

            const itemRenderedHeight = parsePixelValue(shape.shrunkHeight);

            // Update column heights for all columns spanned by the current item
            for (let i = 0; i < actualColSpan; i++) {
                columnHeights[bestColumnIndex + i] = currentTop + itemRenderedHeight + rowGap;
            }
        });

        const maxContainerHeight = Math.max(...columnHeights);

        return { positions, maxContainerHeight, paddingTop };
    }, [shapes, getGridParameters]);

    const [shrunkLayoutData, setShrunkLayoutData] = useState<{ positions: Map<string, { left: number, top: number }>, maxContainerHeight: number, paddingTop: number }>(
        { positions: new Map(), maxContainerHeight: 0, paddingTop: 0 }
    );

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const newWidth = containerRef.current.clientWidth;
                setCurrentContainerWidth(newWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (currentContainerWidth > 0) {
            const newLayoutData = calculateShrunkPositions(currentContainerWidth);
            setShrunkLayoutData(prevLayoutData => {
                if (
                    prevLayoutData.maxContainerHeight === newLayoutData.maxContainerHeight &&
                    prevLayoutData.paddingTop === newLayoutData.paddingTop &&
                    prevLayoutData.positions.size === newLayoutData.positions.size &&
                    Array.from(prevLayoutData.positions.keys()).every(key => {
                        const p1 = prevLayoutData.positions.get(key);
                        const p2 = newLayoutData.positions.get(key);
                        return p1 && p2 && p1.left === p2.left && p1.top === p2.top;
                    })
                ) {
                    return prevLayoutData;
                }
                return newLayoutData;
            });
        }
    }, [currentContainerWidth, calculateShrunkPositions]);

    const handleRopePulled = useCallback(() => {
        setAreAllShrunk(prev => !prev);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-auto m-10">
            <RopeCanvas onRopePulled={handleRopePulled} isShrunk={areAllShrunk} />

            <div
                ref={containerRef}
                className="relative mx-auto w-full max-w-[1200px] h-full "
                style={{
                    height: areAllShrunk ? `${shrunkLayoutData.maxContainerHeight}px` : '100%',
                    transition: 'height 0.7s ease-in-out',
                    paddingTop: areAllShrunk ? `${shrunkLayoutData.paddingTop}px` : '0px'
                }}
            >
                {shapes.map((shape, index) => {
                    const id = `about-shape-${index}`;
                    const transformFromBomb = hitElementsTransforms.get(id);
                    const frame = getFrameByName(shape.name);

                    const targetShrunkPosition = shrunkLayoutData.positions.get(id);

                    const currentLeft = areAllShrunk && targetShrunkPosition
                        ? `${targetShrunkPosition.left}px`
                        : shape.expandedLeft;
                    const currentTop = areAllShrunk && targetShrunkPosition
                        ? `${targetShrunkPosition.top}px`
                        : shape.expandedTop;

                    const { baseItemWidth, columnGap, cols } = getGridParameters(currentContainerWidth);
                    const actualColSpan = Math.min(shape.colSpan || 1, cols); // Ensure colSpan respects current cols

                    const currentWidth = areAllShrunk
                        ? `${(baseItemWidth * actualColSpan) + (columnGap * (actualColSpan - 1))}px`
                        : `${frame.w * shape.scale}px`;

                    const currentHeight = areAllShrunk
                        ? shape.shrunkHeight
                        : `${frame.h * shape.scale}px`;

                    let baseContainerTransform = areAllShrunk
                        ? 'none'
                        : `translate(-50%, -50%) scale(${shape.scale}) rotate(${shape.rotation}deg)`;

                    const finalContainerTransform = transformFromBomb
                        ? `${baseContainerTransform} ${transformFromBomb}`
                        : baseContainerTransform;

                    const iconOffsetLeftShrunk = -35;
                    const iconOffsetTopShrunk = -35;
                    const iconScaleShrunk = 0.5;

                    const iconWrapperTransform = areAllShrunk
                        ? `translate(${iconOffsetLeftShrunk}px, ${iconOffsetTopShrunk}px) scale(${iconScaleShrunk})`
                        : `translate(-50%, -50%) scale(${shape.scale})`;

                    const infoBoxStyles: React.CSSProperties = areAllShrunk
                        ? {
                            width: '100%',
                            height: '100%',
                            opacity: 1,
                            pointerEvents: 'auto',
                            transformOrigin: 'top left',
                            borderColor: shape.shrunkBorderColor ? `var(--tw-border-${shape.shrunkBorderColor})` : 'black',
                            transition: 'opacity 0.5s ease-out 0.2s',
                        }
                        : {
                            width: '0',
                            height: '0',
                            opacity: 0,
                            pointerEvents: 'none',
                            transformOrigin: 'top left',
                            borderColor: shape.shrunkBorderColor ? `var(--tw-border-${shape.shrunkBorderColor})` : 'black',
                            transition: 'opacity 0s ease-out',
                        };

                    const infoBoxClasses = `absolute border-3 border-solid rounded-xl bg-white flex flex-col justify-start items-start p-2 gap-1 overflow-hidden transition-all duration-700 ease-in-out ${areAllShrunk ? 'overflow-y-auto' : ''}`;

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
                                transform: finalContainerTransform,
                                animationDelay: `${shape.delay}ms`,
                                willChange: 'left, top, transform, width, height, opacity',
                                zIndex: 0,
                                width: currentWidth,
                                height: currentHeight,
                            }}
                        >
                            <div
                                className="absolute transition-transform duration-700 ease-in-out"
                                style={{
                                    width: `${frame.w}px`,
                                    height: `${frame.h}px`,
                                    transform: iconWrapperTransform,
                                    transformOrigin: 'center center',
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
                                <div
                                    className="font-bold text-lg text-black whitespace-nowrap overflow-hidden text-ellipsis"
                                    style={{
                                        paddingLeft: areAllShrunk ? `${iconOffsetLeftShrunk + (frame.w * iconScaleShrunk) + 20}px` : '0px',
                                        paddingTop: areAllShrunk ? '5px' : '0px',
                                        fontSize: currentContainerWidth < 600 ? '0.9rem' : '1.125rem'
                                    }}
                                >
                                    {shape.heading.replace('.png', '').replace('.jpg', '')}
                                </div>
                                <div
                                    className="text-sm text-gray-700 "
                                    style={{
                                        paddingLeft: areAllShrunk ? `${iconOffsetLeftShrunk + (frame.w * iconScaleShrunk) + 10}px` : '0px',
                                        fontSize: currentContainerWidth < 600 ? '0.75rem' : '0.875rem'
                                    }}
                                >
                                    {shape.shrunkText || `More details about ${shape.name.replace('.png', '').replace('.jpg', '')} can be found here.`}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}