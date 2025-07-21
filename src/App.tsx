import React from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import VRInstrument from './components/VRInstrument'
import Instructions from './components/Instructions'
import './App.css'

const store = createXRStore()

function App(): React.JSX.Element {
  return (
    <>
      <Instructions />
      <button 
        onClick={() => store.enterVR()}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        ENTER VR
      </button>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <VRInstrument />
        </XR>
      </Canvas>
    </>
  )
}

export default App
