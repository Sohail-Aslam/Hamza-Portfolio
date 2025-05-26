/* eslint-disable */
import { useBomb } from '../component/BombContext';
import { useEffect } from 'react';

const certifications = [
    {
        stack: 'Full Stack Developer',
        link: 'https://www.credential.net/2bd7f2c3-a2a6-407f-b69b-f58b4e7db419',
        label: 'Certificate of completition Full Stack Development where I spent 2000+ hours in coding',
    },
    {
        stack: 'Ruby on Rails',
        link: 'https://www.credential.net/b91e20c8-2e61-4846-8617-a61d16aa8f23#gs.4prjr0',
        label: 'Certificate of completition Ruby on Rails module',
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
                        ref={(el) => {
                            elementRefs.current["thead"] = el;
                        }}
                        style={{
                            transform: hitElementsTransforms.get("thead") || "none",
                            transition: "transform 0.4s ease-out",
                        }}
                    >
                        <tr>
                            {["Stack", "Link", "Organization"].map((title, idx) => (
                                <th
                                    key={idx}
                                    className="p-4 relative z-10"
                                    ref={(el) => {
                                        elementRefs.current[`th-${idx}`] = el;
                                    }}
                                    style={{
                                        transform: hitElementsTransforms.get(`th-${idx}`) || "none",
                                        transition: "transform 0.4s ease-out",
                                    }}
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800 relative z-0">
                        {certifications.map((cert, index) => {
                            const rowId = `row-${index}`;
                            return (
                                <tr
                                    key={index}
                                    className="border-t relative z-0"
                                    ref={(el) => {
                                        elementRefs.current[rowId] = el;
                                    }}
                                    style={{
                                        transform: hitElementsTransforms.get(rowId) || "none",
                                        transition: "transform 0.4s ease-out",
                                    }}
                                >
                                    <td
                                        className="p-4"
                                        ref={(el) => {
                                            elementRefs.current[`cert-${index}-stack`] = el;
                                        }}
                                        style={{
                                            transform:
                                                hitElementsTransforms.get(`cert-${index}-stack`) || "none",
                                            transition: "transform 0.4s ease-out",
                                        }}
                                    >
                                        {cert.stack}
                                    </td>
                                    <td
                                        className="p-4 text-cyan-600 underline"
                                        ref={(el) => {
                                            elementRefs.current[`cert-${index}-link`] = el;
                                        }}
                                        style={{
                                            transform:
                                                hitElementsTransforms.get(`cert-${index}-link`) || "none",
                                            transition: "transform 0.4s ease-out",
                                        }}
                                    >
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer">
                                            {cert.label}
                                        </a>
                                    </td>
                                    <td
                                        className="p-4"
                                        ref={(el) => {
                                            elementRefs.current[`cert-${index}-org`] = el;
                                        }}
                                        style={{
                                            transform:
                                                hitElementsTransforms.get(`cert-${index}-org`) || "none",
                                            transition: "transform 0.4s ease-out",
                                        }}
                                    >
                                        <a
                                            href="https://www.microverse.org/"
                                            className="text-blue-500 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
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
