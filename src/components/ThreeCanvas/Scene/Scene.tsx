import SceneGround from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { CanvasEditMode } from '@/models/canvas'
import { ObjectType } from '@/models/three'
import { DEFAULT_COLOR } from '@/stores/canvas/canvasStore'
import { useStores } from '@/utils/hooks/useStores'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { ThreeEvent, useLoader, useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'
import { Color, DirectionalLight, Object3D } from 'three'

const Scene: FC = () => {
  const {
    canvasStore: {
      lightColor, lightIntensity, directionalLightPosition, directionalLightTarget, fogColor, currentMode, selectedObject, setSelectedObject, sceneObjects, setSceneObject
    }
  } = useStores()

  const { scene } = useThree()
  const lightRef = useRef<DirectionalLight | null>(null)

  const isOrbitControlsEnabled = currentMode === CanvasEditMode.Camera
  const isTransformControlsEnabled = currentMode === CanvasEditMode.Selection
  const isTransformControlsAxisEnabled = isTransformControlsEnabled && !!selectedObject

  const onObjectClick = (id: string, event: ThreeEvent<MouseEvent>) => {
    if (isTransformControlsEnabled) {
      setSelectedObject(id)
    }
  }

  useEffect(() => {
    scene.background = new Color(DEFAULT_COLOR)
  }, [])

  return <>
    <ambientLight color={lightColor} intensity={lightIntensity} />
    {
      Object.entries(sceneObjects).map(([id, item]) => (
        <primitive key={id} object={item.object} onClick={(event: ThreeEvent<MouseEvent>) => onObjectClick(id, event)} />
      ))
    }
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
    <OrbitControls enabled={isOrbitControlsEnabled} maxPolarAngle={Math.PI / 2 - 0.01} />
    <TransformControls object={selectedObject} enabled={isTransformControlsEnabled} showX={isTransformControlsAxisEnabled} showY={false} showZ={isTransformControlsAxisEnabled} mode="translate" />
    <fog attach="fog" color={fogColor} near={0.0025} far={250} />
  </>
}

export default observer(Scene)