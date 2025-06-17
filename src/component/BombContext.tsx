// component/BombContext.tsx
import React, { createContext, useContext, useState, useRef } from 'react';

// Define the type for the context value
interface BombContextType {
    bombMode: boolean;
    setBombMode: React.Dispatch<React.SetStateAction<boolean>>;
    bombPoint: { x: number; y: number } | null;
    setBombPoint: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
    hitElementsTransforms: Map<string, string>;
    setHitElementsTransforms: React.Dispatch<React.SetStateAction<Map<string, string>>>;
    elementRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
    calculateHitElements?: (e: React.MouseEvent) => void;
    reset: () => void; // Make sure reset is defined and required
    adjustablePower?: number;
    setAdjustablePower?: React.Dispatch<React.SetStateAction<number>>;
    adjustableRadius?: number;
    setAdjustableRadius?: React.Dispatch<React.SetStateAction<number>>;
    adjustableRotation?: number;
    setAdjustableRotation?: React.Dispatch<React.SetStateAction<number>>;
    firePoints: { x: number; y: number; id: string }[];
    setFirePoints: React.Dispatch<React.SetStateAction<{ x: number; y: number; id: string }[]>>;
    triggerExplosion: (x: number, y: number) => void;
}

// Provide a default value that matches the context type.
const BombContext = createContext<BombContextType | null>(null);

export const BombProvider = ({ children }: { children: React.ReactNode }) => {
    const [bombMode, setBombMode] = useState<boolean>(false);
    const [bombPoint, setBombPoint] = useState<{ x: number; y: number } | null>(null);
    const [hitElementsTransforms, setHitElementsTransforms] = useState<Map<string, string>>(new Map());
    const elementRefs = useRef<Record<string, HTMLElement | null>>({});
    const [firePoints, setFirePoints] = useState<{ x: number; y: number; id: string }[]>([]);

    const bombSoundRef = useRef(new Audio("/assets/bomb.mp3"));

    const triggerExplosion = (x: number, y: number) => {
        if (!bombMode) return;

        try {
            bombSoundRef.current.currentTime = 0;
            bombSoundRef.current.play().catch((err) => {
                console.warn("Audio blocked until user interacts:", err);
            });
        } catch (err) {
            console.error("Failed to play bomb sound:", err);
        }

        const fireId = Date.now().toString();
        setFirePoints(prev => [...prev, { x, y, id: fireId }]);
        setTimeout(() => {
            setFirePoints(prev => prev.filter(f => f.id !== fireId));
        }, 1000); // match your GIF duration
    };

    const [adjustableRadius, setAdjustableRadius] = useState(210);
    const [adjustablePower, setAdjustablePower] = useState(80);
    const [adjustableRotation, setAdjustableRotation] = useState(8);

    // Modified reset function: Clear the transforms
    const reset = () => {
        setHitElementsTransforms(new Map()); // This will revert elements to their original positions
        setFirePoints([]); // Clear any lingering fire animations
        setBombPoint(null); // Clear bomb point if needed
    };

    // calculateHitElements needs to be defined within the provider or passed as a prop if it's used directly from context
    const calculateHitElements = (e: React.MouseEvent) => {
        // Your existing calculateHitElements logic goes here.
        // It's good that it's defined in Header and then called.
        // If you were to move it here, it would need access to elementRefs directly.
        // For now, let's assume it's correctly handled in the Header as you have it.
        console.log("Calculating hit elements (placeholder - defined in Header)");
    };

    return (
        <BombContext.Provider value={{
            bombMode, setBombMode,
            bombPoint, setBombPoint,
            hitElementsTransforms, setHitElementsTransforms,
            elementRefs,
            calculateHitElements, // Include in context
            reset,
            adjustablePower, setAdjustablePower,
            adjustableRadius, setAdjustableRadius,
            adjustableRotation, setAdjustableRotation,
            firePoints, setFirePoints,
            triggerExplosion,
        }}>
            {children}
        </BombContext.Provider>
    );
};

export const useBomb = () => {
    const context = useContext(BombContext);
    if (context === null) {
        throw new Error('useBomb must be used within a BombProvider');
    }
    return context;
};