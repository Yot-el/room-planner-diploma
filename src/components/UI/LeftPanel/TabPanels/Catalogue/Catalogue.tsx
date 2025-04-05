import { ModelType, ObjectType } from '@/models/three'
import { loadModel } from '@/utils/helpers/loadModel'
import { useStores } from '@/utils/hooks/useStores'
import { ImageList, ImageListItem, Pagination, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'

const Catalogue: FC = () => {
  const {
    canvasStore: {
      setSceneObject
    },
    catalogueStore: {
      items,
      pageCount,
      changePage,
      page
    }
  } = useStores()

  const loadObjectToScene = async (type: ModelType, url: string, name: string) => {
    const object = await loadModel(type, url)

    const { x, y, z } = object.position
    object.position.set(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4))
    object.userData.name = name
    setSceneObject(object.uuid, object, ObjectType.MODEL)
  }

  useEffect(() => {
    if (!items.length) {
      changePage(1)
    }
  }, [])

  return  <Stack spacing={1} height='100%' padding={1} alignItems="center">
    <ImageList
      cols={1}
      rowHeight="auto"
      sx={{ flexGrow: 1 }}>
      {
        items.map((item) => (
          <ImageListItem
            key={item.id}
            onClick={() => { loadObjectToScene(ModelType.GLTF, item.src, item.properties.name) }}
            sx={{ cursor: 'pointer',
              width: '100px'
            }}>
            <img
              src={item.imageSrc}
              alt={item.properties.name}
              width="200"
              height="20"
              loading="lazy"
            />
          </ImageListItem>
        ))
      }
    </ImageList>
    <Pagination
      count={pageCount}
      page={page}
      color="primary"
      size="small"
      onChange={(_, page) => changePage(page)}
    />
  </Stack>
}

export default observer(Catalogue)