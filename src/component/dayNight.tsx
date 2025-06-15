import React from 'react';
import { useTheme } from "../component/ThemeContext";

const DayNight: React.FC = () => {
    const { isDay, toggleDayNight } = useTheme();

    const sunMoonPosition = isDay
        ? 'top-1/4 left-1/2 -translate-x-1/2 opacity-70'
        : 'top-[calc(100%-20rem)] left-1/2 -translate-x-1/2 opacity-0';

    const moonPosition = isDay
        ? 'top-[calc(100%-20rem)] left-1/2 -translate-x-1/2 opacity-0'
        : 'top-1/4 left-1/2 -translate-x-1/2 opacity-70';

    return (
        <div className="fixed min-h-screen min-w-screen flex flex-col items-center justify-center font-sans overflow-hidden z-0">
            {/* Sky Background */}
            <div className={`absolute z-0 inset-0 bg-gradient-to-t transition-all duration-1000 ease-in-out`}></div>

            {/* Sun */}
            <div className={`absolute bottom-30 w-144 h-144 rounded-full bg-yellow-200 shadow-lg ${isDay ? 'shadow-yellow-500/70' : 'shadow-none'}
                        transition-all duration-1000 ease-in-out z-10 ${sunMoonPosition}`}>
                <div className={`absolute inset-0 rounded-full blur-xl ${isDay ? 'bg-yellow-300 animate-pulse-slow' : 'bg-transparent'}
                            transition-all duration-1000 ease-in-out`}></div>
            </div>

            {/* Moon */}
            <div className={`absolute w-94 h-94 rounded-full bg-gray-300 shadow-lg ${!isDay ? 'shadow-gray-500/70' : 'shadow-none'}
                        transition-all duration-1000 ease-in-out z-10 ${moonPosition}`}>
                <div className="absolute w-12 h-12 bg-gray-600 rounded-full top-8 left-18 opacity-70"></div>
                <div className="absolute w-8 h-8 bg-gray-400 rounded-full top-20 right-14 opacity-70"></div>
                <div className="absolute w-18 h-16 bg-gray-400 rounded-full bottom-10 left-18 opacity-70"></div>
            </div>

            {/* Clouds */}
            <div className={`absolute inset-0 ${isDay ? 'opacity-70' : 'opacity-0'} transition-opacity duration-100 ease-in-out z-10`}>
                <div className="absolute w-48 h-24 bg-white rounded-full cloud-shape-1 animate-cloud-move-1 top-20 left-10"></div>
                <div className="absolute w-64 h-32 bg-white rounded-full cloud-shape-2 animate-cloud-move-2 top-40 right-20"></div>
                <div className="absolute w-56 h-28 bg-white rounded-full cloud-shape-3 animate-cloud-move-3 bottom-60 left-90"></div>
            </div>

            {/* Blur overlay */}
            <div className={`absolute min-w-screen inset-0 backdrop-filter backdrop-blur-2xl transition-all duration-1000 ease-in-out z-20`}></div>


            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s infinite ease-in-out;
                }

                .text-shadow-lg {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
                }

                .cloud-shape-1 {
                    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
                    box-shadow: 0 0 0 10px rgba(255,255,255,0.3) inset;
                }
                .cloud-shape-2 {
                    border-radius: 50% 50% 50% 50% / 80% 80% 80% 80%;
                    box-shadow: 0 0 0 8px rgba(255,255,255,0.2) inset;
                }
                .cloud-shape-3 {
                    border-radius: 50% 50% 50% 50% / 70% 70% 70% 70%;
                    box-shadow: 0 0 0 12px rgba(255,255,255,0.4) inset;
                }

                @keyframes cloud-move-1 {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100px); }
                }
                @keyframes cloud-move-2 {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-80px); }
                }
                @keyframes cloud-move-3 {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(120px); }
                }

                .animate-cloud-move-1 { animation: cloud-move-1 20s infinite alternate linear; }
                .animate-cloud-move-2 { animation: cloud-move-2 25s infinite alternate linear; }
                .animate-cloud-move-3 { animation: cloud-move-3 30s infinite alternate linear; }
            `}</style>
        </div>
    );
};

export default DayNight;
