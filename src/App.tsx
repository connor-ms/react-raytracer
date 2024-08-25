import Canvas from './components/Canvas'
import Navbar from './components/Navbar'
import Settings from './components/Settings'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center gap-3 justify-center min-h-[calc(100vh-128px)]">
        <Canvas />
        <Settings />
      </div>
    </>
  )
}