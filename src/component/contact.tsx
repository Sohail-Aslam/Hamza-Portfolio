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

    const calculateHitElements = (e: React.MouseEvent) => {
        if (!bombMode) return;
        const clickX = e.clientX;
        const clickY = e.clientY;
        const newTransforms = new Map<string, string>();

        Object.entries(elementRefs.current).forEach(([id, el]) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = cx - clickX;
                const dy = cy - clickY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= adjustableRadius) {
                    const forceMultiplier = (adjustableRadius - distance) / adjustableRadius;
                    const normDx = dx / distance || 0;
                    const normDy = dy / distance || 0;
                    const pushTx = normDx * adjustablePower * forceMultiplier;
                    const pushTy = normDy * adjustablePower * forceMultiplier;
                    const randomRot = Math.random() * 2 - 1;
                    const pushRot = randomRot * adjustableRotation;

                    const currentTransform = hitElementsTransforms.get(id) || 'translate(0px, 0px) rotate(0deg)';
                    const { x, y, rot } = parseTransform(currentTransform);

                    const finalTx = x + pushTx;
                    const finalTy = y + pushTy;
                    const finalRot = rot + pushRot;

                    newTransforms.set(id, `translate(${finalTx}px, ${finalTy}px) rotate(${finalRot}deg)`);
                }
            }
        });

        setBombPoint({ x: clickX, y: clickY });
        setHitElementsTransforms(prev => new Map([...prev, ...newTransforms]));
    };

    const getStyle = (id: string) => ({
        transform: hitElementsTransforms.get(id) || 'none',
        transition: 'transform 0.4s ease-out',
    });

    return (
        <section
            id="contact"
            className="section-container p-10 my-12 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
            onClick={calculateHitElements}
        >
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#32cacd' }}
            >
                {"Get in Touch".split(" ").map((word, i) => (
                    <span
                        key={`heading-word-${i}`}
                        ref={(el) => { elementRefs.current[`heading-word-${i}`] = el }}
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
                        ref={(el) => { elementRefs.current[`text-word-${i}`] = el }}
                        style={getStyle(`text-word-${i}`)}
                        className="inline-block mr-1 mb-1"
                    >
                        {word}
                    </span>
                ))}
            </p>

            <form
                className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md"
                ref={(el) => {elementRefs.current['contact-form'] = el}}
                style={getStyle('contact-form')}
            >
                {['name', 'email', 'message'].map((field, index) => (
                    <div className="mb-6" key={field}>
                        {field === 'message' ? (
                            <textarea
                                placeholder="Your Message"
                                rows={6}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                ref={(el) => {elementRefs.current[`input-${field}`] = el}}
                                style={getStyle(`input-${field}`)}
                            ></textarea>
                        ) : (
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                ref={(el) => {elementRefs.current[`input-${field}`] = el}}
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
                            ref={(el) => { elementRefs.current[`button-word-${i}`] = el }}
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
