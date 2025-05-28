/* eslint-disable */
import './App.css'
import Header from './component/header'
import About from './component/about'
// import Skills from './component/skills'
import Achivement from './component/achivement'
import Certificate from './component/certificates'
import Contact from './component/contact'
import { BombProvider } from './component/BombContext';
import BombControls from './component/BombControls';
import Menu from './component/Menu'
import ShapeLayer from './ShapeLayer'
function App() {

  return (
    <div>
      <BombProvider>
        <Menu />
        <ShapeLayer />
        <BombControls />
      </BombProvider>
    </div>
  )
}

export default App
