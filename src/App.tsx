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
function App() {

  return (
    <div>
      <BombProvider>
        <Menu />
        <BombControls />
        {/* <div className="relative">
          <section id="header">
            <Header />
          </section>
          <section id="about">
            <About />
          </section>
          <section id="achivement">
            <Achivement />
          </section>
          <section id="certificates">
            <Certificate />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </div> */}
      </BombProvider>
    </div>
  )
}

export default App
