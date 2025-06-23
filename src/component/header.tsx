import React, { useCallback, useEffect, useState } from 'react';
import { FaGithub, FaTwitter, FaCodepen } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { GoMoveToEnd } from "react-icons/go";
import { useBomb } from '../component/BombContext';
import { useTheme } from '../component/ThemeContext'; // Adjust path if needed
import useSound from 'use-sound';
import '../App.css'
const socialIcons = [
  {
    id: 'icon-github',
    component: (props: React.SVGProps<SVGSVGElement>) => <FaGithub {...props} />,
    link: 'https://github.com/umairhamza',
  },
  {
    id: 'icon-linkedin',
    component: (props: React.SVGProps<SVGSVGElement>) => <FaLinkedin {...props} />,
    link: 'https://linkedin.com/in/umairhamza',
  },
  {
    id: 'icon-mail',
    component: (props: React.SVGProps<SVGSVGElement>) => <IoMdMail {...props} />,
    link: 'mailto:umairhamza@example.com',
  },
  {
    id: 'icon-twitter',
    component: (props: React.SVGProps<SVGSVGElement>) => <FaTwitter {...props} />,
    link: 'https://twitter.com/umairhamza',
  },
  {
    id: 'icon-codepen',
    component: (props: React.SVGProps<SVGSVGElement>) => <FaCodepen {...props} />,
    link: 'https://codepen.io/umairhamza',
  },
];

// Inline SVG for GoMoveToEnd icon
const GoMoveToEndSVG = (props: React.SVGProps<SVGSVGElement>) => <GoMoveToEnd {...props} />;

// Helper function to parse transform string
// Returns { x: number, y: number, rot: number }
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

