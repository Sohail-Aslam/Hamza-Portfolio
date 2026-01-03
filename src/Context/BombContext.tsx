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

    const isElementInViewport = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const buffer = 50;
        return (
            rect.top >= -buffer &&
            rect.left >= -buffer &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + buffer &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + buffer
        );
    };

    const calculateHitElements = (e: React.MouseEvent) => {
        if (!bombMode) return;

        const clickX = e.clientX;
        const clickY = e.clientY;

        // ✅ Avoid duplicate fire at nearly same spot
        const minDistance = 30;
        const alreadyExists = firePoints.some(({ x, y }) => {
            const dx = x - clickX;
            const dy = y - clickY;
            return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });

        if (alreadyExists) return;

        triggerExplosion(clickX, clickY);

        const newTransforms = new Map<string, string>();

        if (elementRefs.current) {
            Object.entries(elementRefs.current).forEach(([id, el]) => {
                if (el && isElementInViewport(el)) {
                    const elementRect = el.getBoundingClientRect();
                    const currentElementCenterX = elementRect.left + elementRect.width / 2;
                    const currentElementCenterY = elementRect.top + elementRect.height / 2;

                    const dx = currentElementCenterX - clickX;
                    const dy = currentElementCenterY - clickY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= adjustableRadius) {
                        const forceMultiplier = (adjustableRadius - distance) / adjustableRadius;

                        const normalizedDx = distance === 0 ? 0 : dx / distance;
                        const normalizedDy = distance === 0 ? 0 : dy / distance;

                        const pushTx = normalizedDx * adjustablePower * forceMultiplier;
                        const pushTy = normalizedDy * adjustablePower * forceMultiplier;

                        const randomRot = Math.random() * 2 - 1;
                        const pushRot = randomRot * adjustableRotation;

                        const currentTransformString = hitElementsTransforms.get(id) || 'translate(0px, 0px) rotate(0deg)';
                        const { x: currentTotalTx, y: currentTotalTy, rot: currentTotalRot } = parseTransform(currentTransformString);

                        const finalTx = currentTotalTx + pushTx;
                        const finalTy = currentTotalTy + pushTy;
                        const finalRot = currentTotalRot + pushRot;

                        const finalTransformString = `translate(${finalTx}px, ${finalTy}px) rotate(${finalRot}deg)`;
                        newTransforms.set(id, finalTransformString);
                    }
                }
            });
        }

        setBombPoint({ x: clickX, y: clickY });
        setHitElementsTransforms(prev => new Map([...prev, ...newTransforms]));
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