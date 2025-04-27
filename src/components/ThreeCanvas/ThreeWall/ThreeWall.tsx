import { Wall } from '@/models/three'
import { ThreeEvent } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

const ThreeWall: FC<Props> = ({ object, onClick, onContextMenu }) => {
  return <primitive
    object={object}
    onClick={onClick}
    onContextMenu={onContextMenu} />
}

interface Props {
  onClick: (event: ThreeEvent<MouseEvent>) => void
  onContextMenu: (event: ThreeEvent<MouseEvent>) => void
  object: Wall
}

export default observer(ThreeWall)