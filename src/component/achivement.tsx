/* eslint-disable */
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBomb } from '../Context/BombContext'; // adjust path as needed

import spaBookingImg from '../assets/Projects/spa-booking.jpg';
import nesImg from '../assets/Projects/NES.jpg';
import hbAppImg from '../assets/Projects/HB-app.jpg';
import spaceXImg from '../assets/Projects/space-x.jpg';
import washwoodHeathImg from '../assets/Projects/washwoodheath.jpg';
import pakHealthImg from '../assets/Projects/pakhealth.jpg';

const Achievement = () => {
    const {
        bombMode,
        bombPoint,
        adjustableRadius = 100,
        adjustablePower = 80,
        adjustableRotation = 8,
        calculateHitElements,
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
            image: spaBookingImg,
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
            image: nesImg,
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
            image: hbAppImg,
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
            image: spaceXImg,
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
            image: washwoodHeathImg,
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
            image: pakHealthImg,
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

    return (
        <div id='achivement' className="section-container overflow-hidden p-0 sm:p-5 md:p-10 my-12 min-h-screen flex flex-col justify-center items-center text-center" onClick={calculateHitElements} >
            <div rel="noopener noreferrer"
            >
                <h2 className="text-3xl font-bold text-cyan-500 mb-6">Achievements</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-[6%] sm:p-[8%] lg:p-[10%]">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            ref={(el) => {
                                if (el) elementRefs.current[`card-${index}-container`] = el;
                            }}
                            className="group relative flex flex-col md:flex-row w-full bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 overflow-hidden"
                            style={{ transform: hitElementsTransforms.get(`card-${index}-container`) || 'none' }}
                        >
                            {/* IMAGE CONTAINER */}
                            <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                                <img
                                    ref={(el) => {
                                        if (el) elementRefs.current[`card-${index}-image`] = el;
                                    }}
                                    src={project.image}
                                    alt={project.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{ transform: hitElementsTransforms.get(`card-${index}-image`) || 'none' }}
                                />
                                {/* Glass Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Action Buttons - Restyled */}
                                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-white/90 dark:bg-zinc-900/90 text-sky-600 dark:text-sky-400 text-sm font-bold rounded-full shadow-xl hover:bg-sky-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        Live Demo
                                    </a>
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-zinc-900/90 dark:bg-white/90 text-white dark:text-black text-sm font-bold rounded-full shadow-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        Source
                                    </a>
                                </div>
                            </div>

                            {/* CONTENT CONTAINER */}
                            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <h3
                                        ref={(el) => {
                                            if (el) elementRefs.current[`card-${index}-title`] = el;
                                        }}
                                        className="font-extrabold text-xl md:text-2xl mb-4 bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent transition-transform"
                                        style={{ transform: hitElementsTransforms.get(`card-${index}-title`) || 'none' }}
                                    >
                                        {project.name}
                                    </h3>

                                    {/* Tech Stack Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tools.map((tool, i) => {
                                            const id = `card-${index}-tool-${i}`;
                                            return (
                                                <span
                                                    key={id}
                                                    ref={(el) => {
                                                        if (el) elementRefs.current[id] = el;
                                                    }}
                                                    className="px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/20 rounded-full transition-all group-hover:bg-sky-500 group-hover:text-white"
                                                    style={{ transform: hitElementsTransforms.get(id) || 'none' }}
                                                >
                                                    {tool}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Dynamic Footer Ornament */}
                                <div className="h-1 w-12 bg-sky-500 rounded-full transition-all duration-500 group-hover:w-full opacity-30 group-hover:opacity-100" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>


    )
}

export default Achievement