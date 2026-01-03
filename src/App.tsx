/* eslint-disable */
import './App.css'
import { BombProvider } from './Context/BombContext';
import Menu from './component/Menu'
import ShapeLayer from './ShapeLayer'
import { ThemeProvider } from './Context/ThemeContext';
import { RopeProvider } from './component/RopeState';

function App() {

  return (
    <div>
      <BombProvider>
        <RopeProvider>

        <ThemeProvider>
        <Menu />        
        <ShapeLayer />
        </ThemeProvider>
          </RopeProvider>

      </BombProvider>
    </div>
  )
}

export default App
