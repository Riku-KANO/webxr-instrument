import React, { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR, useController } from '@react-three/xr'
import { Box, Sphere, Text } from '@react-three/drei'
import * as Tone from 'tone'
import * as THREE from 'three'

interface HandState {
  position: THREE.Vector3
  rotation: THREE.Euler
  grip: number
  trigger: number
}

interface SoundParameters {
  frequency: number
  volume: number
  filterFreq: number
  vibrato: number
  waveform: 'sine' | 'square' | 'triangle' | 'sawtooth'
}

function AdvancedVRInstrument(): React.JSX.Element {
  const xrState = useXR()
  const isPresenting = xrState.session !== undefined && xrState.session !== null

  const leftController = useController('left')
  const rightController = useController('right')

  const [synth, setSynth] = useState<Tone.Synth | null>(null)
  const [filter, setFilter] = useState<Tone.Filter | null>(null)
  const [vibrato, setVibrato] = useState<Tone.Vibrato | null>(null)
  const [volume, setVolume] = useState<Tone.Volume | null>(null)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [soundParams, setSoundParams] = useState<SoundParameters>({
    frequency: 440,
    volume: -12,
    filterFreq: 2000,
    vibrato: 0,
    waveform: 'sine',
  })

  const [leftHand, setLeftHand] = useState<HandState>({
    position: new THREE.Vector3(0, 1.5, -1),
    rotation: new THREE.Euler(0, 0, 0),
    grip: 0,
    trigger: 0,
  })

  const [rightHand, setRightHand] = useState<HandState>({
    position: new THREE.Vector3(0, 1.5, -1),
    rotation: new THREE.Euler(0, 0, 0),
    grip: 0,
    trigger: 0,
  })

  useEffect(() => {
    // Create audio chain: Synth -> Vibrato -> Filter -> Volume -> Destination
    const synthInstance = new Tone.Synth()
    const vibratoInstance = new Tone.Vibrato()
    const filterInstance = new Tone.Filter(2000, 'lowpass')
    const volumeInstance = new Tone.Volume(-12)

    synthInstance.chain(
      vibratoInstance,
      filterInstance,
      volumeInstance,
      Tone.Destination
    )

    setSynth(synthInstance)
    setVibrato(vibratoInstance)
    setFilter(filterInstance)
    setVolume(volumeInstance)

    return () => {
      synthInstance.dispose()
      vibratoInstance.dispose()
      filterInstance.dispose()
      volumeInstance.dispose()
    }
  }, [])

  const updateSoundFromGestures = () => {
    if (!synth || !filter || !vibrato || !volume) return

    // Right hand controls frequency based on Y position
    const freq = Math.max(100, Math.min(2000, 200 + rightHand.position.y * 800))

    // Right hand rotation controls waveform
    const rotationAngle = rightHand.rotation.z
    let waveform: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine'
    if (rotationAngle < -0.5) waveform = 'square'
    else if (rotationAngle > 0.5) waveform = 'triangle'
    else if (Math.abs(rotationAngle) > 1.5) waveform = 'sawtooth'

    // Left hand Y position controls volume
    const vol = Math.max(-48, Math.min(0, -48 + leftHand.position.y * 24))

    // Left hand rotation controls filter frequency
    const filterFreqValue = Math.max(
      100,
      Math.min(8000, 1000 + (leftHand.rotation.z + Math.PI) * 2000)
    )

    // Distance between hands controls vibrato
    const distance = leftHand.position.distanceTo(rightHand.position)
    const vibratoAmount = Math.max(0, Math.min(10, distance * 5))

    // Apply changes
    if (isPlaying) {
      synth.frequency.value = freq
      synth.oscillator.type = waveform
      volume.volume.value = vol
      filter.frequency.value = filterFreqValue
      vibrato.frequency.value = vibratoAmount
      vibrato.depth.value = vibratoAmount > 0 ? 0.2 : 0
    }

    setSoundParams({
      frequency: freq,
      volume: vol,
      filterFreq: filterFreqValue,
      vibrato: vibratoAmount,
      waveform: waveform,
    })
  }

  useFrame(() => {
    if (!isPresenting) return

    // Update left hand state
    if (leftController) {
      const leftGamepad = leftController.inputSource?.gamepad
      setLeftHand({
        position: leftController.controller.position.clone(),
        rotation: leftController.controller.rotation.clone(),
        grip: leftGamepad?.buttons[1]?.value || 0,
        trigger: leftGamepad?.buttons[0]?.value || 0,
      })
    }

    // Update right hand state
    if (rightController) {
      const rightGamepad = rightController.inputSource?.gamepad
      setRightHand({
        position: rightController.controller.position.clone(),
        rotation: rightController.controller.rotation.clone(),
        grip: rightGamepad?.buttons[1]?.value || 0,
        trigger: rightGamepad?.buttons[0]?.value || 0,
      })

      // Use right trigger to control play/stop
      if (rightGamepad?.buttons[0]?.pressed && !isPlaying) {
        startPlaying()
      } else if (!rightGamepad?.buttons[0]?.pressed && isPlaying) {
        stopPlaying()
      }
    }

    updateSoundFromGestures()
  })

  const startPlaying = async () => {
    if (!synth || isPlaying) return
    await Tone.start()
    synth.triggerAttack(soundParams.frequency)
    setIsPlaying(true)
  }

  const stopPlaying = () => {
    if (!synth || !isPlaying) return
    synth.triggerRelease()
    setIsPlaying(false)
  }

  if (!isPresenting) {
    return (
      <group position={[0, 0, -2]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Advanced VR Instrument
        </Text>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="gray"
          anchorX="center"
          anchorY="middle"
        >
          Enter VR to use advanced hand gestures
        </Text>
      </group>
    )
  }

  return (
    <group>
      {/* Left hand visualization */}
      <Sphere
        args={[0.05]}
        position={[
          leftHand.position.x,
          leftHand.position.y,
          leftHand.position.z,
        ]}
      >
        <meshStandardMaterial
          color="blue"
          emissive="blue"
          emissiveIntensity={leftHand.grip}
        />
      </Sphere>

      {/* Right hand visualization */}
      <Sphere
        args={[0.05]}
        position={[
          rightHand.position.x,
          rightHand.position.y,
          rightHand.position.z,
        ]}
      >
        <meshStandardMaterial
          color={isPlaying ? 'red' : 'green'}
          emissive={isPlaying ? 'red' : 'green'}
          emissiveIntensity={rightHand.trigger}
        />
      </Sphere>

      {/* Sound parameter visualization */}
      <group position={[0, 2.5, -2]}>
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
        >
          {`Frequency: ${soundParams.frequency.toFixed(0)}Hz | Volume: ${soundParams.volume.toFixed(0)}dB`}
        </Text>
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
        >
          {`Filter: ${soundParams.filterFreq.toFixed(0)}Hz | Vibrato: ${soundParams.vibrato.toFixed(1)}`}
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
        >
          {`Waveform: ${soundParams.waveform}`}
        </Text>
      </group>

      {/* Visual feedback for hand distance */}
      <Box
        args={[0.02, 0.02, leftHand.position.distanceTo(rightHand.position)]}
        position={[
          (leftHand.position.x + rightHand.position.x) / 2,
          (leftHand.position.y + rightHand.position.y) / 2,
          (leftHand.position.z + rightHand.position.z) / 2,
        ]}
      >
        <meshStandardMaterial
          color={`hsl(${soundParams.vibrato * 36}, 70%, 50%)`}
          opacity={0.5}
          transparent
        />
      </Box>
    </group>
  )
}

export default AdvancedVRInstrument
