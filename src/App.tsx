import Canvas from './components/Canvas'
import Navbar from './components/Navbar'
import RenderManager from './util/render-manager';
import Settings from './components/Settings'

export default function App() {
  const manager = new RenderManager(12);
  // const [renderCount, setRenderCount] = useState(0);a

  // const handleRender = () => {
  //   setRenderCount(renderCount + 1);
  // }

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center gap-3 justify-center min-h-[calc(100vh-128px)]">
        <Canvas renderManager={manager} />
        <Settings renderManager={manager} />
      </div>
    </>
  )
}
