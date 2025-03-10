import { CanvasEditMode } from '@/models/canvas'
import { ObjectType } from '@/models/three'
import { useStores } from '@/utils/hooks/useStores'
import { ThreeEvent } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useRef, useState } from 'react'
import { BoxGeometry, Euler, Mesh, Vector3 } from 'three'

const SCENE_SIZE = 1000
const GRID_SIZE = SCENE_SIZE / 10

const DEFAULT_TENTATIVE_WALL = {
  startPoint: new Vector3(0, 0, 0),
  endPoint: new Vector3(0, 0, 0)
}

const SceneGround: FC = () => {
  const {
    canvasStore: {
      groundColor,
      currentMode,
      setSceneObject
    }
  } = useStores()

  const startDrawTentativeWall = (event: ThreeEvent<MouseEvent>) => {
    if (currentMode === CanvasEditMode.BuildWall) {
      const startPointPosition = new Vector3(event.point.x, 0, event.point.z)
      setTentativeWall({
        startPoint: startPointPosition,
        endPoint: startPointPosition
      })
    }
  }

  const moveTentativeWall = (event: ThreeEvent<MouseEvent>) => {
    if (currentMode === CanvasEditMode.BuildWall && tentativeWall !== DEFAULT_TENTATIVE_WALL) {
      if (meshTentativeWallRef.current) {
        const wallEndPoint = new Vector3(event.point.x, 0, event.point.z)
        setTentativeWall({...tentativeWall,
          endPoint: wallEndPoint})
        meshTentativeWallRef.current?.lookAt(wallEndPoint)

        const tentativeWallSize = tentativeWall.startPoint.distanceTo(tentativeWall.endPoint) > 0.01 ? new Vector3(0.5, 3, tentativeWall.startPoint.distanceTo(tentativeWall.endPoint)) : new Vector3(0, 0, 0)
        const geometry = new BoxGeometry(...tentativeWallSize.toArray())
        geometry.translate(0, tentativeWallSize.y / 2, tentativeWallSize.z / 2)
        meshTentativeWallRef.current.geometry = geometry
      }
    }
  }

  const clearTentativeWall = () => {
    if (currentMode === CanvasEditMode.BuildWall) {
      if (meshTentativeWallRef.current) {
        const wallPosition = meshTentativeWallRef.current?.getWorldPosition(new Vector3())
        const wallClone = meshTentativeWallRef.current.clone(true)
        wallClone.position.set(...wallPosition.toArray())

        if (tentativeWall.startPoint.distanceTo(tentativeWall.endPoint) > 0.01) setSceneObject(wallClone.uuid, wallClone, ObjectType.WALL)

        meshTentativeWallRef.current.geometry = new BoxGeometry(0, 0, 0)
      }
      setTentativeWall(DEFAULT_TENTATIVE_WALL)
    }
  }

  const [tentativeWall, setTentativeWall] = useState(DEFAULT_TENTATIVE_WALL)
  const meshTentativeWallRef = useRef<Mesh | null>(null)

  return <>
    <mesh
      position={[0, 0, 0]}
      rotation={[Math.PI / -2, 0, 0]}
      receiveShadow={true}
      onPointerDown={startDrawTentativeWall}
      onPointerMove={moveTentativeWall}
      onPointerUp={clearTentativeWall}
    >
      <planeGeometry args={[SCENE_SIZE, SCENE_SIZE]} />
      <meshLambertMaterial color={groundColor} />
    </mesh>
    <mesh ref={meshTentativeWallRef} position={tentativeWall.startPoint}>
      <meshPhongMaterial shininess={0}/>
    </mesh>
    <gridHelper visible={true} args={[GRID_SIZE, GRID_SIZE]} />
  </>
}

export default observer(SceneGround)