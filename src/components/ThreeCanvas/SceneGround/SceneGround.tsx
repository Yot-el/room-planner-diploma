import { useStores } from '@/utils/hooks/useStores'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

const SCENE_SIZE = 1000
const GRID_SIZE = SCENE_SIZE / 10

const SceneGround: FC = () => {
  const {
    canvasStore: {
      groundColor
    }
  } = useStores()

  return <>
    <mesh position={[0, 0, 0]} rotation={[Math.PI / -2, 0, 0]} receiveShadow={true}>
      <planeGeometry args={[SCENE_SIZE, SCENE_SIZE]}/>
      <meshLambertMaterial color={groundColor} />
    </mesh>
    <gridHelper visible={true} args={[GRID_SIZE, GRID_SIZE]} />
  </>
}

export default observer(SceneGround)