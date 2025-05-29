import React, { useState } from 'react';
import { useBomb } from './BombContext';
import { FaChevronDown } from "react-icons/fa";
import { TbBomb } from "react-icons/tb";
import { TbBombFilled } from "react-icons/tb";
import { RiResetLeftLine } from "react-icons/ri";
import '../App.css';

const BombControls = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
        bombMode,
        setBombMode,
        adjustablePower,
        setAdjustablePower,
        adjustableRadius,
        setAdjustableRadius,
        adjustableRotation,
        setAdjustableRotation,
        reset,
    } = useBomb();

    // Provide default values for variables that might be undefined from useBomb()
    const currentBombMode: boolean = bombMode ?? false;
    const currentAdjustablePower: number = adjustablePower ?? 450;
    const currentAdjustableRadius: number = adjustableRadius ?? 150;
    const currentAdjustableRotation: number = adjustableRotation ?? 0;

    // Provide no-op functions as defaults if the setters are undefined.
    // This resolves the "Cannot invoke an object which is possibly 'undefined'" error.
    const safeSetBombMode = setBombMode ?? (() => { });
    const safeSetAdjustablePower = setAdjustablePower ?? (() => { });
    const safeSetAdjustableRadius = setAdjustableRadius ?? (() => { });
    const safeSetAdjustableRotation = setAdjustableRotation ?? (() => { });
    const safeReset = reset ?? (() => { });


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
            <div className="fixed top-4 right-6 z-250 flex flex-col items-start gap-2 p- rounded-lg shadow-lg border-2 p- rounded-sm border-black-600">
                <div className="flex gap-20">
                    <button
                        onClick={() => {
                            safeSetBombMode(!currentBombMode); // Use the safe setter
                            const btn = document.getElementById("bomb-button");
                            if (btn) {
                                btn.classList.remove("shake");
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                void btn.offsetWidth;
                                btn.classList.add("shake");
                            }
                        }}
                        id="bomb-button"
                        className={`p-2 transition-all duration-300 transform rounded-full ${currentBombMode ? 'bg-black p-2 text-white' : 'hover:scale-105'
                            }`}
                        aria-label="Toggle Bomb Mode"
                    >
                        {currentBombMode ? <TbBombFilled /> : <TbBomb />}
                    </button>

                    <button
                        onClick={safeReset} // Use the safe reset function
                        className="p-2 transition-all duration-300 transform hover:scale-105 focus:outline-none"
                        aria-label="Reset Bomb Settings"
                    >
                        <RiResetLeftLine />
                    </button>

                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="p-2 transition-transform hover:scale-110 focus:outline-none"
                        aria-label={isMenuOpen ? "Close Control Menu" : "Open Control Menu"}
                    >
                        <FaChevronDown />
                    </button>
                </div>

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
                                value={currentAdjustablePower}
                                onChange={(e) => safeSetAdjustablePower(Number(e.target.value))} // Use the safe setter
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label={`Bomb Power: ${currentAdjustablePower}px`}
                            />
                            <span className="text-sm">{currentAdjustablePower}px</span>
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
                                value={currentAdjustableRadius}
                                onChange={(e) => safeSetAdjustableRadius(Number(e.target.value))} // Use the safe setter
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label={`Bomb Radius: ${currentAdjustableRadius}px`}
                            />
                            <span className="text-sm">{currentAdjustableRadius}px</span>
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
                                value={currentAdjustableRotation}
                                onChange={(e) => safeSetAdjustableRotation(Number(e.target.value))} // Use the safe setter
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label={`Bomb Rotation: ${currentAdjustableRotation}°`}
                            />
                            <span className="text-sm">{currentAdjustableRotation}°</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BombControls;