import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const getRandomPosition = () => ({
    top: Math.random() * 80 + '%',
    left: Math.random() * 80 + '%'
});

export default function WanderingRobot() {
    const controls = useAnimation();
    const [position, setPosition] = useState(getRandomPosition());
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    // Move the robot every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const newPos = getRandomPosition();
            setPosition(newPos);
            controls.start({ top: newPos.top, left: newPos.left });
        }, 5000);
        return () => clearInterval(interval);
    }, [controls]);

    return (
        <motion.div
            animate={controls}
            initial={position}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute w-32 h-32 z-50"
        >
            <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                className="relative w-full h-full"
            >
                {/* Robot Body */}
                <div className="w-full h-full rounded-full bg-gray-800 border-4 border-gray-500 flex items-center justify-center relative">
                    {/* Shield Button */}
                    <motion.button
                        onClick={() => setClicked(true)}
                        className="absolute bg-red-500 w-10 h-10 rounded-full border-2 border-white shadow-lg z-20"
                        style={{ bottom: '20%', left: 'calc(50% - 1.25rem)' }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    />

                    {/* Arm covering the button */}
                    <motion.div
                        animate={{ rotate: hovered ? 0 : -90 }}
                        transition={{ duration: 0.4 }}
                        className="absolute w-10 h-4 bg-gray-700 top-[55%] left-[45%] origin-left rounded"
                    />

                    {/* Eyes */}
                    <div className="absolute top-[25%] left-[30%] w-2 h-2 rounded-full bg-white shadow-sm" />
                    <div className="absolute top-[25%] right-[30%] w-2 h-2 rounded-full bg-white shadow-sm" />

                    {/* Talk bubble */}
                    {hovered && !clicked && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: -20 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs p-2 rounded shadow-md whitespace-nowrap"
                        >
                            Click me if you dare!
                        </motion.div>
                    )}

                    {/* Sparkles when clicked */}
                    {clicked && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute -top-4 right-0 text-yellow-400"
                        >
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
