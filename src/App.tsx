/* eslint-disable */
import './App.css'
import Header from './component/header'
import About from './component/about'
import Skills from './component/skills'
import Achivement from './component/achivement'
import Certificate from './component/certificates'
import Contact from './component/contact'
function App() {

  return (
    <div>
      <Header />

      <main className="w-full px-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-52">
          <About />
          <Skills />
          <Achivement />
          <Certificate />
        </div>
      </main>

      <Contact />
    </div>
  

  )
}

export default App
