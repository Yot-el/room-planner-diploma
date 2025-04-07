import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { ModelType, ObjectType } from '@/models/three'
import { loadModel } from '@/utils/helpers/loadModel'
import { clampWallChildPosition, createWindow, getBufferGeometrySize } from '@/utils/helpers/three'
import { useStores } from '@/utils/hooks/useStores'
import { ImageList, ImageListItem, Pagination, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'

const Catalogue: FC = () => {
  const {
    canvasStore: {
      walls,
      setSceneObject,
      selectedObject,
      deleteSceneObject,
      setSelectedObject
    },
    catalogueStore: {
      items,
      pageCount,
      changePage,
      page
    }
  } = useStores()

  const loadObjectToScene = async (type: ModelType, url: string, name: string, category: string) => {
    const object = await loadModel(type, url)

    if (!['door', 'window'].includes(category)) {
      const { x, y, z } = object.position
      object.position.set(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4))
      object.userData.name = name
      setSceneObject(object.uuid, object, ObjectType.MODEL)
      return
    }

    // Двери и окна ставятся заместо выбранного объекта (если типы соотносятся)
    if (selectedObject && category === selectedObject?.type as string) {
      const wall = walls[selectedObject.object.userData.wallId]
      const previousWindowPosition = selectedObject.object.position

      const newWindow = await createWindow(wall, url)

      if (newWindow) {
        const windowModelSize = getBufferGeometrySize(newWindow.geometry)
        newWindow.position.set(WALL_WIDTH / 2 + windowModelSize.z / 2, previousWindowPosition.y, previousWindowPosition.z)
        clampWallChildPosition(wall, newWindow)
        setSceneObject(newWindow.uuid, newWindow, ObjectType.WINDOW)
        setSelectedObject(newWindow.uuid)
        deleteSceneObject(selectedObject.object.uuid)
      }
    }
  }

  useEffect(() => {
    if (!items.length) {
      changePage(1)
    }
  }, [])

  return  <Stack
    spacing={1}
    height='100%'
    padding={1}
    alignItems="center">
    <ImageList
      cols={1}
      rowHeight="auto"
      sx={{ flexGrow: 1 }}>
      {
        items.map((item) => (
          <ImageListItem
            key={item.id}
            onClick={() => { loadObjectToScene(ModelType.GLTF, item.src, item.properties.name, item.properties.category) }}
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