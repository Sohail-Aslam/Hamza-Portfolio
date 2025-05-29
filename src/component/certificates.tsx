/* eslint-disable */
import React from 'react'; // React is imported, useEffect is used but not strictly necessary for this logic
import { useBomb } from '../component/BombContext';

const certifications = [
    {
        stack: 'Full Stack Developer',
        link: 'https://www.credential.net/2bd7f2c3-a2a6-407f-b69b-f58b4e7db419',
        label: 'Certificate of completion Full Stack Development where I spent 2000+ hours in coding',
    },
    {
        stack: 'Ruby on Rails',
        link: 'https://www.credential.net/b91e20c8-2e61-4846-8617-a61d16aa8f23#gs.4prjr0',
        label: 'Certificate of completion Ruby on Rails module',
    },
    {
        stack: 'React Redux',
        link: 'https://www.credential.net/eff8ab36-5dcb-4231-bde1-8fa9ac2c3595#gs.4pri7j',
        label: 'React Redux Certification',
    },
    {
        stack: 'React',
        link: 'https://www.credential.net/8d64cecf-76ff-4a62-b902-fb55044472da#gs.4prfg3',
        label: 'React Certification',
    },
    {
        stack: 'HTML/CSS',
        link: 'https://www.credential.net/7fabfbf0-5689-451d-96d4-2a7ebe05b27b#gs.4prdha',
        label: 'HTML/CSS Certification',
    },
    {
        stack: 'Ruby',
        link: 'https://www.credential.net/9591b33c-d624-4bb0-b825-fed5ad0015f4#gs.4pr7ny',
        label: 'Ruby Certification',
    },
];

const Certifications = () => {
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
    const currentBombMode: boolean = bombMode ?? false;
    const currentAdjustablePower: number = adjustablePower ?? 450;
    const currentAdjustableRadius: number = adjustableRadius ?? 150;
    const currentAdjustableRotation: number = adjustableRotation ?? 0;

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
        if (!currentBombMode) return; // Use currentBombMode

        const clickX = e.clientX;
        const clickY = e.clientY;
        const newTransforms = new Map<string, string>();

        // Ensure elementRefs.current is not null before iterating
        if (elementRefs?.current) {
            // Iterate over all elements registered in elementRefs
            Object.entries(elementRefs.current).forEach(([id, el]) => {
                // Ensure the ref element exists and is an HTMLElement
                if (el instanceof HTMLElement) {
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = cx - clickX;
                    const dy = cy - clickY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= currentAdjustableRadius) { // Use currentAdjustableRadius
                        const forceMultiplier = (currentAdjustableRadius - distance) / currentAdjustableRadius;
                        const normDx = dx / distance || 0;
                        const normDy = dy / distance || 0;
                        const pushTx = normDx * currentAdjustablePower * forceMultiplier; // Use currentAdjustablePower
                        const pushTy = normDy * currentAdjustablePower * forceMultiplier; // Use currentAdjustablePower
                        const randomRot = Math.random() * 2 - 1;
                        const pushRot = randomRot * currentAdjustableRotation; // Use currentAdjustableRotation

                        // Use optional chaining for hitElementsTransforms.get()
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

        safeSetBombPoint({ x: clickX, y: clickY }); // Use safe setter
        safeSetHitElementsTransforms(prev => new Map([...prev, ...newTransforms])); // Use safe setter
    };

    // --- Helper Function: getStyle ---
    const getStyle = (id: string) => ({
        // Use optional chaining for hitElementsTransforms.get() here as well
        transform: hitElementsTransforms?.get(id) || 'none',
        transition: 'transform 0.4s ease-out',
    });

    return (
        <div id='certificates'
            className="px-4 py-8 max-w-7xl mx-auto my-12 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden section-container p-10 my-12 min-h-screen flex flex-col justify-center items-center text-center"
            onClick={calculateHitElements}
        >
            <h2 className="text-3xl font-bold text-cyan-500 mb-6">Certifications</h2>

            {/* Let table container expand visuals */}
            <div className="w-full overflow-visible flex justify-center">
                <table className="min-w-2xl bg-white shadow-md rounded-lg overflow-visible relative">
                    <thead
                        className="bg-gray-100 text-left text-sm font-semibold text-gray-700 relative z-10"
                    // Removed ref and style from thead to allow inner th content to move independently
                    // ref={(el) => { if(elementRefs?.current) elementRefs.current["thead"] = el; }}
                    // style={getStyle("thead")}
                    >
                        <tr>
                            {["Stack", "Link", "Organization"].map((title, idx) => (
                                <th
                                    key={idx}
                                    className="p-4 relative z-10"
                                >
                                    {/* Wrap content in a span for individual bomb effect */}
                                    <span
                                        ref={(el) => {
                                            // Null check for elementRefs.current before assignment
                                            if (elementRefs?.current) {
                                                elementRefs.current[`th-title-${idx}`] = el;
                                            }
                                        }}
                                        style={getStyle(`th-title-${idx}`)} // Apply style to the span
                                        className="inline-block" // Ensure span behaves like a block for transform
                                    >
                                        {title}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800 relative z-0">
                        {certifications.map((cert, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="border-t relative z-0"
                                // Removed ref and style from tr to allow inner td content to move independently
                                // ref={(el) => { if(elementRefs?.current) elementRefs.current[`row-${index}`] = el; }}
                                // style={getStyle(`row-${index}`)}
                                >
                                    <td className="p-4">
                                        {/* Wrap content in a span for individual bomb effect */}
                                        <span
                                            ref={(el) => {
                                                if (elementRefs?.current) {
                                                    elementRefs.current[`cert-${index}-stack`] = el;
                                                }
                                            }}
                                            style={getStyle(`cert-${index}-stack`)}
                                            className="inline-block"
                                        >
                                            {cert.stack}
                                        </span>
                                    </td>
                                    <td className="p-4 text-cyan-600 underline">
                                        {/* Wrap content in a span for individual bomb effect */}
                                        <a
                                            href={cert.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            ref={(el) => {
                                                if (elementRefs?.current) {
                                                    elementRefs.current[`cert-${index}-link`] = el;
                                                }
                                            }}
                                            style={getStyle(`cert-${index}-link`)}
                                            className="inline-block"
                                        >
                                            {cert.label}
                                        </a>
                                    </td>
                                    <td className="p-4">
                                        {/* Wrap content in a span for individual bomb effect */}
                                        <a
                                            href="https://www.microverse.org/"
                                            className="text-blue-500 underline inline-block"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            ref={(el) => {
                                                if (elementRefs?.current) {
                                                    elementRefs.current[`cert-${index}-org`] = el;
                                                }
                                            }}
                                            style={getStyle(`cert-${index}-org`)}
                                        >
                                            Microverse
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Certifications;