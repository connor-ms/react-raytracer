import Canvas from './components/Canvas'
import Navbar from './components/Navbar'
import Settings from './components/Settings'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <Canvas />
        </div>
        <div className="w-50">
          <Settings />
        </div>
      </div>
    </>
  )
}