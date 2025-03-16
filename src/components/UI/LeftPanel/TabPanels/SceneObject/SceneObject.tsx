import { isObjectWall, Wall } from '@/models/three'
import { getWallShortName } from '@/utils/helpers/helpers'
import { useStores } from '@/utils/hooks/useStores'
import { Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MuiColorInput } from 'mui-color-input'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

const SceneObject = () => {
  const {
    canvasStore: {
      sceneObjects,
      setWallColor,
      wallColor
    }
  } = useStores()
  const params = useParams()
  const navigate = useNavigate()
  const sceneObject = sceneObjects[params.objectId ?? '']

  useEffect(() => {
    if (!sceneObject) {
      navigate('/catalogue')
    }
  }, [])

  const changeColor = (value: string) => {
    if (isObjectWall(sceneObject.type, sceneObject.object)) {
      setWallColor(sceneObject.object.uuid, value)
    }
  }

  if (!sceneObject) {
    return <></>
  }

  return <Stack spacing={1} height="100%">
    <Typography>{getWallShortName(sceneObject.object.uuid)}</Typography>
    {isObjectWall(sceneObject.type, sceneObject.object) &&
      <MuiColorInput format="hex" value={wallColor(sceneObject.object.uuid) ?? ''} onChange={changeColor} />
    }
  </Stack>
}

export default observer(SceneObject)