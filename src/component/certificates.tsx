import React, { useState, ChangeEvent, useCallback, useRef, useEffect } from 'react';
import spriteImg from '../assets/certificatev1.webp';
import spriteData from '../assets/certificatev1.json';
import { useBomb } from '../component/BombContext';

// --- Global Styles for the Custom Checkbox (from previous corrected response) ---
const globalCheckboxStyles = `
  .checkbox-wrapper-41 {
    --size: 100px;
    display: inline-flex;
    align-items: center;
    position: relative;
    width: var(--size);
    height: calc(var(--size) / 2);
    cursor: pointer;
  }

  .checkbox-wrapper-41 input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  .checkbox-wrapper-41 .checkbox-track {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 3px solid #222;
    border-radius: 30px 100px 100px 100px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: all 0.5s ease;
    z-index: 1;
  }

  .checkbox-wrapper-41 .checkbox-handle {
    content: '';
    position: absolute;
    width: calc(var(--size) / 2);
    height: calc(var(--size) / 2);
    left: 0;
    top: 50%;
    transform: translateY(-50%) scale(0.7);
    border: 3px solid #222;
    border-radius: 30px 100px 100px 100px;
    background-color: #fde881;
    box-sizing: border-box;
    transition: all 0.5s ease;
    z-index: 2;
  }

  .checkbox-wrapper-41 .checkbox-text-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--size) / 5);
    font-weight: bold;
    color: #222;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }

  .checkbox-wrapper-41 .checkbox-text-container span {
    position: absolute;
    transition: opacity 0.3s ease;
  }

  .checkbox-wrapper-41 .checkbox-text-container .text-verify {
    opacity: 1;
  }

  .checkbox-wrapper-41 .checkbox-text-container .text-yes {
    opacity: 0;
  }

  .checkbox-wrapper-41 input[type="checkbox"]:checked ~ .checkbox-handle {
    left: 50%;
    background-color: #fff;
    border-radius: 100px 100px 30px 100px;
    transform: translateY(-50%) scale(0.7);
  }

  .checkbox-wrapper-41 input[type="checkbox"]:checked ~ .checkbox-track {
    background-color: #fde881;
    border-radius: 100px 100px 30px 100px;
  }

  .checkbox-wrapper-41 input[type="checkbox"]:checked ~ .checkbox-text-container .text-verify {
    opacity: 0;
  }

  .checkbox-wrapper-41 input[type="checkbox"]:checked ~ .checkbox-text-container .text-yes {
    opacity: 1;
  }
`;

// --- CustomCheckbox Component Definition ---
interface CustomCheckboxProps {
    isChecked: boolean; // Change initialChecked to isChecked for controlled component
    onChange: (isChecked: boolean) => void;
    id: string; // ID is essential for unique identification
    name?: string;
    disabled?: boolean;
    previewLink?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    isChecked, // Now receives the current checked state as a prop
    onChange,
    id,
    name,
    disabled = false,
    previewLink,
}) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newCheckedState = event.target.checked;

        if (newCheckedState && previewLink) {
            window.open(previewLink, '_blank', 'noopener noreferrer');
        }

        // Call the onChange handler passed from the parent
        if (onChange) {
            onChange(newCheckedState);
        }
    };

    return (
        <div className="checkbox-wrapper-41">
            <style>{globalCheckboxStyles}</style>

            <input
                type="checkbox"
                id={id}
                name={name}
                checked={isChecked} // Controlled by the parent's state
                onChange={handleChange}
                disabled={disabled}
            />
            <div className="checkbox-track"></div>
            <div className="checkbox-text-container">
                <span className="text-verify">Verify?</span>
                <span className="text-yes">Yes!</span>
            </div>
            <div className="checkbox-handle"></div>
        </div>
    );
};

// --- AboutObjects Main Component ---

