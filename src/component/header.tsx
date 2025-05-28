import React, { useCallback } from 'react';
import { FaGithub, FaTwitter, FaCodepen } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { GoMoveToEnd } from "react-icons/go";
import { useBomb } from '../component/BombContext'; 
import { Howl } from 'howler';
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
const boomSound = new Howl({
  src: ['/sounds/boom.mp3'],
  volume: 0.8,         // from 0.0 to 1.0
  rate: 1.0,           // playback speed
});
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
    if (!bombMode) return;
    boomSound.play();
    const clickX = e.clientX;
    const clickY = e.clientY;
    const newTransforms = new Map<string, string>();

    Object.entries(elementRefs.current).forEach(([id, el]) => {
      if (el && isElementInViewport(el)) {
        boomSound.play();
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
          boomSound.play();
        }
      }
    });
    boomSound.play();
    setBombPoint({ x: clickX, y: clickY });
    setHitElementsTransforms(prev => new Map([...prev, ...newTransforms]));
  };
  

  // const reset = () => {
  //   setBombPoint(null);
  //   setBombMode(false);
  //   setHitElementsTransforms(new Map());
  // };

  return (
    <div id="home"
      className=" text-white  select-none font-inter overflow-hidden px-10 min-h-screen flex flex-col justify-center items-center text-center z-5"
      onClick={calculateHitElements}
    >
      {/* Controls Bar */}

      <div className="flex flex-col-reverse md:flex-row w-full">
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-16 text-white">
          <div className="flex flex-col gap-8">
            <h1
              className="mt-6 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-tight text-5xl font-extrabold text-blue-600 mb-6 leading-tight"
              style={{ color: '#32cacd' }}
              >
              {"Hello, World!  I am Umair Hamza.".split(' ').map((word, index) => {
                const id = getElementId('heading', index);
                return (
                  <span
                  key={id}
                  ref={(el) => {
                    elementRefs.current[id] = el;
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

            <h3 className="text-lg sm:text-xl text-xl text-black max-w-3xl">
              {"I'm an optimist 🤓 who enjoys spreading positivity 🤪 wherever I go.".split(' ').map(
                (word, index) => {
                  const id = getElementId('subheading', index);
                  return (
                    <span
                    key={id}
                    ref={(el) => {
                      elementRefs.current[id] = el;
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
            className="relative inline-flex items-center justify-center px-4 py-2 w-fit overflow-hidden font-medium tracking-tight text-black bg-white border-2 border-[#32cacd] rounded-full group  mt-8 px-5 py-2 bg-blue-500 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-cyan-500 rounded-full group-hover:w-40 group-hover:h-40"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-20 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition duration-300">
              Contact me
              <span
                key={getElementId('contact-icon', 0)}
                ref={(el) => {
                  elementRefs.current[getElementId('contact-icon', 0)] = el;
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

          <div className="flex gap-8 md:text-2xl lg:text-3xl">
            {socialIcons.map((icon, index) => {
              const id = getElementId('social-icon', index);
              const IconComponent = icon.component;
              return (
                <a
                  key={id}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform duration-700 ease-out  text-black hover:text-[#32cacd] transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                  ref={(el) => {
                    elementRefs.current[id] = el;
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
            src="src/assets/avatar.png"
            alt="avatar"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg"
          />
        </div>
      </div>


      {/* Optional Debug: bomb radius visualization */}
      {/* {bombPoint && (
        <div
          className="absolute border-2 border-red-500 rounded-full pointer-events-none opacity-75"
          style={{
            left: bombPoint.x - adjustableRadius,
            top: bombPoint.y - adjustableRadius,
            width: adjustableRadius * 2,
            height: adjustableRadius * 2,
            position: 'fixed',
            transform: 'scale(0)',
            animation: 'expandBomb 0.5s forwards',
          }}
        />
      )} */}

      {/* CSS for bomb animation */}

    </div>
  );
};

export default Header;
