import TexturePicker from '@/components/UI/TexturePicker/TexturePicker'
import { isObjectWall, ObjectType, Wall } from '@/models/three'
import { getModelShortName, getWallShortName, quaternionToDegree } from '@/utils/helpers/helpers'
import { loadTexture } from '@/utils/helpers/loadTexture'
import { useStores } from '@/utils/hooks/useStores'
import { Stack, TextField, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MuiColorInput } from 'mui-color-input'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { MathUtils, RepeatWrapping, Vector3 } from 'three'

const SceneObject = () => {
  const {
    canvasStore: {
      sceneObjects,
      setWallColor,
      wallColor,
      setSceneObject
    }
  } = useStores()
  const params = useParams()
  const navigate = useNavigate()
  const sceneObject = sceneObjects[params.objectId ?? '']

  useEffect(() => {
    if (!sceneObject) {
      navigate('/catalogue')
    }
  }, [sceneObject])

  const changeColor = (value: string) => {
    if (isObjectWall(sceneObject.type, sceneObject.object)) {
      setWallColor(sceneObject.object.uuid, value)
    }
  }

  const changePosition = (x: number, y: number, z: number) => {
    sceneObject.object.position.set(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4))
    setSceneObject(sceneObject.object.uuid, sceneObject.object, sceneObject.type)
  }

  const changeRotation = (degree: number) => {
    sceneObject.object.setRotationFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(degree))
    setSceneObject(sceneObject.object.uuid, sceneObject.object, sceneObject.type)
  }

  const changeTexture = async (value: string) => {
    if (isObjectWall(sceneObject.type, sceneObject.object)) {
      const texture = await loadTexture(value)
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.userData.src = value
      sceneObject.object.material.map = texture
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
      {isObjectWall(sceneObject.type, sceneObject.object) ?
        getWallShortName(sceneObject.object.uuid) :
        getModelShortName(sceneObject.object.uuid, sceneObject.object.userData.name as string)}
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
        value={sceneObject.object.material?.map?.userData.src as string} />
    </>
    }
    <Stack spacing={2}>
      <TextField
        label="X"
        type="number"
        value={sceneObject.object.position.x}
        onChange={(e) => changePosition(+e.target.value, sceneObject.object.position.y, sceneObject.object.position.z)}
      />
      <TextField
        label="Y"
        type="number"
        disabled={isObjectWall(sceneObject.type, sceneObject.object)}
        value={sceneObject.object.position.y}
        onChange={(e) => changePosition(sceneObject.object.position.x, +e.target.value, sceneObject.object.position.z)}
      />
      <TextField
        label="Z"
        type="number"
        value={sceneObject.object.position.z}
        onChange={(e) => changePosition(sceneObject.object.position.x, sceneObject.object.position.y, +e.target.value)}
      />
      <TextField
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
    </Stack>
  </Stack>
}

export default observer(SceneObject)