import { CanvasEditMode } from '@/models/canvas'
import { ObjectType } from '@/models/three'
import { TooltipType } from '@/models/tooltip'
import { useStores } from '@/utils/hooks/useStores'
import { ThreeEvent } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useRef, useState } from 'react'
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three'

const SCENE_SIZE = 1000
const GRID_SIZE = SCENE_SIZE / 10
export const WALL_WIDTH = 0.5
const WALL_HEIGHT = 3

const DEFAULT_TENTATIVE_WALL = {
  startPoint: new Vector3(0, 0, 0),
  endPoint: new Vector3(0, 0, 0)
}

const SceneGround: FC = () => {
  const {
    canvasStore: {
      groundColor,
      currentMode,
      setSceneObject,
      setTooltip
    }
  } = useStores()

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (currentMode === CanvasEditMode.BuildWall && tentativeWall === DEFAULT_TENTATIVE_WALL) {
      startDrawTentativeWall(event)
    } else clearTentativeWall()
  }

  const startDrawTentativeWall = (event: ThreeEvent<MouseEvent>) => {
    const startPointPosition = new Vector3(event.point.x, 0, event.point.z)
    setTentativeWall({
      startPoint: startPointPosition,
      endPoint: startPointPosition
    })
  }

  const moveTentativeWall = (event: ThreeEvent<MouseEvent>) => {
    if (currentMode === CanvasEditMode.BuildWall && tentativeWall !== DEFAULT_TENTATIVE_WALL) {
      if (meshTentativeWallRef.current) {
        const wallEndPoint = new Vector3(event.point.x, 0, event.point.z)
        setTentativeWall({...tentativeWall,
          endPoint: wallEndPoint})
        meshTentativeWallRef.current?.lookAt(wallEndPoint)

        const isWallSmall = !(tentativeWall.startPoint.distanceTo(tentativeWall.endPoint) > 0.01)
        const tentativeWallSize = !isWallSmall ? new Vector3(WALL_WIDTH, WALL_HEIGHT, tentativeWall.startPoint.distanceTo(tentativeWall.endPoint)) : new Vector3(0, 0, 0)
        const geometry = new BoxGeometry(...tentativeWallSize.toArray())
        geometry.translate(0, tentativeWallSize.y / 2, tentativeWallSize.z / 2)
        meshTentativeWallRef.current.geometry = geometry

        if (!isWallSmall) {
          setTooltip({
            type: TooltipType.WALL,
            data: {
              width: tentativeWallSize.x,
              height: tentativeWallSize.y,
              length: tentativeWallSize.z
            },
            position: wallEndPoint
          })
        }
      }
    }
  }

  const clearTentativeWall = () => {
    if (currentMode === CanvasEditMode.BuildWall) {
      if (meshTentativeWallRef.current) {
        const wallPosition = meshTentativeWallRef.current?.getWorldPosition(new Vector3())
        const wallClone = meshTentativeWallRef.current.clone(true)
        wallClone.position.set(...wallPosition.toArray())
        wallClone.material = wallClone.material.clone()

        const isWallSmall = tentativeWall.startPoint.distanceTo(tentativeWall.endPoint) <= 0.01
        if (!isWallSmall) setSceneObject(wallClone.uuid, wallClone, ObjectType.WALL)

        meshTentativeWallRef.current.geometry = new BoxGeometry(0, 0, 0)
      }
      setTooltip(null)
      setTentativeWall(DEFAULT_TENTATIVE_WALL)
    }
  }

  const [tentativeWall, setTentativeWall] = useState(DEFAULT_TENTATIVE_WALL)
  const meshTentativeWallRef = useRef<Mesh<BoxGeometry, MeshStandardMaterial> | null>(null)

  return <>
    <mesh
      position={[0, 0, 0]}
      rotation={[Math.PI / -2, 0, 0]}
      receiveShadow={true}
      onClick={handleClick}
      onPointerMove={moveTentativeWall}
    >
      <planeGeometry args={[SCENE_SIZE, SCENE_SIZE]} />
      <meshLambertMaterial color={groundColor} />
    </mesh>
    <mesh ref={meshTentativeWallRef} position={tentativeWall.startPoint}>
      <meshStandardMaterial />
    </mesh>
    <gridHelper visible={true} args={[GRID_SIZE, GRID_SIZE]} />
  </>
}

export default observer(SceneGround)