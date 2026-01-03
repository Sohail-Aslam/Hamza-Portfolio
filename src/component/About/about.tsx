import AboutObjects from '../About/AboutObjects';
import { useBomb } from '../../Context/BombContext'
const about = () => {
  const {
    calculateHitElements,
  } = useBomb();


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