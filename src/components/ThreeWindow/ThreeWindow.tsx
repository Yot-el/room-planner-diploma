import { FC } from 'react'
import { Window } from '@/models/three'
import { ThreeEvent } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'

const ThreeWindow: FC<Props> = ({ object, onClick, onContextMenu }) => {
  return <primitive object={object} onClick={onClick} onContextMenu={onContextMenu} />
}

interface Props {
  onClick: (event: ThreeEvent<MouseEvent>) => void
  onContextMenu: (event: ThreeEvent<MouseEvent>) => void
  object: Window
}

export default observer(ThreeWindow)
