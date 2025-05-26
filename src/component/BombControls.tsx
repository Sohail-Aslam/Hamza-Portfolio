import React, { useState } from 'react';
import { useBomb } from './BombContext'; // Uncomment this in your actual application
import { FaChevronDown } from "react-icons/fa";
import { TbBomb } from "react-icons/tb";
import { TbBombFilled } from "react-icons/tb";
import { RiResetLeftLine } from "react-icons/ri";
import '../App.css'
const BombControls = () => {
    // Initialize isMenuOpen as a boolean, not a string
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
        bombMode, // eslint-disable-line no-unused-vars
        setBombMode,
        adjustablePower,
        setAdjustablePower,
        adjustableRadius,
        setAdjustableRadius,
        adjustableRotation,
        setAdjustableRotation,
        reset,
    } = useBomb();

    return (
        <>
            <style>
                {`
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down .5s ease-out forwards;
                }
                `}
            </style>
            {/* Main control container, positioned fixed on the screen.
                Removed 'sm:flex-row' to ensure the menu always appears below the buttons. */}
            <div className="fixed top-4 right-6 z-50 flex flex-col items-start gap-2 p- rounded-lg shadow-lg border-2 p- rounded-sm border-black-600">
                {/* Container for the main action buttons */}
                <div className="flex gap-20">
                    {/* Button to activate bomb mode */}
                    <button
                        onClick={() => {
                            setBombMode(!bombMode);
                            // Trigger shake animation by forcing reflow
                            const btn = document.getElementById("bomb-button");
                            if (btn) {
                                btn.classList.remove("shake");
                                void btn.offsetWidth; // force reflow
                                btn.classList.add("shake");
                            }
                        }}
                        id="bomb-button"
                        className={`p-2 transition-all duration-300 transform rounded-full ${bombMode ? 'bg-black p-2 text-white' : 'hover:scale-105'
                            }`}
                        aria-label="Toggle Bomb Mode"
                    >
                        {bombMode ? <TbBombFilled /> : <TbBomb />}
                    </button>


                    {/* Button to reset settings */}
                    <button
                        onClick={reset}
                        className="p-2 transition-all duration-300 transform hover:scale-105 focus:outline-none"
                        aria-label="Reset Bomb Settings" // Added for accessibility
                    >
                        <RiResetLeftLine /> 
                    </button>

                    {/* Button to toggle the control menu visibility */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="p-2 transition-transform hover:scale-110 focus:outline-none"
                        aria-label={isMenuOpen ? "Close Control Menu" : "Open Control Menu"} // Dynamic label for accessibility
                    >
                        <FaChevronDown />                    </button>
                </div>

                {/* Conditional rendering for the control menu.
                    This div is now a direct sibling to the button container,
                    and due to the parent's flex-col, it will always appear below. */}
                {isMenuOpen && (
                    <div className="mt-2 w-64 p-4 bg-gray-900 text-white rounded-xs shadow-xl transition-all space-y-4 animate-fade-in-down">
                        {/* Power adjustment slider */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="power-slider" className="text-sm w-16">
                                Power:
                            </label>
                            <input
                                id="power-slider"
                                type="range"
                                min="50"
                                max="1000"
                                value={adjustablePower}
                                onChange={(e) => setAdjustablePower(Number(e.target.value))}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label={`Bomb Power: ${adjustablePower}px`} // Added for accessibility
                            />
                            <span className="text-sm">{adjustablePower}px</span>
                        </div>

                        {/* Radius adjustment slider */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="area-slider" className="text-sm w-16">
                                Area:
                            </label>
                            <input
                                id="area-slider"
                                type="range"
                                min="10"
                                max="300"
                                value={adjustableRadius}
                                onChange={(e) => setAdjustableRadius(Number(e.target.value))}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label={`Bomb Radius: ${adjustableRadius}px`} // Added for accessibility
                            />
                            <span className="text-sm">{adjustableRadius}px</span>
                        </div>

                        {/* Rotation adjustment slider */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="rotation-slider" className="text-sm w-16">
                                Rotation:
                            </label>
                            <input
                                id="rotation-slider"
                                type="range"
                                min="0"
                                max="360"
                                value={adjustableRotation}
                                onChange={(e) => setAdjustableRotation(Number(e.target.value))}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label={`Bomb Rotation: ${adjustableRotation}°`} // Added for accessibility
                            />
                            <span className="text-sm">{adjustableRotation}°</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BombControls;
