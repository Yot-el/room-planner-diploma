import TexturePicker from '@/components/UI/TexturePicker/TexturePicker'
import { isObjectWall, ObjectType, Wall } from '@/models/three'
import { getWallShortName } from '@/utils/helpers/helpers'
import { loadTexture } from '@/utils/helpers/loadTexture'
import { useStores } from '@/utils/hooks/useStores'
import { Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MuiColorInput } from 'mui-color-input'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { RepeatWrapping } from 'three'

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

  console.log(sceneObject)
  return <Stack
    spacing={1}
    height="100%">
    <Typography>{getWallShortName(sceneObject.object.uuid)}</Typography>
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
  </Stack>
}

export default observer(SceneObject)