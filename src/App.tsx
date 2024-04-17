import { useRef, useEffect, useState } from 'react'
import Loader from './components/page/loader'
import Canvas from './components/canvas'
import './App.css'
import GameMenu from './components/page/menu'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LevelMenu } from './components/page/menuLevel'
type Size = {
  height: number
  width: number
}
const App = () => {
  const [size, setSize] = useState<Size | null>(null)
  const container = useRef<any>()
  useEffect(() => {
    setTimeout(() => {
      setSize({
        height: container.current.clientHeight - 5,
        width: container.current.clientWidth - 5,
      })
    }, 100)
  })
  return (
    <div className="App" ref={container}>
      <Router>
        <Routes>
          <Route path="/level" element={<LevelMenu size={size} />} />
          <Route path="/" element={<GameMenu size={size} />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
