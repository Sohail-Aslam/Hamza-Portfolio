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
    // If you add functions like calculateHitElements, reset, etc., define them here too:
    calculateHitElements?: (e: React.MouseEvent) => void;
    reset?: () => void;
    adjustablePower?: number; // Add these if you pass them through context
    setAdjustablePower?: React.Dispatch<React.SetStateAction<number>>;
    adjustableRadius?: number;
    setAdjustableRadius?: React.Dispatch<React.SetStateAction<number>>;
    adjustableRotation?: number;
    setAdjustableRotation?: React.Dispatch<React.SetStateAction<number>>;
}

// Provide a default value that matches the context type.
// All properties should be present, even if some are null/undefined initially.
const BombContext = createContext<BombContextType | null>(null);

export const BombProvider = ({ children }: { children: React.ReactNode }) => {
    const [bombMode, setBombMode] = useState<boolean>(false);
    const [bombPoint, setBombPoint] = useState<{ x: number; y: number } | null>(null);
    const [hitElementsTransforms, setHitElementsTransforms] = useState<Map<string, string>>(new Map());
    const elementRefs = useRef<Record<string, HTMLElement | null>>({});

    // You need to define these in the provider if they are part of the context value
    const [adjustableRadius, setAdjustableRadius] = useState(210);
    const [adjustablePower, setAdjustablePower] = useState(80);
    const [adjustableRotation, setAdjustableRotation] = useState(8);

    // Define the functions if they are to be part of the context
    // This is a placeholder for your actual calculateHitElements and reset functions.
    // You would typically define them within the BombProvider or import them.
    const calculateHitElements = () => { // Removed 'e: React.MouseEvent'

        // Your calculation logic here
        console.log("Calculating hit elements (placeholder)");
    };

    const reset = () => {
        window.location.reload();
    };
    

    return (
        <BombContext.Provider value={{
            bombMode,
            setBombMode,
            bombPoint,
            setBombPoint,
            hitElementsTransforms,
            setHitElementsTransforms,
            elementRefs,
            // Expose the functions and state from Header if you want them globally accessible
            calculateHitElements,
            reset,
            adjustablePower,
            setAdjustablePower,
            adjustableRadius,
            setAdjustableRadius,
            adjustableRotation,
            setAdjustableRotation,
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