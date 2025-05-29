import React from 'react';
import { useBomb } from '../component/BombContext';

const Contact = () => {
    const {
        bombMode,
        setBombPoint,
        adjustablePower,
        adjustableRadius,
        adjustableRotation,
        hitElementsTransforms,
        setHitElementsTransforms,
        elementRefs,
    } = useBomb();

    // --- Type Safety for destructured variables and functions from useBomb ---
    // Provide default values for variables that might be undefined from useBomb().
    // This resolves "possibly undefined" errors for numerical/boolean values.
    const currentBombMode: boolean = bombMode ?? false;
    const currentAdjustablePower: number = adjustablePower ?? 450; // Sensible default for power
    const currentAdjustableRadius: number = adjustableRadius ?? 150; // Sensible default for radius
    const currentAdjustableRotation: number = adjustableRotation ?? 0; // Sensible default for rotation

    // Provide no-op functions as defaults if the setters are undefined.
    // This resolves "Cannot invoke an object which is possibly 'undefined'" errors for functions.
    const safeSetBombPoint = setBombPoint ?? (() => { });
    const safeSetHitElementsTransforms = setHitElementsTransforms ?? (() => { });

    // --- Helper Function: parseTransform ---
    const parseTransform = (transformString: string) => {
        let x = 0, y = 0, rot = 0;
        const translateMatch = transformString.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        const rotateMatch = transformString.match(/rotate\(([-\d.]+)deg\)/);
        if (translateMatch) {
            x = parseFloat(translateMatch[1]);
            y = parseFloat(translateMatch[2]);
        }
        if (rotateMatch) {
            rot = parseFloat(rotateMatch[1]);
        }
        return { x, y, rot };
    };

    // --- Main Logic: calculateHitElements ---
    const calculateHitElements = (e: React.MouseEvent) => {
        // Use the 'currentBombMode' which is guaranteed to be a boolean
        if (!currentBombMode) return;

        const clickX = e.clientX;
        const clickY = e.clientY;
        const newTransforms = new Map<string, string>();

        // Ensure elementRefs.current is not null before iterating
        // Using optional chaining (?.) for extra safety, though it should be defined in context
        if (elementRefs?.current) {
            Object.entries(elementRefs.current).forEach(([id, el]) => {
                // Ensure the ref element exists
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = cx - clickX;
                    const dy = cy - clickY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Use 'currentAdjustableRadius' (guaranteed number)
                    if (distance <= currentAdjustableRadius) {
                        const forceMultiplier = (currentAdjustableRadius - distance) / currentAdjustableRadius;
                        // Use explicit check for division by zero to prevent NaN,
                        // or rely on '|| 0' if that's preferred for terse code.
                        // I've kept your `|| 0` as it's common.
                        const normDx = dx / distance || 0;
                        const normDy = dy / distance || 0;

                        // Use 'currentAdjustablePower' and 'currentAdjustableRotation'
                        const pushTx = normDx * currentAdjustablePower * forceMultiplier;
                        const pushTy = normDy * currentAdjustablePower * forceMultiplier;
                        const randomRot = Math.random() * 2 - 1;
                        const pushRot = randomRot * currentAdjustableRotation;

                        // Use optional chaining for hitElementsTransforms.get() as the Map might not be fully initialized or could be undefined
                        const currentTransform = hitElementsTransforms?.get(id) || 'translate(0px, 0px) rotate(0deg)';
                        const { x, y, rot } = parseTransform(currentTransform);

                        const finalTx = x + pushTx;
                        const finalTy = y + pushTy;
                        const finalRot = rot + pushRot;

                        newTransforms.set(id, `translate(${finalTx}px, ${finalTy}px) rotate(${finalRot}deg)`);
                    }
                }
            });
        }

        // Use the safe setter functions
        safeSetBombPoint({ x: clickX, y: clickY });
        safeSetHitElementsTransforms(prev => new Map([...prev, ...newTransforms]));
    };

    // --- Helper Function: getStyle ---
    const getStyle = (id: string) => ({
        // Use optional chaining for hitElementsTransforms.get() here as well
        transform: hitElementsTransforms?.get(id) || 'none',
        transition: 'transform 0.4s ease-out',
    });

    return (
        <section
            id="contact"
            className="section-container p-10 my-12 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
            onClick={calculateHitElements}
        >
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#32cacd' }}>
                {"Get in Touch".split(" ").map((word, i) => (
                    <span
                        key={`heading-word-${i}`}
                        ref={(el) => {
                            // Null check for elementRefs.current before assignment
                            if (elementRefs?.current) {
                                elementRefs.current[`heading-word-${i}`] = el;
                            }
                        }}
                        style={getStyle(`heading-word-${i}`)}
                        className="inline-block mr-2"
                    >
                        {word}
                    </span>
                ))}
            </h2>

            <p className="text-lg text-gray-700 mb-8 max-w-2xl flex flex-wrap justify-center">
                {"Have a question or a project in mind? We'd love to hear from you! Reach out to us through the form below.".split(" ").map((word, i) => (
                    <span
                        key={`text-word-${i}`}
                        ref={(el) => {
                            // Null check for elementRefs.current before assignment
                            if (elementRefs?.current) {
                                elementRefs.current[`text-word-${i}`] = el;
                            }
                        }}
                        style={getStyle(`text-word-${i}`)}
                        className="inline-block mr-1 mb-1"
                    >
                        {word}
                    </span>
                ))}
            </p>

            <form
                className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md"
                ref={(el) => {
                    // Null check for elementRefs.current before assignment
                    if (elementRefs?.current) {
                        elementRefs.current['contact-form'] = el;
                    }
                }}
                style={getStyle('contact-form')}
            >
                {['name', 'email', 'message'].map((field, index) => (
                    <div className="mb-6" key={field}>
                        {field === 'message' ? (
                            <textarea
                                placeholder="Your Message"
                                rows={6}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                ref={(el) => {
                                    // Null check for elementRefs.current before assignment
                                    if (elementRefs?.current) {
                                        elementRefs.current[`input-${field}`] = el;
                                    }
                                }}
                                style={getStyle(`input-${field}`)}
                            ></textarea>
                        ) : (
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                ref={(el) => {
                                    // Null check for elementRefs.current before assignment
                                    if (elementRefs?.current) {
                                        elementRefs.current[`input-${field}`] = el;
                                    }
                                }}
                                style={getStyle(`input-${field}`)}
                            />
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-cyan-600 transform hover:scale-105 transition duration-300 ease-in-out flex justify-center flex-wrap gap-1"
                    style={{ background: '#32cacd' }}
                >
                    {"Send Message".split(" ").map((word, i) => (
                        <span
                            key={`button-word-${i}`}
                            ref={(el) => {
                                // Null check for elementRefs.current before assignment
                                if (elementRefs?.current) {
                                    elementRefs.current[`button-word-${i}`] = el;
                                }
                            }}
                            style={getStyle(`button-word-${i}`)}
                            className="inline-block"
                        >
                            {word}
                        </span>
                    ))}
                </button>
            </form>
        </section>
    );
};

export default Contact;