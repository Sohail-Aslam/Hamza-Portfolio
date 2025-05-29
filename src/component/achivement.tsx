/* eslint-disable */
import { useEffect, useRef } from 'react';
import { useBomb } from '../component/BombContext'; // adjust path as needed

const Achievement = () => {
    const {
        bombMode,
        bombPoint,
        adjustablePower = 80,    // Default to 0 if undefined
        adjustableRadius = 100,   // Default to 0 if undefined
        adjustableRotation = 8, // Default to 0 if undefined
        setBombPoint,
        hitElementsTransforms,
        setHitElementsTransforms,
        elementRefs,
    } = useBomb();

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    // Apply transforms ONLY when bomb is active and a bomb point exists
    useEffect(() => {
        if (!bombPoint || !bombMode) return;

        const transformsMap = new Map<string, string>();

        cardRefs.current.forEach((card, index) => {
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;
            const distance = Math.hypot(bombPoint.x - cardX, bombPoint.y - cardY);

            if (distance < adjustableRadius) {
                const angle = Math.atan2(cardY - bombPoint.y, cardX - bombPoint.x);
                const powerFactor = (1 - distance / adjustableRadius) * adjustablePower;
                const offsetX = Math.cos(angle) * powerFactor;
                const offsetY = Math.sin(angle) * powerFactor;
                const rotation = adjustableRotation;
                const transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;

                transformsMap.set(`card-${index}`, transform);
                card.style.transition = 'transform 5.4s ease-out';
                card.style.transform = transform;
                card.classList.add('animate-bounce-sm');
                setTimeout(() => card.classList.remove('animate-bounce-sm'), 500);
            }
        });

        setHitElementsTransforms(prev => new Map([...prev, ...transformsMap]));
    }, [bombPoint]); // ❗ Note: do NOT depend on bombMode here
  
      
    const projects = [
        {
            name: 'Spa-Booking App',
            image: 'src/assets/spa-booking.jpg',
            live: 'https://emhamza.github.io/portfolio/#',
            github: 'https://github.com/emhamza/spa-booking-backend',
            tools: [
                'React',
                'Bootstrap',
                'Mobile Responsive',
                'Ruby on Rails',
                'CSS Modules',
                'PostgreSQL'
            ]
        },
        {
            name: 'Capstone Project 1',
            image: 'src/assets/NES.jpg',
            live: 'https://emhamza.github.io/Capstone-1/index.html',
            github: 'https://github.com/emhamza/Capstone-1',
            tools: [
                'HTML',
                'CSS',
                'Javascript',
                'Bootstrap',
                'Fully Responsive',

            ]
        },
        {
            name: 'House Budget App',
            image: 'src/assets/HB-app.jpg',
            live: 'https://house-budget-app.onrender.com/',
            github: 'https://github.com/emhamza/house-budget-app',
            tools: [
                'Ruby',
                'Rails',
                'RSpec',
                'PostgreSQL',
            ]
        },
        {
            name: 'Space X Missions',
            image: 'src/assets/space-x.jpg',
            live: 'https://space-x-jln2.onrender.com/',
            github: 'https://github.com/emhamza/Space-X',
            tools: [
                'Vite + React',
                'Unit Testing',
                'Mobile Responsive',
            ]
        },
        {
            name: 'Washwood Heath PCN',
            image: 'src/assets/washwoodheath.jpg',
            live: 'https://washwoodheathpcn.co.uk/',
            github: 'https://github.com/emhamza/washwood-heath-pcn',
            tools: [
                'WordPress',
                'CSS',
                'Mobile Responsive',
                'Live Data Feedback Form',
            ]
        },
        {
            name: 'Pak Health Centre',
            image: 'src/assets/pakhealth.jpg',
            live: 'https://pakhealthcentre.nhs.uk/',
            github: 'https://github.com/emhamza/Pak-Health-Centre',
            tools: [
                'WordPress',
                'Mobile Responsive',
                'CSS',
                'Friends & Family Test'
            ]
        },
    ];
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
                    const normDx = distance === 0 ? 0 : dx / distance;
                    const normDy = distance === 0 ? 0 : dy / distance;
                    const pushTx = normDx * adjustablePower * forceMultiplier;
                    const pushTy = normDy * adjustablePower * forceMultiplier;
                    const randomRot = Math.random() * 2 - 1;
                    const pushRot = randomRot * adjustableRotation;

                    const currentTransform = hitElementsTransforms.get(id) || 'translate(0px, 0px) rotate(0deg)';
                    const { x: curX, y: curY, rot: curRot } = parseTransform(currentTransform);

                    const finalTx = curX + pushTx;
                    const finalTy = curY + pushTy;
                    const finalRot = curRot + pushRot;

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
        <div id='achivement' className="section-container overflow-hidden p-10 my-12 min-h-screen flex flex-col justify-center items-center text-center" onClick={calculateHitElements} >
            <div rel="noopener noreferrer"
            >
                <h2 className="text-3xl font-bold text-cyan-500 mb-6">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-[12%]">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                if (el) elementRefs.current[`card-${index}-container`] = el;
                            }}
                            className="flex flex-col sm:flex-row w-full bg-white rounded-2xl shadow-md overflow-visible transition-transform transform hover:-translate-y-1 hover:shadow-xl"
                            style={{ transform: hitElementsTransforms.get(`card-${index}-container`) || 'none' }}
                        >
                            {/* IMAGE */}
                            <div className="group relative sm:w-1/2 w-full">
                                <img
                                    ref={(el) => {
                                        if (el) elementRefs.current[`card-${index}-image`] = el;
                                    }}
                                    src={project.image}
                                    alt={project.name}
                                    className="h-48 sm:h-full w-full object-cover transition-transform rounded-l-2xl"
                                    style={{ transform: hitElementsTransforms.get(`card-${index}-image`) || 'none' }}
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-white text-black text-sm font-semibold rounded hover:bg-cyan-500 hover:text-white transition"
                                    >
                                        Live View
                                    </a>
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-white text-black text-sm font-semibold rounded hover:bg-cyan-500 hover:text-white transition"
                                    >
                                        GitHub
                                    </a>
                                </div>
                            </div>

                            {/* TEXT + TOOLS */}
                            <div className="sm:w-1/2 p-4 flex flex-col justify-center gap-2">
                                {/* Project Name */}
                                <h3
                                    ref={(el) => {
                                        if (el) elementRefs.current[`card-${index}-title`] = el;
                                    }}
                                    className="font-semibold text-lg transition-transform"
                                    style={{ transform: hitElementsTransforms.get(`card-${index}-title`) || 'none' }}
                                >
                                    {project.name}
                                </h3>

                                {/* Tools */}
                                <div className="tools flex flex-wrap gap-2 mt-2">
                                    {project.tools.map((tool, i) => {
                                        const id = `card-${index}-tool-${i}`;
                                        return (
                                            <span
                                                key={id}
                                                ref={(el) => {
                                                    if (el) elementRefs.current[id] = el;
                                                }}
                                                className="bg-gray-200 text-cyan-800 text-xs font-medium px-2 py-1 rounded-md transition-transform"
                                                style={{ transform: hitElementsTransforms.get(id) || 'none' }}
                                            >
                                                {tool}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
      
      
    )
}

export default Achievement