export default function AboutObjects() {
    const { elementRefs, hitElementsTransforms } = useBomb();
    const containerRef = useRef<HTMLDivElement>(null);

    interface Frame {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    interface CustomShape {
        name: string;
        heading: string;
        previewLink: string;
        rotation: number;
        scale: number;
        delay: number;
        shrunkWidth: string;
        shrunkHeight: string;
        shrunkText: string;
        shrunkBorderColor: string;
        imgPath: string;
    }

    interface LayoutData {
        maxContainerHeight: number;
        paddingTop: number;
        gridColumns: number;
        itemSize: number;
    }

    const [currentContainerWidth, setCurrentContainerWidth] = useState(0);
    const [layoutData, setLayoutData] = useState<LayoutData>({ maxContainerHeight: 0, paddingTop: 0, gridColumns: 1, itemSize: 0 });
    const [activeShapeIndex, setActiveShapeIndex] = useState<number | null>(null);

    // State to store the checked status for each certificate
    // Map: key is certificate ID (e.g., `certificate-${index}`), value is boolean checked status
    const [certificateCheckedStates, setCertificateCheckedStates] = useState<Record<string, boolean>>({});


    const getFrameByName = useCallback((name: string): Frame => {
        const frame = (spriteData.frames as Record<string, { frame: Frame }>)[name]?.frame;
        if (!frame) throw new Error(`Frame "${name}" not found in spriteData.frames`);
        return frame;
    }, []);

    const shapes: CustomShape[] = [
        { heading: "Full Stack Developer", name: 'trophy-(2).png', imgPath: 'src/assets/certificates/fullstack-c.png', previewLink: 'https://www.credential.net/2bd7f2c3-a2a6-407f-b69b-f58b4e7db419', rotation: 0, scale: 1, delay: 150, shrunkWidth: '260px', shrunkHeight: '148px', shrunkText: 'Certificate of completion for Full Stack Development, representing 2000+ hours of coding.', shrunkBorderColor: 'amber-300' },
        { heading: "Ruby on Rails", name: 'trophy-(2).png', imgPath: 'src/assets/certificates/ruby-c.png', previewLink: 'https://www.credential.net/b91e20c8-2e61-4846-8617-a61d16aa8f23#gs.4prjr0', rotation: 0, scale: 1, delay: 200, shrunkWidth: '220px', shrunkHeight: '130px', shrunkText: 'Certificate of completion for the Ruby on Rails module.', shrunkBorderColor: 'blue-400' },
        { heading: "React Redux", name: 'trophy-(2).png', imgPath: 'src/assets/certificates/react-c.png', previewLink: 'https://www.credential.net/eff8ab36-5dcb-4231-bde1-8fa9ac2c3595#gs.4pri7j', rotation: 0, scale: 1, delay: 250, shrunkWidth: '240px', shrunkHeight: '140px', shrunkText: 'React Redux Certification, demonstrating proficiency in state management.', shrunkBorderColor: 'green-500' },
        { heading: "React", name: 'trophy-(2).png', imgPath: 'src/assets/certificates/react-c.png', previewLink: 'https://www.credential.net/8d64cecf-76ff-4a62-b902-fb55044472da#gs.4prfg3', rotation: 0, scale: 1, delay: 300, shrunkWidth: '230px', shrunkHeight: '135px', shrunkText: 'React Certification, validating skills in building modern web applications.', shrunkBorderColor: 'purple-400' },
        { heading: "JavaScript", name: 'trophy-(2).png', imgPath: 'src/assets/certificates/JS-c.png', previewLink: 'https://www.credential.net/7fabfbf0-5689-451d-96d4-2a7ebe05b27b#gs.4prdha', rotation: 0, scale: 1, delay: 350, shrunkWidth: '200px', shrunkHeight: '120px', shrunkText: 'JavaScript Certification, covering core concepts and advanced topics.', shrunkBorderColor: 'red-400' },
        { heading: "HTML/CSS", name: 'trophy-(2).png', imgPath: 'src/assets/certificates/html-c.png', previewLink: 'https://www.credential.net/9591b33c-d624-4bb0-b825-fed5ad0015f4#gs.4pr7ny', rotation: 0, scale: 1, delay: 400, shrunkWidth: '250px', shrunkHeight: '145px', shrunkText: 'HTML/CSS Certification, focusing on responsive design and styling.', shrunkBorderColor: 'cyan-400' },
    ];

    // Effect for handling window resize and updating container width
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setCurrentContainerWidth(containerRef.current.clientWidth);
            }
        };

        handleResize(); // Initial measurement
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect for calculating layout data based on currentContainerWidth and number of shapes
    useEffect(() => {
        if (currentContainerWidth > 0) {
            const numShapes = shapes.length;
            let gridColumns = 1;
            let itemSize = currentContainerWidth; // Default to full width for 1 column

            if (currentContainerWidth >= 1024) { // Large screens
                gridColumns = Math.min(4, Math.max(1, Math.ceil(numShapes / 2)));
            } else if (currentContainerWidth >= 768) { // Medium screens
                gridColumns = Math.min(3, Math.max(1, Math.ceil(numShapes / 2)));
            } else if (currentContainerWidth >= 480) { // Small screens
                gridColumns = Math.min(2, Math.max(1, numShapes));
            } else {
                gridColumns = 1; // Very small screens
            }

            gridColumns = Math.min(gridColumns, numShapes);
            if (gridColumns === 0) gridColumns = 1;

            itemSize = currentContainerWidth / gridColumns;

            const numRows = Math.ceil(numShapes / gridColumns);
            const calculatedHeight = numRows * itemSize;
            const calculatedPaddingTop = currentContainerWidth * 0.05;

            const newLayoutData: LayoutData = {
                maxContainerHeight: calculatedHeight,
                paddingTop: calculatedPaddingTop,
                gridColumns: gridColumns,
                itemSize: itemSize,
            };

            setLayoutData(prevLayoutData => {
                if (
                    prevLayoutData.maxContainerHeight === newLayoutData.maxContainerHeight &&
                    prevLayoutData.paddingTop === newLayoutData.paddingTop &&
                    prevLayoutData.gridColumns === newLayoutData.gridColumns &&
                    prevLayoutData.itemSize === newLayoutData.itemSize
                ) {
                    return prevLayoutData;
                }
                return newLayoutData;
            });
        }
    }, [currentContainerWidth, shapes.length]);

    // Memoize the calculation of the shape's styles for the grid
    const getGridShapeStyles = useCallback((shape: CustomShape, frame: Frame, transformFromBomb: string | undefined) => {
        const { itemSize } = layoutData;

        const baseContainerStyle = {
            width: `${itemSize}px`,
            height: `${itemSize}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            opacity: 1,
            cursor: 'pointer',
        };

        const baseSpriteStyle = {
            width: `${frame.w}px`,
            height: `${frame.h}px`,
            transformOrigin: 'center center',
            zIndex: 20,
            transform: `translate(-50%, -50%) scale(${shape.scale}) rotate(${shape.rotation}deg)`,
            backgroundImage: `url(${spriteImg})`,
            backgroundPosition: `${-frame.x}px ${-frame.y}px`,
            backgroundSize: `${spriteData.meta.size.w}px ${spriteData.meta.size.h}px`,
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            left: '50%',
            top: '50%',
        };

        if (transformFromBomb) {
            return {
                container: {
                    ...baseContainerStyle,
                    transform: transformFromBomb,
                    opacity: 0,
                    pointerEvents: 'none',
                },
                sprite: baseSpriteStyle,
            };
        }

        return {
            container: baseContainerStyle,
            sprite: baseSpriteStyle,
        };
    }, [layoutData, hitElementsTransforms]);

    // Handlers for navigating the info box
    const handleNext = useCallback(() => {
        setActiveShapeIndex(prevIndex => {
            if (prevIndex === null) return null;
            return (prevIndex + 1) % shapes.length;
        });
    }, [shapes.length]);

    const handlePrev = useCallback(() => {
        setActiveShapeIndex(prevIndex => {
            if (prevIndex === null) return null;
            return (prevIndex - 1 + shapes.length) % shapes.length;
        });
    }, [shapes.length]);

    const handleCloseInfoBox = useCallback(() => {
        setActiveShapeIndex(null);
    }, []);

    // Keyboard navigation for info box (Esc to close, left/right arrows for nav)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (activeShapeIndex !== null) {
                if (event.key === 'Escape') {
                    handleCloseInfoBox();
                } else if (event.key === 'ArrowRight') {
                    handleNext();
                } else if (event.key === 'ArrowLeft') {
                    handlePrev();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeShapeIndex, handleCloseInfoBox, handleNext, handlePrev]);

    const activeShape = activeShapeIndex !== null ? shapes[activeShapeIndex] : null;

    // Handler for the certificate checkbox change
    const handleCertificateVerifyChange = useCallback((newCheckedState: boolean) => {
        if (activeShapeIndex !== null) {
            const currentCertificateId = `certificate-${activeShapeIndex}`;
            setCertificateCheckedStates(prevStates => ({
                ...prevStates,
                [currentCertificateId]: newCheckedState,
            }));
        }
    }, [activeShapeIndex]);

    return (
        <div className="section-container min-h-screen inset-0 pointer-events-auto overflow-hidden m-10">
            <h1 className="text-3xl font-bold text-cyan-500 mb-6 w-full text-center mt-10">
             Certificates      </h1>
            <div
                ref={containerRef}
                className="relative mx-auto w-full max-w-[1200px] h-full"
                style={{
                    minHeight: `${layoutData.maxContainerHeight}px`,
                    paddingTop: `${layoutData.paddingTop}px`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${layoutData.gridColumns}, 1fr)`,
                    gap: '20px',
                }}
            >
                {shapes.map((shape, index) => {
                    const id = `about-shape-${index}`;
                    const transformFromBomb = hitElementsTransforms.get(id);
                    const frame = getFrameByName(shape.name);

                    const { container: shapeContainerStyle, sprite: spriteStyle } = getGridShapeStyles(shape, frame, transformFromBomb);

                    return (
                        <div
                            key={id}
                            ref={(el: HTMLDivElement | null) => {
                                if (el) elementRefs.current[id] = el;
                            }}
                            className="relative transition-all duration-700 ease-in-out flex justify-center items-center"
                            style={{
                                ...shapeContainerStyle,
                                animationDelay: `${shape.delay}ms`,
                                willChange: 'opacity, transform, width, height',
                            }}
                            onClick={() => setActiveShapeIndex(index)} // Set the index of the clicked shape
                        >
                            {/* Sprite Image */}
                            <div
                                className="absolute transition-transform duration-700 ease-in-out"
                                style={spriteStyle}
                            />
                            {/* This is the div for each image */}
                            <div className='absolute bottom-0 p-2 bg-white/70 backdrop-blur-sm rounded-b-lg w-full text-center'>
                                <p className="font-semibold text-gray-800 text-lg">
                                    {shape.heading}
                                </p>
                                <p className="text-sm text-gray-600">Microverse</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- Info Box Modal --- */}
            {activeShape && (
                <div
                    className="fixed inset-0 bg-white/30 backdrop-blur-2xl flex justify-center items-center z-50 p-4"
                    onClick={handleCloseInfoBox} // Close when clicking outside the inner box
                >
                    <div
                        className="bg-gray-100 rounded-xl shadow-2xl p-6 relative flex flex-col items-center max-w-xl w-full max-h-[90vh] overflow-auto transform transition-transform duration-300 ease-out scale-100"
                        style={{ borderColor: `var(--${activeShape.shrunkBorderColor})`, borderWidth: '3px', borderStyle: 'solid' }}
                        onClick={(e) => e.stopPropagation()} // Prevent modal closure when clicking inside the box
                    >
                        <button
                            onClick={handleCloseInfoBox}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold cursor-pointer"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
                            {activeShape.heading}
                        </h2>

                        {activeShape.imgPath && (activeShape.imgPath.startsWith('src') || activeShape.imgPath.startsWith('http')) ? (
                            <img
                                src={activeShape.imgPath}
                                alt={activeShape.heading}
                                className="w-full max-w-sm h-auto object-contain rounded-lg mb-4 shadow-md"
                            />
                        ) : (
                            <div className="text-gray-500 mb-4">No image available for this certificate.</div>
                        )}

                        <p className="text-lg text-gray-700 text-center mb-6">
                            {activeShape.shrunkText}
                        </p>
                        <p className="text-lg text-gray-700 text-center mb-6 flex gap-5">
                            <p className='font-bold'>Organization:</p>
                            <p>Microverse</p>
                        </p>

                        {/* --- Custom Checkbox Usage within the Modal --- */}
                        <div style={{ padding: '20px', fontFamily: 'sans-serif', width: '100%' }}>
                            <h3 className="text-2xl font-bold mb-4">Verify Certificate</h3>

                            <div style={{ marginBottom: '20px' }}>
                                {/* Pass the current checked state from parent and the updater */}
                                <CustomCheckbox
                                    id={`certificate-verify-${activeShapeIndex}`} // Unique ID for each checkbox
                                    name={`certificate-verify-${activeShapeIndex}`} // Unique name is also good practice
                                    previewLink={activeShape.previewLink} // Pass the certificate link
                                    // This is the key change: pass the specific checked state for the current active certificate
                                    isChecked={activeShapeIndex !== null ? certificateCheckedStates[`certificate-${activeShapeIndex}`] || false : false}
                                    onChange={handleCertificateVerifyChange}
                                />
                            </div>
                        </div>
                        {/* --- End Custom Checkbox Usage --- */}

                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-2 md:px-4">
                            <button
                                onClick={handlePrev}
                                className="bg-gray-800 bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:ring-opacity-75"
                                aria-label="Previous"
                            >
                                &#10094;
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-gray-800 bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:ring-opacity-75"
                                aria-label="Next"
                            >
                                &#10095;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}