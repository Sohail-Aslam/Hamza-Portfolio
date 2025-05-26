import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IoMdMenu } from "react-icons/io";
import Header from '../component/header';
import About from '../component/about';
import Achivement from '../component/achivement';
import Certificate from '../component/certificates';
import Contact from '../component/contact';
import BombControls from './BombControls';
import Skills from '../component/skills';
import { Howl } from 'howler';
import { useBomb } from '../component/BombContext'; 

// --- Physics Classes (same as before) ---
class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n: number): Vector {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n: number): Vector {
        this.x /= n;
        this.y /= n;
        return this;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector {
        const len = this.length;
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    static sub(a: Vector, b: Vector): Vector {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    static fromAngle(angle: number, magnitude: number = 1): Vector {
        return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    }
}

class Point {
    pos: Vector;
    oldPos: Vector;
    pinned: boolean;

    constructor(x: number, y: number, pinned: boolean = false) {
        this.pos = new Vector(x, y);
        this.oldPos = new Vector(x, y);
        this.pinned = pinned;
    }

    update(gravity: Vector, friction: number) {
        if (this.pinned) return;

        const velocity = Vector.sub(this.pos, this.oldPos);
        velocity.mult(friction);
        this.oldPos = this.pos.copy();
        this.pos.add(velocity).add(gravity);
    }

    constrain(bounds: { width: number; height: number }) {
        const damping = 0.8;

        if (this.pos.y > bounds.height) {
            this.pos.y = bounds.height;
            this.oldPos.y = this.pos.y + (this.pos.y - this.oldPos.y) * damping;
        }
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.oldPos.x = this.pos.x + (this.pos.x - this.oldPos.x) * damping;
        }
        if (this.pos.x > bounds.width) {
            this.pos.x = bounds.width;
            this.oldPos.x = this.pos.x + (this.pos.x - this.oldPos.x) * damping;
        }
    }
}

class Stick {
    p1: Point;
    p2: Point;
    length: number;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = Vector.sub(p1.pos, p2.pos).length || 40;
    }

    update() {
        const delta = Vector.sub(this.p2.pos, this.p1.pos);
        const dist = delta.length;
        const diff = (this.length - dist) / dist / 2;

        const offset = new Vector(delta.x * diff, delta.y * diff);

        if (!this.p1.pinned) this.p1.pos.sub(offset);
        if (!this.p2.pinned) this.p2.pos.add(offset);
    }
}

class Rope {
    points: Point[];
    sticks: Stick[];
    wrapped: boolean;
    initialPoints: { x: number; y: number }[];

    constructor(x: number, y: number, segments: number, segmentLength: number) {
        this.points = [];
        this.sticks = [];
        this.wrapped = false;
        this.initialPoints = [];

        for (let i = 0; i <= segments; i++) {
            const p = new Point(x, y + i * segmentLength, i === 0);
            this.points.push(p);
            this.initialPoints.push({ x: p.pos.x, y: p.pos.y });
            if (i > 0) {
                this.sticks.push(new Stick(this.points[i - 1], p));
            }
        }
    }

    update(gravity: Vector, bounds: { width: number; height: number }, friction: number) {
        this.points.forEach(p => p.update(gravity, friction));

        if (this.wrapped) {
            const center = this.points[0].pos;
            const radius = 5;
            const angleStep = (Math.PI * 2) / (this.points.length - 1);

            this.points.forEach((p, i) => {
                if (i > 0) {
                    const angle = i * angleStep;
                    p.pos.x = center.x + Math.cos(angle) * radius * Math.sqrt(i);
                    p.pos.y = center.y + Math.sin(angle) * radius * Math.sqrt(i);
                    p.oldPos = p.pos.copy();
                }
            });
        } else {
            for (let i = 0; i < 20; i++) this.sticks.forEach(s => s.update());
        }

        this.points.forEach(p => p.constrain(bounds));
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        this.sticks.forEach(s => {
            ctx.moveTo(s.p1.pos.x, s.p1.pos.y);
            ctx.lineTo(s.p2.pos.x, s.p2.pos.y);
        });
        ctx.stroke();
    }

