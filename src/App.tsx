/* eslint-disable */
import './App.css'
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
