import './App.css'
import { useState } from 'react'
import SlotMachine from './SlotMachine'

function App() {
  const [theme, setTheme] = useState("default-theme");

  const toggleTheme = () => {
    setTheme(theme === "default-theme" ? "casino-theme" : "default-theme");
  };

  return (
    <div className={theme}>
      <SlotMachine theme={`${theme}`} toggleTheme={toggleTheme}/>
    </div>
  )
}

export default App