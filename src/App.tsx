//import { useRef, useState } from 'react';
import Canvas from './components/Canvas'
import Navbar from './components/Navbar'
//import Settings from './components/Settings'

export default function App() {
  // const [renderCount, setRenderCount] = useState(0);
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // const handleRender = () => {
  //   setRenderCount(renderCount + 1);
  // }

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center gap-3 justify-center min-h-[calc(100vh-128px)]">
        <Canvas />
        {/* <Settings renderer={renderer} renderCount={renderCount} /> */}
      </div>
    </>
  )
}
