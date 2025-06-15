import React, { useRef, useEffect, useCallback } from 'react';
import { useRopeContext, Rope, Vector, Point } from '../component/RopeState';

interface RopeCanvasProps {
    // You might pass specific rope configuration here if needed,
    // otherwise, it defaults within the Rope class.
}

const RopeCanvas: React.FC<RopeCanvasProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);
    const swingAngle = useRef(0); // For slight swing animation
    const swingDirection = useRef(-1); // 1 for right, -1 for left

    const { areAllShrunk, toggleShrinkState, ropeRef } = useRopeContext();

    // Local interaction state
    const grabbed = useRef(false);
    const grabStartY = useRef(0); // Y position where the pull started

    // Image assets
    const handleImgRef = useRef<HTMLImageElement | null>(null);

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

        const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
        // Use the actual size of your handle image for collision detection
        const handleCollisionRadius = 30; // Adjust this based on your handle image size

        const dx = mouseX - handlePoint.pos.x;
        const dy = mouseY - handlePoint.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < handleCollisionRadius) {
            grabbed.current = true;
            grabStartY.current = handlePoint.pos.y; // Record starting Y for pull detection
            handlePoint.pinned = true; // Pin the handle while dragging
            e.preventDefault(); // Prevent default touch actions like scrolling
        }
    }, [ropeRef]);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!grabbed.current || !canvas || !ropeRef.current) return;

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

        const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
        handlePoint.pos.x = mouseX;
        handlePoint.pos.y = mouseY;
        handlePoint.oldPos.x = mouseX; // Important for smooth dragging
        handlePoint.oldPos.y = mouseY; // Important for smooth dragging
    }, [ropeRef]);

    const handleMouseUp = useCallback(() => {
        if (grabbed.current && ropeRef.current) {
            grabbed.current = false;
            const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
            handlePoint.pinned = false; // Unpin the handle

            const pullDistanceThreshold = 30; // Minimum pixels to qualify as a "pull"
            if (handlePoint.pos.y - grabStartY.current > pullDistanceThreshold) {
                toggleShrinkState(); // Trigger the state change via context
            }
        }
    }, [ropeRef, toggleShrinkState]);

    // Canvas setup, resize, and animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Load images
        const loadImages = () => {
            const handleImg = new Image();
            handleImg.src = 'src/assets/swirl2.png'; // <--- IMPORTANT: Replace with your actual handle image path!
            handleImg.onload = () => {
                handleImgRef.current = handleImg;
            };
        };

        loadImages();

        // Initialize/update rope instance
        const setupRope = () => {
            const centerX = canvas.width / 2;
            const startY = 0; // Anchor at the very top of the canvas
            if (!ropeRef.current) {
                // Initial rope creation
                ropeRef.current = new Rope(centerX, startY,5, 15); // numSegments, segmentLength
                // Adjust segments and length for your desired rope appearance/length
            } else {
                // If rope already exists, just update its pinned position
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

            // Update rope physics
            // Gravity: Vector(0, Y_gravity_strength)
            // Bounds: { width, height }
            // Friction: (0.9 to 0.99 for damping)
            ropeRef.current.update(new Vector(0, 2.9), { width: canvas.width, height: canvas.height }, 0.98);

            // Draw rope as a solid line
            ctx.beginPath();
            ctx.strokeStyle = '#8B4513'; // Brown color for the rope
            ctx.lineWidth = 7; // Adjust rope thickness
            ctx.lineCap = 'round'; // round makes the ends of the segments smooth
            ctx.lineJoin = 'round'; // round makes the joints smooth

            // Drawing the rope by connecting points
            if (ropeRef.current.points.length > 0) {
                ctx.moveTo(ropeRef.current.points[0].pos.x, ropeRef.current.points[0].pos.y);
                for (let i = 1; i < ropeRef.current.points.length; i++) {
                    ctx.lineTo(ropeRef.current.points[i].pos.x, ropeRef.current.points[i].pos.y);
                }
            }
            ctx.stroke();


            // Draw handle with image and swing animation
            const handlePoint = ropeRef.current.points[ropeRef.current.points.length - 1];
            const handleX = handlePoint.pos.x;
            const handleY = handlePoint.pos.y;
            const handleWidth = 95; // <--- Adjust size for your handle image (width and height)
            const handleHeight = 60; // <--- Adjust size for your handle image (width and height)

            // Simple swing animation (applies to the entire rope's anchor for a more realistic swing)
            if (!grabbed.current) { // Only swing when not being grabbed
                swingAngle.current += 0.007 * swingDirection.current; // Slower swing
                if (swingAngle.current > 11.5 || swingAngle.current < -11.5) { // Smaller swing amplitude
                    swingDirection.current *= -1;
                }
                // Apply a slight horizontal perturbation to the top of the rope for a full swing
                const swingOffset = Math.sin(swingAngle.current *14) * 5; // Adjust multiplier for intensity
                ropeRef.current.points[0].pos.x = canvas.width / 2 + swingOffset;
                ropeRef.current.points[0].oldPos.x = canvas.width / 2 + swingOffset;
            } else {
                // Reset swing when grabbed
                swingAngle.current = 0;
            }

            if (handleImgRef.current) {
                ctx.save(); // Save the current transformation matrix
                ctx.translate(handleX, handleY); // Move the origin to the handle's center
                // Rotate the handle based on the rope's last segment angle for natural rotation
                const lastStick = ropeRef.current.sticks[ropeRef.current.sticks.length - 1];
                let angle = Math.atan2(lastStick.p2.pos.y - lastStick.p1.pos.y, lastStick.p2.pos.x - lastStick.p1.pos.x) + Math.PI / 2; // + PI/2 to align with vertical rope

                // Add 180 degrees (PI radians) to rotate the image
                angle += Math.PI;

                ctx.rotate(angle); // Rotate handle to align with the rope's end and then rotate 180 degrees

                ctx.drawImage(
                    handleImgRef.current,
                    -handleHeight / 2, // Draw the image centered at the origin
                    -handleWidth / 2,
                    handleWidth   ,  // Height
                    handleHeight,    // Width
                );
                ctx.restore(); // Restore the transformation matrix
                }
            else {
                // Fallback to solid circle if image not loaded
                ctx.beginPath();
                ctx.arc(handleX, handleY, handleHeight / 2, handleWidth / 2, Math.PI * 2);
                ctx.fillStyle = areAllShrunk ? '#32cacd' : '#F44336';
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup function
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
    }, [handleMouseDown, handleMouseMove, handleMouseUp, areAllShrunk, ropeRef]); // Add all dependencies

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-auto z-10" // Canvas covers the whole screen, interacts
            style={{ backgroundColor: 'transparent' }} // Ensure canvas background is transparent
        />
    );
};

export default RopeCanvas;