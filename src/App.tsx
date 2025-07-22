import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import VRInstrument from './components/VRInstrument'
import AdvancedVRInstrument from './components/AdvancedVRInstrument'
import Instructions from './components/Instructions'
import './App.css'

const store = createXRStore()

function App(): React.JSX.Element {
  const [useAdvancedMode, setUseAdvancedMode] = useState(true)

  return (
    <>
      <Instructions />
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-[1000]">
        <button
          onClick={() => setUseAdvancedMode(!useAdvancedMode)}
          className="px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          {useAdvancedMode ? 'Simple Mode' : 'Advanced Mode'}
        </button>
        <button
          onClick={() => store.enterVR()}
          className="px-6 py-3 bg-blue-500 text-white border-none rounded cursor-pointer text-base font-bold hover:bg-blue-600 transition-colors"
        >
          ENTER VR
        </button>
      </div>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {useAdvancedMode ? <AdvancedVRInstrument /> : <VRInstrument />}
        </XR>
      </Canvas>
    </>
  )
}

export default App
