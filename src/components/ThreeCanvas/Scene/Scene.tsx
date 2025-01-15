import SceneGround from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { CanvasEditMode } from '@/models/canvas'
import { DEFAULT_COLOR } from '@/stores/canvas/canvasStore'
import { useStores } from '@/utils/hooks/useStores'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { ThreeEvent, useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'
import { Color, DirectionalLight } from 'three'

const Scene: FC = () => {
  const {
    canvasStore: {
      lightColor, lightIntensity, directionalLightPosition, directionalLightTarget, fogColor, currentMode, selectedObject, setSelectedObject
    }
  } = useStores()

  const { scene } = useThree()
  const lightRef = useRef<DirectionalLight | null>(null)

  const isOrbitControlsEnabled = currentMode === CanvasEditMode.Camera
  const isTransformControlsEnabled = currentMode === CanvasEditMode.Selection
  const isTransformControlsAxisEnabled = isTransformControlsEnabled && !!selectedObject

  const onObjectClick = (event: ThreeEvent<MouseEvent>) => {
    if (isTransformControlsEnabled) {
      setSelectedObject(event.object)
    }
  }

  useEffect(() => {
    scene.background = new Color(DEFAULT_COLOR)
  }, [])

  return <>
    <ambientLight color={lightColor} intensity={lightIntensity} />
    <mesh onClick={onObjectClick}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={0x049ef4} />
    </mesh>
    <SceneGround />
    <directionalLight
      color={lightColor}
      position={directionalLightPosition}
      target={directionalLightTarget}
      intensity={lightIntensity}
      ref={lightRef}
    />
    {
      lightRef.current &&
      <directionalLightHelper args={[lightRef.current, 1]} />
    }
    <OrbitControls enabled={isOrbitControlsEnabled} />
    <TransformControls object={selectedObject} enabled={isTransformControlsEnabled} showX={isTransformControlsAxisEnabled} showY={isTransformControlsAxisEnabled} showZ={isTransformControlsAxisEnabled} mode="translate" />
    <fog attach="fog" color={fogColor} near={0.0025} far={250} />
  </>
}

export default observer(Scene)