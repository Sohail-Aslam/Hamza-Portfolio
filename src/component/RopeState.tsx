import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';

// =============================================================================
// Helper Physics Classes (Simplified for demonstration, ideally from a library like Matter.js)
// If you're using Matter.js, you'd import it and use its classes.
// These are simple implementations for a basic Verlet rope.
// =============================================================================

export class Vector { // <--- ADD export
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

export class Point { // <--- ADD export
    pos: Vector;
    oldPos: Vector;
    pinned: boolean;
    constructor(x: number, y: number) {
        this.pos = new Vector(x, y);
        this.oldPos = new Vector(x, y);
        this.pinned = false;
    }

    update(gravity: Vector, friction: number) {
        if (this.pinned) return;
        const vx = (this.pos.x - this.oldPos.x) * friction;
        const vy = (this.pos.y - this.oldPos.y) * friction;

        this.oldPos.x = this.pos.x;
        this.oldPos.y = this.pos.y;

        this.pos.x += vx + gravity.x;
        this.pos.y += vy + gravity.y;
    }

    constrain(bounds: { width: number; height: number }) {
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x > bounds.width) this.pos.x = bounds.width;
        if (this.pos.y < 0) this.pos.y = 0;
        if (this.pos.y > bounds.height) this.pos.y = bounds.height;
    }
}

export class Stick { // <--- ADD export (good practice if Rope relies on it)
    p1: Point;
    p2: Point;
    length: number;
    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = p1.pos.subtract(p2.pos).magnitude();
    }

    update() {
        const dx = this.p2.pos.x - this.p1.pos.x;
        const dy = this.p2.pos.y - this.p1.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const difference = this.length - distance;
        const percent = difference / distance / 2;

        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!this.p1.pinned) {
            this.p1.pos.x -= offsetX;
            this.p1.pos.y -= offsetY;
        }
        if (!this.p2.pinned) {
            this.p2.pos.x += offsetX;
            this.p2.pos.y += offsetY;
        }
    }
}

export class Rope { // Already exported
    points: Point[];
    sticks: Stick[];
    pinnedPointIndex: number;

    constructor(startX: number, startY: number, numSegments: number, segmentLength: number) {
        this.points = [];
        this.sticks = [];

        for (let i = 0; i <= numSegments; i++) {
            this.points.push(new Point(startX, startY + i * segmentLength));
        }

        for (let i = 0; i < numSegments; i++) {
            this.sticks.push(new Stick(this.points[i], this.points[i + 1]));
        }

        this.points[0].pinned = true;
        this.pinnedPointIndex = 0;
    }

    update(gravity: Vector, bounds: { width: number; height: number }, friction: number) {
        this.points.forEach(p => p.update(gravity, friction));

        for (let i = 0; i < 5; i++) {
            this.sticks.forEach(s => s.update());
        }

        this.points.forEach(p => p.constrain(bounds));
    }

    updatePinnedPosition(x: number, y: number) {
        if (this.points[this.pinnedPointIndex]) {
            this.points[this.pinnedPointIndex].pos.x = x;
            this.points[this.pinnedPointIndex].pos.y = y;
            this.points[this.pinnedPointIndex].oldPos.x = x;
            this.points[this.pinnedPointIndex].oldPos.y = y;
        }
    }
}


// =============================================================================
// Context Definition
// =============================================================================

interface RopeContextType {
    areAllShrunk: boolean;
    toggleShrinkState: () => void;
    // We export ropeRef, but components should generally not directly manipulate it.
    // It's exposed here primarily for the RopeCanvas component to draw the rope.
    ropeRef: React.MutableRefObject<Rope | null>; 
}

const RopeContext = createContext<RopeContextType | undefined>(undefined);

interface RopeProviderProps {
    children: ReactNode;
}

export const RopeProvider: React.FC<RopeProviderProps> = ({ children }) => {
    const [areAllShrunk, setAreAllShrunk] = useState(false);
    const ropeRef = useRef<Rope | null>(null); // This ref holds the actual rope instance

    const toggleShrinkState = useCallback(() => {
        setAreAllShrunk(prev => !prev);
    }, []);

    // You can also add more direct control methods if needed, e.g.:
    // const setRopeInstance = useCallback((instance: Rope) => {
    //     ropeRef.current = instance;
    // }, []);

    const contextValue: RopeContextType = {
        areAllShrunk,
        toggleShrinkState,
        ropeRef,
    };

    return (
        <RopeContext.Provider value={contextValue}>
            {children}
        </RopeContext.Provider>
    );
};

export const useRopeContext = () => {
    const context = useContext(RopeContext);
    if (context === undefined) {
        throw new Error('useRopeContext must be used within a RopeProvider');
    }
    return context;
};