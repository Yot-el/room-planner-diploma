import SceneGround from '@/components/ThreeCanvas/SceneGround/SceneGround'
import ThreeTooltip from '@/components/ThreeCanvas/ThreeTooltip/ThreeTooltip'
import { WINDOW_HEIGHT, WINDOW_LENGTH } from '@/components/ThreeCanvas/ThreeTooltip/tooltips/ContextMenuTooltip'
import ThreeWall from '@/components/ThreeCanvas/ThreeWall/ThreeWall'
import { CanvasEditMode } from '@/models/canvas'
import { ObjectType, Wall } from '@/models/three'
import { TooltipType } from '@/models/tooltip'
import { DEFAULT_COLOR } from '@/stores/canvas/canvasStore'
import { quaternionToDegree } from '@/utils/helpers/helpers'
import { useStores } from '@/utils/hooks/useStores'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { ThreeEvent, useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'
import { Color, DirectionalLight, Vector3 } from 'three'

const getTransformControlsMode = (mode: CanvasEditMode) => {
  if (mode === CanvasEditMode.Translate) return 'translate'
  if (mode === CanvasEditMode.Rotate) return 'rotate'

  return 'translate'
}

const Scene: FC = () => {
  const {
    canvasStore: {
      lightColor, lightIntensity, directionalLightPosition, directionalLightTarget, fogColor, currentMode, selectedObject, setSelectedObject, sceneObjects, setTooltip, walls, models
    }
  } = useStores()

  const { scene } = useThree()
  const lightRef = useRef<DirectionalLight | null>(null)

  const isOrbitControlsEnabled = currentMode === CanvasEditMode.Camera
  const isTransformControlsEnabled = [CanvasEditMode.Rotate, CanvasEditMode.Translate].includes(currentMode)
  const isTransformControlsAxisEnabled = isTransformControlsEnabled && !!selectedObject

  const onObjectClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (isTransformControlsEnabled) {
      const objectId = event.eventObject.uuid
      const nearestObjectClicked = event.intersections[0].object

      // Выбираем ближайший объект, если он есть в списке всех модифицируемых объектов
      // Иначе выбираем тот объект, на который повешен обработчик (либо модель, либо стена)
      if (sceneObjects[nearestObjectClicked.uuid]) {
        setSelectedObject(nearestObjectClicked.uuid)
        return
      }

      setSelectedObject(objectId)
    }
  }

  const onRightButtonClick = (event: ThreeEvent<MouseEvent>) => {
    if (currentMode !== CanvasEditMode.Camera) return
    const nearestObjectClicked = event.intersections[0].object

    const objectForContextMenu = sceneObjects[nearestObjectClicked.uuid] ? nearestObjectClicked : event.eventObject

    setTooltip({
      type: TooltipType.CONTEXT_MENU,
      data: {
        objectId: objectForContextMenu.uuid
      },
      position: event.point
    })
  }

  const onSelectedObjectChange = () => {
    if (!selectedObject) return

    if (currentMode === CanvasEditMode.Translate) {
      if (selectedObject.type === ObjectType.WINDOW) {
        const wall = selectedObject.object.parent as Wall
        const maxPosition = new Vector3(0, wall.geometry.parameters.height / 2 - WINDOW_HEIGHT / 2, wall.geometry.parameters.depth - WINDOW_LENGTH)

        selectedObject.object.position.clamp(new Vector3(0, -WINDOW_HEIGHT / 2, 0), maxPosition)
      }
    }

    if (currentMode === CanvasEditMode.Rotate) {
      const degrees = quaternionToDegree(selectedObject.object.quaternion)
      setTooltip({
        type: TooltipType.ROTATE,
        data: {
          rotationDegree: degrees.y
        },
        position: selectedObject.object.position
      })
    }
  }

  useEffect(() => {
    scene.background = new Color(DEFAULT_COLOR)
  }, [])

  return <>
    <ambientLight color={lightColor} intensity={lightIntensity} />
    {
      Object.entries(models).map(([id, item]) => (
        <primitive
          key={id}
          object={item}
          onClick={(event: ThreeEvent<MouseEvent>) => onObjectClick(event)}
          onContextMenu={(event: ThreeEvent<MouseEvent>) => onRightButtonClick(event)}
        />
      ))
    }
    {
      Object.entries(walls).map(([id, item]) => (
        <ThreeWall
          key={id}
          object={item}
          onClick={(event: ThreeEvent<MouseEvent>) => onObjectClick(event)}
          onContextMenu={(event: ThreeEvent<MouseEvent>) => onRightButtonClick(event)}
        />
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
    <TransformControls
      object={selectedObject?.object}
      enabled={isTransformControlsEnabled}
      showX={isTransformControlsAxisEnabled && currentMode === CanvasEditMode.Translate && selectedObject.type !== ObjectType.WINDOW}
      showY={isTransformControlsAxisEnabled &&
        ((currentMode === CanvasEditMode.Rotate && selectedObject.type !== ObjectType.WINDOW) ||
        (currentMode === CanvasEditMode.Translate && selectedObject.type === ObjectType.WINDOW))}
      showZ={isTransformControlsAxisEnabled && currentMode === CanvasEditMode.Translate}
      mode={getTransformControlsMode(currentMode)}
      onObjectChange={onSelectedObjectChange}
      onMouseUp={() => setTooltip(null)}
      space={selectedObject?.type === ObjectType.WINDOW ? 'local' : 'world'}
    />
    <ThreeTooltip />
    <fog attach="fog" color={fogColor} near={0.0025} far={250} />
  </>
}

export default observer(Scene)