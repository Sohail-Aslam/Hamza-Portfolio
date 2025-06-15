import { useState, useRef, useEffect, useCallback } from 'react';
import spriteImg from '../assets/skillsv2v1.webp';
import spriteData from '../assets/skillsv2v1.json';
import { useBomb } from '../component/BombContext';
import { useRopeContext } from '../component/RopeState';
import RopeCanvs from '../component/RopeCanvs';

export default function AboutObjects() {
    const { elementRefs, hitElementsTransforms } = useBomb();
    const containerRef = useRef<HTMLDivElement>(null);
    const { areAllShrunk } = useRopeContext();

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
        { name: 'html.png', heading: 'HTML5', expandedLeft: '34%', expandedTop: '17%', rotation: 0, scale: 1, delay: 500, shrunkWidth: '530px', shrunkHeight: '200px', shrunkText: 'HTML is the standard markup language for building web pages. It defines the structure of content on the web using elements and tags.', shrunkBorderColor: 'blue-700', colSpan: 2 },
        { name: 'css.png', heading: 'CSS3', expandedLeft: '42%', expandedTop: '28%', rotation: 0, scale: 1, delay: 400, shrunkWidth: '260px', shrunkHeight: '100px', shrunkText: 'Stylesheet language for styling HTML documents, with features like flexbox, animations, and media queries.', shrunkBorderColor: 'red-500' },
        { name: 'figma.png', heading: 'Figma', expandedLeft: '35%', expandedTop: '48%', rotation: 0, scale: 1, delay: 200, shrunkWidth: '260px', shrunkHeight: '130px', shrunkText: 'Collaborative interface design tool for designing, prototyping, and iterating on digital products.', shrunkBorderColor: 'pink-400' },
        { heading: 'Git', name: 'git.png', expandedLeft: '70%', expandedTop: '20%', rotation: 0, scale: 1, delay: 100, shrunkWidth: '260px', shrunkHeight: '130px', shrunkText: 'Distributed version control system for tracking changes in source code with branching and collaboration.', shrunkBorderColor: 'white' },
        { name: 'github.png', heading: 'GitHub', expandedLeft: '40%', expandedTop: '63%', rotation: 0, scale: 1, delay: 300, shrunkWidth: '260px', shrunkHeight: '220px', shrunkText: 'Code hosting platform for version control and collaboration using Git with pull requests and issues.', shrunkBorderColor: 'red-500' },
        { name: 'JS.png', heading: 'JavaScript', expandedLeft: '85%', expandedTop: '35%', rotation: 0, scale: 0.9, delay: 350, shrunkWidth: '260px', shrunkHeight: '200px', shrunkText: 'Programming language for web development that enables interactive and dynamic website content.', shrunkBorderColor: 'rose-400' },
        { name: 'nodejs.png', heading: 'Node.js', expandedLeft: '59%', expandedTop: '45%', rotation: 0, scale: 1, delay: 550, shrunkWidth: '260px', shrunkHeight: '150px', shrunkText: 'JavaScript runtime for building scalable server-side applications using non-blocking I/O.', shrunkBorderColor: 'cyan-400' },
        { name: 'react.png', heading: 'React', expandedLeft: '15%', expandedTop: '75%', rotation: 0, scale: 1, delay: 450, shrunkWidth: '260px', shrunkHeight: '152px', shrunkText: 'JavaScript library for building user interfaces with component-based architecture and virtual DOM.', shrunkBorderColor: 'blue-200' },
        { name: 'redux.png', heading: 'Redux', expandedLeft: '55%', expandedTop: '67%', rotation: 0, scale: 1, delay: 0, shrunkWidth: '260px', shrunkHeight: '100px', shrunkText: 'Predictable state container for JavaScript apps, commonly used with React for state management.', shrunkBorderColor: 'yellow-300' },
        { heading: 'SEO', name: 'seo.png', expandedLeft: '79%', expandedTop: '79%', rotation: 0, scale: 1, delay: 150, shrunkWidth: '260px', shrunkHeight: '148px', shrunkText: 'Search Engine Optimization techniques to improve website visibility in search engine results.', shrunkBorderColor: 'amber-300' },
        { name: 'tailwind-css.png', heading: 'Tailwind CSS', expandedLeft: '45%', expandedTop: '80%', rotation: 0, scale: 1, delay: 50, shrunkWidth: '240px', shrunkHeight: '140px', shrunkText: 'Utility-first CSS framework for rapidly building custom designs without leaving your HTML.', shrunkBorderColor: 'blue-400' },
        { name: 'typescript.png', heading: 'TypeScript', expandedLeft: '70%', expandedTop: '80%', rotation: 0, scale: 1, delay: 150, shrunkWidth: '250px', shrunkHeight: '150px', shrunkText: 'Typed superset of JavaScript that compiles to plain JavaScript, adding static types for better tooling.', shrunkBorderColor: 'blue-700' },
        { name: 'vs.png', heading: 'VS Code', expandedLeft: '20%', expandedTop: '90%', rotation: 0, scale: 1, delay: 250, shrunkWidth: '230px', shrunkHeight: '130px', shrunkText: 'Lightweight but powerful source code editor with extensions, debugging, and Git integration.', shrunkBorderColor: 'blue-400' },
        { name: 'wordress.png', heading: 'WordPress', expandedLeft: '85%', expandedTop: '50%', rotation: 0, scale: 1, delay: 350, shrunkWidth: '230px', shrunkHeight: '130px', shrunkText: 'Content management system for creating websites with extensive plugin ecosystem and ease of use.', shrunkBorderColor: 'blue-600' }
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
        } else if (width < 900) {
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
            const id = `skills-shape-${originalIndex}`;
            const colSpan = shape.colSpan || 1;

            let bestColumnIndex = -1;
            let minHeight = Infinity;

            for (let i = 0; i <= cols - colSpan; i++) {
                let maxBlockHeightInCurrentSpot = 0;
                for (let j = 0; j < colSpan; j++) {
                    maxBlockHeightInCurrentSpot = Math.max(maxBlockHeightInCurrentSpot, columnHeights[i + j]);
                }

                if (maxBlockHeightInCurrentSpot < minHeight) {
                    minHeight = maxBlockHeightInCurrentSpot;
                    bestColumnIndex = i;
                }
            }

            if (bestColumnIndex === -1) {
                bestColumnIndex = 0;
            }

            const currentLeft = columnXPositions[bestColumnIndex];
            const currentTop = columnHeights[bestColumnIndex];

            positions.set(id, { left: currentLeft, top: currentTop });

            const itemRenderedHeight = parsePixelValue(shape.shrunkHeight);

            for (let i = 0; i < colSpan; i++) {
                columnHeights[bestColumnIndex + i] = currentTop + itemRenderedHeight + rowGap;
            }
        });

        const maxContainerHeight = Math.max(...columnHeights);

        return { positions, maxContainerHeight, paddingTop };
    }, [shapes, getGridParameters]);

    const [shrunkLayoutData, setShrunkLayoutData] = useState<{ positions: Map<string, { left: number, top: number }>, maxContainerHeight: number, paddingTop: number }>(
        { positions: new Map(), maxContainerHeight: 0, paddingTop: 0 }
    );

    // This useEffect will now *only* set up the resize listener.
    // The initial measurement and layout calculation will happen in a separate effect.
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const newWidth = containerRef.current.clientWidth;
                setCurrentContainerWidth(prevWidth => {
                    if (prevWidth !== newWidth) {
                        return newWidth;
                    }
                    return prevWidth;
                });
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
                    prevLayoutData.paddingTop === newLayoutData.paddingTop
                ) {
                    return prevLayoutData;
                }
                return newLayoutData;
            });
        }
    }, [currentContainerWidth, calculateShrunkPositions]);


    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden m-10">
            <RopeCanvs />


            <div
                ref={containerRef}
                
                className="relative mx-auto w-full max-w-[1200px] h-full pointer-events-auto"
                style={{
                    height: areAllShrunk ? `${shrunkLayoutData.maxContainerHeight}px` : '100%',
                    transition: 'height 0.7s ease-in-out',
                    paddingTop: areAllShrunk ? `${shrunkLayoutData.paddingTop}px` : '0px'
                }}
            >
                {shapes.map((shape, index) => {
                    const id = `skills-shape-${index}`;
                    const transformFromBomb = hitElementsTransforms.get(id);
                    const frame = getFrameByName(shape.name);

                    const targetShrunkPosition = shrunkLayoutData.positions.get(id);

                    const currentLeft = areAllShrunk && targetShrunkPosition
                        ? `${targetShrunkPosition.left}px`
                        : shape.expandedLeft;
                    const currentTop = areAllShrunk && targetShrunkPosition
                        ? `${targetShrunkPosition.top}px`
                        : shape.expandedTop;

                    const { baseItemWidth, columnGap } = getGridParameters(currentContainerWidth);
                    const colSpan = shape.colSpan || 1;

                    const currentWidth = areAllShrunk
                        ? `${(baseItemWidth * colSpan) + (columnGap * (colSpan - 1))}px`
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

                    const infoBoxClasses = `absolute border-3 border-solid rounded-xl bg-white flex flex-col justify-start items-start p-2 gap-1 overflow-hidden`;

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
                                ref={(el: HTMLDivElement | null) => {
                                    if (el) elementRefs.current[id] = el;
                                }}
                                className={infoBoxClasses}
                                style={infoBoxStyles}
                            >
                                <div
                                    className="font-bold text-lg text-black whitespace-nowrap overflow-hidden text-ellipsis"
                                    style={{
                                        paddingLeft: areAllShrunk ? `${iconOffsetLeftShrunk + (frame.w * iconScaleShrunk) + 20}px` : '0px',
                                        paddingTop: areAllShrunk ? '5px' : '0px',
                                        
                                    }}
                                >
                                    {shape.heading.replace('.png', '').replace('.jpg', '')}
                                </div>
                                <div
                                    className="text-sm text-gray-700 "
                                    style={{
                                        paddingLeft: areAllShrunk ? `${iconOffsetLeftShrunk + (frame.w * iconScaleShrunk) + 10}px` : '0px'
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