import { Wall, Window } from '@/models/three'
import { ThreeEvent, useGraph, useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'
import { BoxGeometry } from 'three'

const ThreeWall: FC<Props> = ({ object, onClick, onContextMenu }) => {
  const geometryRef = useRef<BoxGeometry | null>(null)
  const { geometry } = object

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.translate(0, geometry.parameters.height / 2, geometry.parameters.depth / 2)
    }
  }, [])

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