    updatePinnedPosition(x: number, y: number) {
        if (this.points.length > 0) {
            this.points[0].pos.x = x;
            this.points[0].pos.y = y;
            this.points[0].oldPos.x = x;
            this.points[0].oldPos.y = y;
        }
    }

    toggleWrap() {
        this.wrapped = !this.wrapped;
        this.points.forEach((p, i) => p.pinned = (i === 0 && !this.wrapped));
    }

    applyExplosion(originX: number, originY: number, power: number, radius: number, rotationInfluence: number) {
        this.points.forEach(p => {
            const distVec = Vector.sub(p.pos, new Vector(originX, originY));
            const distance = distVec.length;

            if (distance < radius) {
                const forceMagnitude = power * (1 - distance / radius);
                let forceDir = distVec.normalize();
                if (distance === 0) {
                    forceDir = Vector.fromAngle(Math.random() * Math.PI * 2, 1);
                }

                if (rotationInfluence > 0) {
                    const tangentialDir = new Vector(-forceDir.y, forceDir.x);
                    const rotationForce = tangentialDir.mult(rotationInfluence * (1 - distance / radius) / 100);
                    forceDir.add(rotationForce);
                }

                p.oldPos.x -= forceDir.x * forceMagnitude;
                p.oldPos.y -= forceDir.y * forceMagnitude;
            }
        });
    }

