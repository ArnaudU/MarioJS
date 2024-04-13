import { useRef, useEffect, useState } from 'react'
import Loader from './components/page/loader'
import Canvas from './components/canvas'
import './App.css'
import GameMenu from './components/page/menu'

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
      <GameMenu size={size} />
    </div>
  )
}

export default App
