import CatalogueItem from '@/components/UI/LeftPanel/TabPanels/Catalogue/CatalogueItem'
import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { ModelType, ObjectType } from '@/models/three'
import { loadModel } from '@/utils/helpers/loadModel'
import { clampWallChildPosition, createWallChild, getBufferGeometrySize } from '@/utils/helpers/three'
import { useStores } from '@/utils/hooks/useStores'
import { Box, IconButton, ImageList, ImageListItem, Pagination, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CategoryItem, FurnitureItem } from '@/models/catalogue'
import { ArrowBack, CategoryOutlined } from '@mui/icons-material'
import { Window } from '@/models/three'

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

  const params = useParams()
  const navigate = useNavigate()
  const categoryId = params.categoryId

  const loadObjectToScene = async (type: ModelType, url: string, name: string, category: string) => {
    const object = await loadModel(type, url)

    if (!['doors', 'windows'].includes(category)) {
      const { x, y, z } = object.position
      object.position.set(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4))
      object.userData.name = name
      setSceneObject(object.uuid, object, ObjectType.MODEL)
      return
    }

    // Двери и окна ставятся заместо выбранного объекта (если типы соотносятся)
    if (selectedObject &&
      (category === 'windows' && selectedObject.type === ObjectType.WINDOW ||
        category === 'doors' && selectedObject.type === ObjectType.DOOR)) {
      const wall = walls[selectedObject.object.userData.wallId]
      const previousChildPosition = selectedObject.object.position

      const type = category === 'windows' ? ObjectType.WINDOW : ObjectType.DOOR
      const newChild = await createWallChild(wall, url, type)

      if (newChild) {
        const windowModelSize = getBufferGeometrySize(newChild.geometry)
        newChild.position.set(WALL_WIDTH / 2 + windowModelSize.z / 2, previousChildPosition.y, previousChildPosition.z)
        clampWallChildPosition(wall, newChild)
        setSceneObject(newChild.uuid, newChild, type)
        setSelectedObject(newChild.uuid)
        deleteSceneObject(selectedObject.object.uuid)
      }
    }
  }

  const goToCategory = (id: string) => {
    navigate(`/catalogue/${id}`)
  }

  useEffect(() => {
    changePage(1, categoryId)
  }, [categoryId])

  return  <Stack
    spacing={1}
    padding={1}
    alignItems="center"
    sx={{
      height: '1px',
      minHeight: '100%'
    }}
  >
    {
      categoryId && <Box width="100%">
        <IconButton
          onClick={() => navigate(-1)}
          size="small">
          <ArrowBack />
        </IconButton>
      </Box>
    }
    <ImageList
      cols={1}
      rowHeight={150}
      sx={{ flexGrow: 1,
        width: '100%',
        overflowY: 'scroll'
      }}>
      {
        items.map((item) => (
          <CatalogueItem
            key={item.id}
            onClick={!categoryId ?
              () => { goToCategory(item.id) } :
              () => {
                const furniture = item as FurnitureItem
                loadObjectToScene(furniture.type as ModelType, furniture.src, furniture.properties.name, furniture.properties.category)
              } }
            imageSrc={item.imageSrc ?? ''}
            name={(item as CategoryItem).category ?? ''} />
        ))
      }
    </ImageList>
    {
      !categoryId && <Pagination
        count={pageCount}
        page={page}
        color="primary"
        size="small"
        onChange={(_, page) => changePage(page)}
      />
    }
  </Stack>
}

export default observer(Catalogue)