import { useState } from 'react';
import Canvas from './components/Canvas'
import Navbar from './components/Navbar'
import Settings from './components/Settings'
import { Renderer } from './util/render';

export default function App() {
  const [renderer] = useState(() => new Renderer());
  const [renderCount, setRenderCount] = useState(0);

  const handleRender = (ctx: CanvasRenderingContext2D) => {
    renderer.buildFrame(ctx);

    setRenderCount(renderCount + 1);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center gap-3 justify-center min-h-[calc(100vh-128px)]">
        <Canvas renderer={renderer} onRender={handleRender} />
        <Settings renderer={renderer} renderCount={renderCount} />
      </div>
    </>
  )
}
