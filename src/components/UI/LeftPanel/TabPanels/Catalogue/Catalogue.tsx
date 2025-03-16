import { ModelType, ObjectType } from '@/models/three'
import { loadModel } from '@/utils/helpers/loadModel'
import { useStores } from '@/utils/hooks/useStores'
import { ImageList, ImageListItem, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

const Catalogue: FC = () => {
  const {
    canvasStore: {
      setSceneObject
    }
  } = useStores()

  const objects = [
    {
      url: './models/couch.fbx',
      imageUrl: './images/couch.png',
      name: 'couch',
      type: ModelType.FBX
    }
  ]

  const loadObjectToScene = async (type: ModelType, url: string) => {
    const object = await loadModel(type, url)
    setSceneObject(object.uuid, object, ObjectType.MODEL)
  }

  return  <Stack spacing={1}>
    <ImageList
      cols={1}
      rowHeight={150}>
      {
        objects.map((object, index) => (
          <ImageListItem
            key={index}
            onClick={() => { loadObjectToScene(object.type, object.url) }}
            sx={{ cursor: 'pointer' }}>
            <img
              src={object.imageUrl}
              alt={object.name}
              width="200"
              height="200"
              loading="lazy"
            />
          </ImageListItem>
        ))
      }
    </ImageList>
  </Stack>
}

export default observer(Catalogue)