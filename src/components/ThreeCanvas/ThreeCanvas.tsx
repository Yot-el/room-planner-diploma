import { Canvas } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import Scene from '@/components/ThreeCanvas/Scene/Scene'

const ThreeCanvas: FC = () => {
  return <Canvas>
    <Scene />
  </Canvas>
}

export default observer(ThreeCanvas)