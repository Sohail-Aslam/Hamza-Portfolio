import React from 'react';
import { useBomb } from '../component/BombContext';
import AboutObjects from './AboutObjects';
const About = () => {
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

  // Provide default values or assert types if you're sure they will be defined.
  // This is the most common way to handle "possibly undefined" from contexts/props
  // when you know they will be present at runtime.
  const currentBombMode: boolean = bombMode ?? false; // Assuming bombMode is boolean
  const currentAdjustablePower: number = adjustablePower ?? 450; // Provide a sensible default
  const currentAdjustableRadius: number = adjustableRadius ?? 150; // Provide a sensible default
  const currentAdjustableRotation: number = adjustableRotation ?? 0; // Provide a sensible default


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

  const calculateHitElements = (e: React.MouseEvent) => {
    // Use the potentially defaulted/asserted value
    if (!currentBombMode) return;
    const clickX = e.clientX;
    const clickY = e.clientY;
    const newTransforms = new Map<string, string>();

    Object.entries(elementRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - clickX;
        const dy = cy - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Use the potentially defaulted/asserted values in calculations
        if (distance <= currentAdjustableRadius) {
          const forceMultiplier = (currentAdjustableRadius - distance) / currentAdjustableRadius;
          const normDx = distance === 0 ? 0 : dx / distance;
          const normDy = distance === 0 ? 0 : dy / distance;
          const pushTx = normDx * currentAdjustablePower * forceMultiplier;
          const pushTy = normDy * currentAdjustablePower * forceMultiplier;
          const randomRot = Math.random() * 2 - 1;
          const pushRot = randomRot * currentAdjustableRotation;

          const currentTransform = hitElementsTransforms.get(id) || 'translate(0px, 0px) rotate(0deg)';
          const { x: curX, y: curY, rot: curRot } = parseTransform(currentTransform);

          const finalTx = curX + pushTx;
          const finalTy = curY + pushTy;
          const finalRot = curRot + pushRot;

          newTransforms.set(id, `translate(${finalTx}px, ${finalTy}px) rotate(${finalRot}deg)`);
        }
      }
    });

    setBombPoint({ x: clickX, y: clickY });
    setHitElementsTransforms(prev => new Map([...prev, ...newTransforms]));
  };

  const getElementId = (prefix: string, index: number) => `${prefix}-${index}`;

  return (
    <div>
      <div
        id="about"
        className="text-center overflow-hidden flex align-center p-10 section-container min-h-screen select-none"
        onClick={calculateHitElements}
        style={{ userSelect: 'none' }}
      >
        <h1 className="text-3xl font-bold text-cyan-500 mb-6 w-full">
          About
        </h1>
        <div className="mb-12 max-w-xl text-center">
          {/* <h2 className="text-lg font-semibold mb-4">
            {"Hey, I'm Umair.".split(' ').map((word, i) => {
              const id = getElementId('about-heading', i);
              return (
                <span
                key={id}
                ref={(el) => {
                  if (elementRefs.current) {
                    elementRefs.current[id] = el;
                  }
                }}
                className="inline-block transition-transform duration-700 ease-out"
                style={{ transform: hitElementsTransforms.get(id) || 'none' }}
                >
                  {word}&nbsp;
                </span>
              );
            })}
          </h2> */}
          {/* <p className="text-base">
            {"In 2022, I embarked on a self-taught coding journey, and from the moment I wrote my first 'Hello world!', I knew I had found the perfect career path to leverage my skills. My passion for mathematics has been a driving force, honing my problem-solving abilities and leading me to excel in various math Olympics.".split(' ').map((word, i) => {
              const id = getElementId('about-paragraph', i);
              return (
                <span
                  key={id}
                  ref={(el) => {
                    if (elementRefs.current) {
                      elementRefs.current[id] = el;
                    }
                  }}
                  className="inline-block transition-transform duration-700 ease-out"
                  style={{ transform: hitElementsTransforms.get(id) || 'none' }}
                  >
                  {word}&nbsp;
                </span>
              );
            })}
          </p> */}
        </div>

            <AboutObjects/>
        {/* <div className="text-2xl text-center font-bold leading-relaxed max-w-xl md:text-3xl text-center">
          {"My international experience has honed my multilingual proficiency in English, Urdu, and Punjabi. Strong in teamwork, remote collaboration, and quick learning, with a self-motivated approach to problem-solving.".split(' ').map((word, i) => {
            const id = getElementId('about-footer', i);
            return (
              <span
                key={id}
                ref={(el) => {
                  if (elementRefs.current) {
                    elementRefs.current[id] = el;
                  }
                }}
                className="inline-block transition-transform duration-700 ease-out"
                style={{ transform: hitElementsTransforms.get(id) || 'none' }}
              >
                {word}&nbsp;
              </span>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default About;