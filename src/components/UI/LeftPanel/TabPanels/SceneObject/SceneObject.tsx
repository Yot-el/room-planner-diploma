import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import TexturePicker from '@/components/UI/TexturePicker/TexturePicker'
import { isObjectDoor, isObjectWall, isObjectWindow, ModelType, ObjectType, Wall } from '@/models/three'
import { getDoorShortName, getModelShortName, getWallShortName, getWindowShortName, quaternionToDegree } from '@/utils/helpers/helpers'
import { loadTexture } from '@/utils/helpers/loadTexture'
import { clampWallChildPosition, getBufferGeometrySize } from '@/utils/helpers/three'
import { useStores } from '@/utils/hooks/useStores'
import { Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MuiColorInput } from 'mui-color-input'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { MathUtils, RepeatWrapping, Vector3 } from 'three'

const SceneObject = () => {
  const {
    canvasStore: {
      sceneObjects,
      setWallColor,
      wallColor,
      setSceneObject,
      setSelectedObject
    }
  } = useStores()
  const params = useParams()
  const navigate = useNavigate()
  const sceneObject = sceneObjects[params.objectId ?? '']
  const [coordinates, setCoordinates] = useState<{ x: string | number, y: string | number, z: string | number }>(sceneObject?.object?.position ?? {x: 0,
    y: 0,
    z: 0})

  useEffect(() => {
    if (!sceneObject) {
      navigate('/catalogue')
      return
    }

    setSelectedObject(params.objectId)
  }, [sceneObject])

  const getObjectName = (id: string) => {
    const objectType = sceneObjects[id]?.type

    switch (objectType) {
    case ObjectType.WALL:
      return getWallShortName(id)
    case ObjectType.MODEL:
      return getModelShortName(id, sceneObject.object.userData.name as string)
    case ObjectType.WINDOW:
      return getWindowShortName(id)
    case ObjectType.DOOR:
      return getDoorShortName(id)
    default:
      return ''
    }
  }

  const changeColor = (value: string) => {
    if (isObjectWall(sceneObject.type, sceneObject.object)) {
      setWallColor(sceneObject.object.uuid, value)
    }
  }

  const changePosition = (x: string | number, y: string | number, z: string | number) => {
    setCoordinates({x,
      y,
      z})

    // Если координаты валидны (в полях числовые значения, а не пустые строки и '-', '+' и т.д.),
    // то состояние объекта обновляется и начинает снова отслеживаться (передаваться в инпуты)
    if (!isNaN(+x) && x !== '' && !isNaN(+y) && y !== '' && !isNaN(+z) && z !== '') {
      sceneObject.object.position.set(+(+x).toFixed(4), +(+y).toFixed(4), +(+z).toFixed(4))
      setCoordinates(sceneObject.object.position)
      setSceneObject(sceneObject.object.uuid, sceneObject.object, sceneObject.type)

      if (isObjectWindow(sceneObject.type, sceneObject.object) || isObjectDoor(sceneObject.type, sceneObject.object)) {
        const wall = sceneObject.object.parent as Wall

        clampWallChildPosition(wall, sceneObject.object)
      }
    }
  }

  const changeRotation = (degree: number) => {
    sceneObject.object.setRotationFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(degree))
    setSceneObject(sceneObject.object.uuid, sceneObject.object, sceneObject.type)
  }

  const changeTexture = async (src: string, repeatX = 1) => {
    if (isObjectWall(sceneObject.type, sceneObject.object)) {
      const texture = await loadTexture(src)
      // Дополнительные флаги для указания, что текстура должна повторяться
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      // Установка выбранного повтора по X
      texture.repeat.set(repeatX, 1)
      texture.userData.src = src
      sceneObject.object.material.map = texture
      // Флаг для того, чтобы отображение объекта обновилось
      sceneObject.object.material.needsUpdate = true

      setSceneObject(sceneObject.object.uuid, sceneObject.object, ObjectType.WALL)
    }
  }

  if (!sceneObject) {
    return <></>
  }

  return <Stack
    spacing={2}
    height="100%">
    <Typography
      variant='h6'
    >
      {getObjectName(sceneObject.object.uuid)}
    </Typography>
    {isObjectWall(sceneObject.type, sceneObject.object) &&
    <>
      <MuiColorInput
        format="hex"
        value={`#${wallColor(sceneObject.object.uuid) ?? ''}`}
        onChange={changeColor}
        isAlphaHidden={true}
      />
      <TexturePicker
        onChange={changeTexture}
        src={sceneObject.object.material?.map?.userData.src as string}
        repeatX={sceneObject.object.material?.map?.repeat.x}
      />
      <Divider />
    </>
    }
    <Stack spacing={2}>
      <TextField
        label="X"
        type="number"
        disabled={isObjectWindow(sceneObject.type, sceneObject.object) || isObjectDoor(sceneObject.type, sceneObject.object)}
        value={coordinates.x ? +(+coordinates.x).toFixed(4) : coordinates.x}
        onChange={(e) => changePosition(e.target.value, coordinates.y, coordinates.z)}
        onBlur={(e) => changePosition(+e.target.value, coordinates.y, coordinates.z)}
      />
      <TextField
        label="Y"
        type="number"
        disabled={isObjectWall(sceneObject.type, sceneObject.object)}
        value={coordinates.y ? +(+coordinates.y).toFixed(4) : coordinates.y}
        onChange={(e) => changePosition(coordinates.x, e.target.value, coordinates.z)}
        onBlur={(e) => changePosition(coordinates.x, +e.target.value, coordinates.z)}
      />
      <TextField
        label="Z"
        type="number"
        value={coordinates.z ? +(+coordinates.z).toFixed(4) : coordinates.z}
        onChange={(e) => changePosition(coordinates.x, coordinates.y, e.target.value)}
        onBlur={(e) => changePosition(coordinates.x, coordinates.y, +e.target.value)}
      />
      {
        !isObjectWindow(sceneObject.type, sceneObject.object) && !isObjectDoor(sceneObject.type, sceneObject.object) && <TextField
          label="Угол поворота"
          type="number"
          value={quaternionToDegree(sceneObject.object.quaternion).y}
          onChange={(e) => changeRotation(+e.target.value)}
          slotProps={{
            htmlInput: {
              step: 10
            }
          }}
        />
      }
    </Stack>
  </Stack>
}

export default observer(SceneObject)