const Header = () => {
  const [playBombSound] = useSound('src/assets/bomb.mp3'); // adjust path as needed
  const [bombTriggered, setBombTriggered] = React.useState(false);
  const [firePoints, setFirePoints] = useState<{ x: number; y: number; id: string }[]>([]);

  const {
    bombMode,
    adjustablePower,
    adjustableRadius,
    adjustableRotation,
    setBombPoint,
    hitElementsTransforms,
    setHitElementsTransforms,
    elementRefs,
  } = useBomb();
  const { isDay, toggleDayNight } = useTheme();
  useEffect(() => {
    if (!isDay) { // If it's not day, it's night (dark mode)
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDay]); // Re-run this effect whenever isDay changes

  // Provide default values for variables that might be undefined from useBomb()
  const currentBombMode: boolean = bombMode ?? false;
  const currentAdjustablePower: number = adjustablePower ?? 450; // Sensible default
  const currentAdjustableRadius: number = adjustableRadius ?? 150; // Sensible default
  const currentAdjustableRotation: number = adjustableRotation ?? 0; // Sensible default

  const getElementId = (prefix: string, index: number) => `${prefix}-${index}`;

  const isElementInViewport = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const buffer = 50;
    return (
      rect.top >= -buffer &&
      rect.left >= -buffer &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + buffer &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + buffer
    );
  }, []);

  const calculateHitElements = (e: React.MouseEvent) => {
    if (!currentBombMode) {
      console.log("Bomb mode is OFF, no sound will play");
      return;
    }

    console.log("Bomb mode ON, attempting to play sound");

    const clickX = e.clientX;
    const clickY = e.clientY;

    // ✅ Avoid duplicate fire at nearly same spot
    const minDistance = 30;
    const alreadyExists = firePoints.some(({ x, y }) => {
      const dx = x - clickX;
      const dy = y - clickY;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });

    if (!alreadyExists) {
      const fireId = Date.now().toString();
      setFirePoints(prev => [...prev, { x: clickX, y: clickY, id: fireId }]);

      // 🕒 Remove after 1 second (duration of fire GIF)
      setTimeout(() => {
        setFirePoints(prev => prev.filter(f => f.id !== fireId));
      }, 600);
    }

    try {
      playBombSound(); // Just trigger, no await or .then
      console.log("Sound trigger function called");
      setBombTriggered(true);
    } catch (error) {
      console.error("Error while playing sound:", error);
    }

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

          if (distance <= currentAdjustableRadius) {
            const forceMultiplier = (currentAdjustableRadius - distance) / currentAdjustableRadius;

            const normalizedDx = distance === 0 ? 0 : dx / distance;
            const normalizedDy = distance === 0 ? 0 : dy / distance;

            const pushTx = normalizedDx * currentAdjustablePower * forceMultiplier;
            const pushTy = normalizedDy * currentAdjustablePower * forceMultiplier;

            const randomRot = Math.random() * 2 - 1;
            const pushRot = randomRot * currentAdjustableRotation;

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
  const imageList = [
    'src/assets/image1 (1).png',
    'src/assets/image2 (2).png',
    'src/assets/image3 (3).png',
    'src/assets/image4 (4).png',
    'src/assets/image5 (5).png',
  ];

  return (
    <div id="home"
      className={`select-none font-inter overflow-hidden min-h-screen flex flex-col justify-center items-center text-center z-50 ${currentBombMode ? 'cursor-crosshair' : ''
        }`}
      onClick={calculateHitElements}
    >

      <div className="flex px-4 flex-col-reverse items-center w-full section-container w-full py-10 bottom-15">
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-16 text-white">
          <div className="flex flex-col gap-8">
            <h1
              className="mt-6 text-3xl sm:text-4xl md:text-5xl sm:px-10 lg:text-6xl font-bold leading-tight font-extrabold text-blue-600 mb-6 leading-tight text-[#0ea5e9]"
            >
              {"Hello, World! I am Umair Hamza.".split(' ').map((word, index) => {
                const id = getElementId('heading', index);
                return (
                  <span
                    key={id}
                    ref={(el) => {
                      if (elementRefs.current) { // Added null check
                        elementRefs.current[id] = el;
                      }
                    }}
                    className="inline-block transition-transform duration-700 ease-out"
                    style={{
                      transform: hitElementsTransforms.get(id) || 'none',
                    }}
                  >
                    {word}&nbsp;
                  </span>
                );
              })}
            </h1>

            <h3 className="text-lg sm:text-2xl text-xl text-black max-w-3xl">
              {"I'm an optimist 🤓 who enjoys spreading positivity 🤪 wherever I go.".split(' ').map(
                (word, index) => {
                  const id = getElementId('subheading', index);
                  return (
                    <span
                      key={id}
                      ref={(el) => {
                        if (elementRefs.current) { // Added null check
                          elementRefs.current[id] = el;
                        }
                      }}
                      className="inline-block transition-transform duration-700 ease-out"
                      style={{
                        transform: hitElementsTransforms.get(id) || 'none',
                      }}
                    >
                      {word}&nbsp;
                    </span>
                  );
                }
              )}
            </h3>
          </div>

          <a
            href="#"
            className="relative inline-flex items-center justify-center px-4 py-2 w-fit overflow-hidden font-medium tracking-tight text-black bg-white border-2 border-[#32cacd] rounded-full group mt-8 px-5 py-2 bg-blue-500 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-cyan-500 rounded-full group-hover:w-40 group-hover:h-40"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-20 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
            <span className="relative z-20 flex items-center gap-2 group-hover:text-white transition duration-300">
              Contact me
              <span
                key={getElementId('contact-icon', 0)}
                ref={(el) => {
                  if (elementRefs.current) { // Added null check
                    elementRefs.current[getElementId('contact-icon', 0)] = el;
                  }
                }}
                className="inline-block transition-transform duration-700 ease-out"
                style={{
                  transform: hitElementsTransforms.get(getElementId('contact-icon', 0)) || 'none',
                }}
              >
                <GoMoveToEndSVG />
              </span>
            </span>
          </a>

          <div className="flex gap-8 md:text-2xl text-2xl lg:text-3xl  z-30">
            {socialIcons.map((icon, index) => {
              const id = getElementId('social-icon', index);
              const IconComponent = icon.component;
              return (
                <a
                  key={id}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform duration-700 ease-out text-black hover:text-[#32cacd] transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                  ref={(el) => {
                    if (elementRefs.current) { // Added null check
                      elementRefs.current[id] = el;
                    }
                  }}
                  style={{
                    transform: hitElementsTransforms.get(id) || 'none',
                  }}
                >
                  <IconComponent style={{ width: '1em', height: '1em', verticalAlign: 'middle' }} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right image */}
        <div className="flex justify-center md:justify-end items-center md:items-start mt-8 md:mt-0">
          <img
            src="src/assets/avatar2.png"
            alt="avatar"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg"
          />
        </div>
      </div>
      {firePoints.map((point) => (
        <img
          key={point.id}
          src={`src/assets/fire.gif?id=${point.id}`} // 👈 trick: force reload
          alt="Explosion"
          className="pointer-events-none absolute w-32 h-32"
          style={{
            top: point.y - 64,
            left: point.x - 64,
            zIndex: 9999,
          }}
        />
      ))}


    </div>
  );
};

export default Header;