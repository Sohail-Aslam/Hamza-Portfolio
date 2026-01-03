import SkillsObjects from './SkillsObjects'
import { useBomb } from '../../Context/BombContext';
const skills = () => {
  const {
    calculateHitElements,
  } = useBomb();


  return (
    <div
      id="skills"
      className="text-center overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-10 section-container min-h-screen select-none"
      onClick={calculateHitElements}
      style={{ userSelect: 'none' }}
    >
      <h1 className="text-3xl font-bold text-cyan-500 mb-6 w-full text-center">
        Skills      </h1>

      <div className="w-full flex-grow h-full flex justify-center items-center mt-30 ">
        <SkillsObjects />
      </div>
    </div>
  )
}

export default skills