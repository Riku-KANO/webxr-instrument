import React, { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Box, Sphere } from '@react-three/drei'
import * as Tone from 'tone'

interface Position {
  x: number
  y: number
  z: number
}

function VRInstrument(): React.JSX.Element {
  const xrState = useXR()
  const isPresenting = xrState.session !== undefined && xrState.session !== null
  const [synth, setSynth] = useState<Tone.Synth | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [rightHandPos, setRightHandPos] = useState<Position>({
    x: 0,
    y: 1.5,
    z: -1,
  })

  useEffect(() => {
    const synthInstance = new Tone.Synth().toDestination()
    setSynth(synthInstance)

    return () => {
      synthInstance.dispose()
    }
  }, [])

  const togglePlay = async (): Promise<void> => {
    if (!isPlaying) {
      await Tone.start()
      setIsPlaying(true)
      if (synth) {
        synth.triggerAttack(200)
      }
    } else {
      if (synth) {
        synth.triggerRelease()
      }
      setIsPlaying(false)
    }
  }

  useFrame(state => {
    if (!isPresenting || !synth) return

    try {
      const rightController = state.gl.xr?.getController?.(1)
      if (rightController && rightController.position) {
        const pos = rightController.position
        setRightHandPos({ x: pos.x, y: pos.y, z: pos.z })

        if (isPlaying) {
          const freq = Math.max(100, Math.min(800, 200 + pos.y * 300))
          synth.frequency.value = freq
        }
      }
    } catch {
      // WebXR APIエラーを無視
    }
  })

  if (!isPresenting) {
    return (
      <group position={[0, 0, -2]}>
        <Box args={[2, 1, 0.1]} onClick={togglePlay}>
          <meshStandardMaterial color={isPlaying ? 'red' : 'green'} />
        </Box>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.8, 0.8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <Sphere
        args={[0.05]}
        position={[rightHandPos.x, rightHandPos.y, rightHandPos.z]}
      >
        <meshStandardMaterial
          color={isPlaying ? 'red' : 'green'}
          emissive={isPlaying ? 'red' : 'green'}
          emissiveIntensity={0.3}
        />
      </Sphere>

      <Box args={[0.3, 0.1, 0.1]} position={[0, 1.5, -1]} onClick={togglePlay}>
        <meshStandardMaterial color={isPlaying ? 'red' : 'blue'} />
      </Box>

      <group position={[0, 1, -0.5]}>
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            args={[0.08, 0.3, 0.08]}
            position={[(i - 3.5) * 0.12, 0, 0]}
          >
            <meshStandardMaterial
              color={
                isPlaying
                  ? `hsl(${(rightHandPos.y + 1) * 180}, 70%, 50%)`
                  : 'gray'
              }
            />
          </Box>
        ))}
      </group>
    </group>
  )
}

export default VRInstrument
