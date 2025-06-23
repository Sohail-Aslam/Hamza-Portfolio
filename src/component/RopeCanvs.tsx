// src/component/RopeCanvas.tsx

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useRopeContext, Rope, Vector } from '../component/RopeState'; // Import RopeState as RopeState, not Rope

interface RopeCanvasProps {
    // New prop: a callback function to notify the parent about the pull action
    onRopePulled: () => void;
    // The current shrink state can also be passed as a prop for visual feedback (e.g., handle color)
    isShrunk: boolean;
}

const RopeCanvas: React.FC<RopeCanvasProps> = ({ onRopePulled, isShrunk }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);
    const swingAngle = useRef(0); // For slight swing animation
    const swingDirection = useRef(-1); // 1 for right, -1 for left

    const { ropeRef } = useRopeContext(); // No longer consuming areAllShrunk or toggleShrinkState

    // Local interaction state
    const grabbed = useRef(false);
    const grabStartY = useRef(0); // Y position where the pull started
    const [isHoveringHandle, setIsHoveringHandle] = useState(false); // State for cursor

    // Image assets
    const handleImgRef = useRef<HTMLImageElement | null>(null);

    // Helper function to check if mouse is over the handle
    const isMouseOverHandle = useCallback((mouseX: number, mouseY: number): boolean => {
        if (!ropeRef.current) return false;
        const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
        // Use the actual size of your handle image for collision detection
        const handleCollisionRadius = 30; // Adjust this based on your handle image size

        const dx = mouseX - handlePoint.pos.x;
        const dy = mouseY - handlePoint.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < handleCollisionRadius;
    }, [ropeRef]);

    const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas || !ropeRef.current) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        if (isMouseOverHandle(mouseX, mouseY)) {
            grabbed.current = true;
            grabStartY.current = ropeRef.current.points[ropeRef.current.points.length - 1].pos.y;
            ropeRef.current.points[ropeRef.current.points.length - 1].pinned = true;
            e.preventDefault();
        }
    }, [ropeRef, isMouseOverHandle]);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas || !ropeRef.current) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        // Update hover state for cursor
        setIsHoveringHandle(isMouseOverHandle(mouseX, mouseY));

        if (!grabbed.current) return;

        const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
        handlePoint.pos.x = mouseX;
        handlePoint.pos.y = mouseY;
        handlePoint.oldPos.x = mouseX;
        handlePoint.oldPos.y = mouseY;
    }, [ropeRef, isMouseOverHandle]);

    const handleMouseUp = useCallback(() => {
        if (grabbed.current && ropeRef.current) {
            grabbed.current = false;
            const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
            handlePoint.pinned = false;

            const pullDistanceThreshold = 30;
            if (handlePoint.pos.y - grabStartY.current > pullDistanceThreshold) {
                onRopePulled(); // Call the prop function instead of context
            }
        }
    }, [ropeRef, onRopePulled]); // Add onRopePulled to dependencies

    // Canvas setup, resize, and animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Load images
        const loadImages = () => {
            const handleImg = new Image();
            handleImg.src = 'src/assets/swirl2.png';
            handleImg.onload = () => {
                handleImgRef.current = handleImg;
            };
        };

        loadImages();

        // Initialize/update rope instance
        const setupRope = () => {
            const centerX = canvas.width / 2;
            const startY = 0;
            if (!ropeRef.current) {
                ropeRef.current = new Rope(centerX, startY, 5, 15);
            } else {
                ropeRef.current.updatePinnedPosition(centerX, startY);
            }
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            setupRope();
        };

        // Add event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleMouseDown, { passive: false });
        canvas.addEventListener('touchmove', handleMouseMove, { passive: false });
        canvas.addEventListener('touchend', handleMouseUp);
        window.addEventListener('resize', handleResize);

        // Initial setup
        handleResize();

        // Animation loop
        const animate = () => {
            if (!ctx || !ropeRef.current) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ropeRef.current.update(new Vector(0, 2.9), { width: canvas.width, height: canvas.height }, 0.98);

            ctx.beginPath();
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (ropeRef.current.points.length > 0) {
                ctx.moveTo(ropeRef.current.points[0].pos.x, ropeRef.current.points[0].pos.y);
                for (let i = 1; i < ropeRef.current.points.length; i++) {
                    ctx.lineTo(ropeRef.current.points[i].pos.x, ropeRef.current.points[i].pos.y);
                }
            }
            ctx.stroke();

            const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
            const handleX = handlePoint.pos.x;
            const handleY = handlePoint.pos.y;
            const handleWidth = 95;
            const handleHeight = 60;

            if (!grabbed.current) {
                swingAngle.current += 0.007 * swingDirection.current;
                if (swingAngle.current > 11.5 || swingAngle.current < -11.5) {
                    swingDirection.current *= -1;
                }
                const swingOffset = Math.sin(swingAngle.current * 14) * 5;
                ropeRef.current.points[0].pos.x = canvas.width / 2 + swingOffset;
                ropeRef.current.points[0].oldPos.x = canvas.width / 2 + swingOffset;
            } else {
                swingAngle.current = 0;
            }

            if (handleImgRef.current) {
                ctx.save();
                ctx.translate(handleX, handleY);
                const lastStick = ropeRef.current.sticks[ropeRef.current.sticks.length - 1];
                let angle = Math.atan2(lastStick.p2.pos.y - lastStick.p1.pos.y, lastStick.p2.pos.x - lastStick.p1.pos.x) + Math.PI / 2;
                angle += Math.PI;
                ctx.rotate(angle);
                ctx.drawImage(
                    handleImgRef.current,
                    -handleHeight / 2,
                    -handleWidth / 2,
                    handleWidth,
                    handleHeight,
                );
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(handleX, handleY, handleHeight / 2, handleWidth / 2, Math.PI * 2);
                // Use the new isShrunk prop for handle color
                ctx.fillStyle = isShrunk ? '#32cacd' : '#F44336';
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleMouseDown);
            canvas.removeEventListener('touchmove', handleMouseMove);
            canvas.removeEventListener('touchend', handleMouseUp);
            window.removeEventListener('resize', handleResize);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, isShrunk, ropeRef]); // isShrunk is now a prop

    // Effect to update cursor style
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.cursor = isHoveringHandle ? 'pointer' : 'default';
        }
    }, [isHoveringHandle]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-auto z-10"
            style={{ backgroundColor: 'transparent' }}
        />
    );
};

export default RopeCanvas;