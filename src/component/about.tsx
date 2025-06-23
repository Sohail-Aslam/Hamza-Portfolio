import AboutObjects from './AboutObjects'
import {useBomb} from './BombContext'
const about = () => {
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

  return (
    <div
      id="about"
      className="text-center overflow-x-hidden overflow-y-auto flex flex-col items-center justify-start p-10 section-container min-h-screen"
      onClick={calculateHitElements}
      style={{ userSelect: 'none' }}
    >
  
      <h1 className="text-3xl font-bold text-cyan-500 mb-6 w-full text-center">
About me      </h1>

      <div className="w-full flex-grow h-full flex justify-center items-center mt-30 ">
        <AboutObjects />
      </div>
    </div>
  )
}

export default about