    reset() {
        this.points.forEach((p, i) => {
            p.pos.x = this.initialPoints[i].x;
            p.pos.y = this.initialPoints[i].y;
            p.oldPos.x = this.initialPoints[i].x;
            p.oldPos.y = this.initialPoints[i].y;
            p.pinned = (i === 0);
        });
        this.wrapped = false;
    }
}
const App: React.FC = () => {
    const {
          bombMode,
        } = useBomb();
    const dynamicZIndex = bombMode ? 'z-[70]' : 'z-0'; // or z-10/z-20 as default

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const ropeRef = useRef<Rope | null>(null);
    const animationRef = useRef<number>(0);

    const [isWrapped, setIsWrapped] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedPoint, setDraggedPoint] = useState<Point | null>(null);
    const [dragOffset, setDragOffset] = useState<Vector>(new Vector(0, 0));
    const detectionRadius = 20;
    const [activeTab, setActiveTab] = useState('header');

    const hangerHitboxes = useRef<{ id: string; x: number; y: number; r: number }[]>([]);

    const menuItems = [
        { id: 'header', icon: '🏠', label: 'Home' },
        { id: 'about', icon: '👤', label: 'About' },
        { id: 'achivement', icon: '🏆', label: 'Achievements' },
        { id: 'certificates', icon: '📜', label: 'Certificates' },
        { id: 'skills', icon: '🛠️', label: 'Skills' },
        { id: 'contact', icon: '📞', label: 'Contact' }
    ];

    const handleMenuClick = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize rope
        const initializeRope = () => {
            if (menuRef.current) {
                const menuRect = menuRef.current.getBoundingClientRect();
                const centerX = menuRect.left + menuRect.width / 2;
                const centerY = menuRect.bottom;
                ropeRef.current = new Rope(centerX, centerY, 30, 15);
            }
        };

        // Update rope's pinned position
        const updateRopePinnedPosition = () => {
            if (menuRef.current && ropeRef.current) {
                const menuRect = menuRef.current.getBoundingClientRect();
                const centerX = menuRect.left + menuRect.width / 2;
                const centerY = menuRect.bottom;
                ropeRef.current.updatePinnedPosition(centerX, centerY);
            }
        };

        // Handle canvas clicks
        const handleCanvasClick = (e: MouseEvent) => {
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check each hitbox
            for (const hit of hangerHitboxes.current) {
                if (!hit) continue;

                const dx = mouseX - hit.x;
                const dy = mouseY - hit.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < hit.r) {
                    handleMenuClick(hit.id);
                    return; // Stop after first hit
                }
            }
        };

        // Resize handler
        const handleResize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (!ropeRef.current) {
                initializeRope();
            } else {
                updateRopePinnedPosition();
            }
        };

        // ... (keep your mouse event handlers the same) ...

        // Set up event listeners
        canvas.addEventListener('click', handleCanvasClick);
        window.addEventListener('resize', handleResize);

        // Initialize
        handleResize();

        // Animation loop
        const animate = () => {
            if (!canvas || !ctx || !ropeRef.current) return;

            updateRopePinnedPosition();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update physics
            ropeRef.current.update(new Vector(0, 0.5), {
                width: canvas.width,
                height: canvas.height
            }, 0.98);

            // Draw rope
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            ropeRef.current.sticks.forEach(s => {
                ctx.moveTo(s.p1.pos.x, s.p1.pos.y);
                ctx.lineTo(s.p2.pos.x, s.p2.pos.y);
            });
            ctx.stroke();

            // Draw menu items
            const attachIndices = [5, 10, 15, 20, 25, 30];
            hangerHitboxes.current = [];

            attachIndices.forEach((i, idx) => {
                if (ropeRef.current && ropeRef.current.points[i] && menuItems[idx]) {
                    const pos = ropeRef.current.points[i].pos;
                    const item = menuItems[idx];
                    const size = 40;
                    const radius = 5;

                    // Draw rounded rectangle
                    ctx.beginPath();
                    ctx.roundRect(pos.x - size / 2, pos.y - size / 2, size, size, radius);
                    ctx.fillStyle = activeTab === item.id ? '#32cacd' : '#32cauh';
                    ctx.fill();

                    // Draw icon
                    ctx.font = "20px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = 'white';
                    ctx.fillText(item.icon, pos.x, pos.y);

                    // Store hitbox
                    hangerHitboxes.current[idx] = {
                        id: item.id,
                        x: pos.x,
                        y: pos.y,
                        r: size / 2
                    };
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (canvas) {
                canvas.removeEventListener('click', handleCanvasClick);
            }
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isDragging, dragOffset, isWrapped, activeTab]);

    const toggleWrap = useCallback(() => {
        if (ropeRef.current) {
            ropeRef.current.toggleWrap();
            setIsWrapped(ropeRef.current.wrapped);
            if (!ropeRef.current.wrapped) {
                setIsDragging(false);
                setDraggedPoint(null);
            }
        }
    }, []);

    return (
        <div className="relative w-full h-66 font-sans">
            {/* Menu Button */}
            <div className="bg-white p-4 sm:p-6 w-full rounded-b-3xl fixed top-0 left-0 z-50 flex items-center justify-start shadow-md">
                <div
                    ref={menuRef}
                    onClick={toggleWrap}
                    className="border-2 p-2 rounded-lg border-gray-400 text-gray-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm active:shadow-inner z-100"
                    title={isWrapped ? "Unwrap Rope" : "Wrap Rope"}
                >
                    <IoMdMenu />
                </div>
            </div>

            {/* Canvas - now with pointer-events-auto to allow clicks */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 z-40 pointer-events-auto"
            />

            {/* Content Sections */}
            <div className={`relative pt-24 ${bombMode ? 'z-[70]' : 'z-0'}`}>
                <BombControls />

                <section id="header" className={`min-h-s ${dynamicZIndex}`}>
                    <Header />
                </section>

                <section id="about" className={`min-h-screen  ${dynamicZIndex}`}>
                    <About />
                </section>

                <section id="achivement" className={`min-h-screen  ${dynamicZIndex}`}>
                    <Achivement />
                </section>

                <section id="certificates" className={`min-h-screen  ${dynamicZIndex}`}>
                    <Certificate />
                </section>

                <section id="skills" className={`min-h-screen  ${dynamicZIndex}`}>
                    <Skills />
                </section>

                <section id="contact" className={`min-h-screen  ${dynamicZIndex}`}>
                    <Contact />
                </section>
            </div>
        </div>
    );
};

export default App;