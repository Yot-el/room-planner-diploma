import SceneGround from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { CanvasEditMode } from '@/models/canvas'
import { DEFAULT_COLOR } from '@/stores/canvas/canvasStore'
import { useStores } from '@/utils/hooks/useStores'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'
import { Color, DirectionalLight } from 'three'

const Scene: FC = () => {
  const {
    canvasStore: {
      lightColor, lightIntensity, directionalLightPosition, directionalLightTarget, fogColor, currentMode
    }
  } = useStores()

  const { scene } = useThree()
  const lightRef = useRef<DirectionalLight | null>(null)

  useEffect(() => {
    scene.background = new Color(DEFAULT_COLOR)
  }, [])

  return <>
    <ambientLight color={lightColor} intensity={lightIntensity} />
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={0x049ef4} />
    </mesh>
    <SceneGround />
    <directionalLight color={lightColor} position={directionalLightPosition} target={directionalLightTarget} intensity={lightIntensity} ref={lightRef}/>
    {
      lightRef.current &&
      <directionalLightHelper args={[lightRef.current, 1]} />
    }
    <OrbitControls makeDefault enabled={currentMode === CanvasEditMode.Camera} />
    <fog attach="fog" color={fogColor} near={0.0025} far={250} />
  </>
}

export default observer(Scene)