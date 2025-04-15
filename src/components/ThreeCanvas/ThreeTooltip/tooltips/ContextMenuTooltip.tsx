import { ContextMenuTooltipProps } from '@/models/tooltip'
import { useStores } from '@/utils/hooks/useStores'
import { Stack, Box, IconButton, Button } from '@mui/material'
import { FC } from 'react'
import { Close } from '@mui/icons-material'
import { CanvasEditMode } from '@/models/canvas'
import { Window, Delete, ArrowBack, SensorDoor } from '@mui/icons-material'
import { ObjectType, Wall } from '@/models/three'
import { createWallChild, getBufferGeometrySize } from '@/utils/helpers/three'
import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { router } from '@/main.tsx'
import { getDefaultDoorUrl, getDefaultWindowUrl } from '@/utils/helpers/api'

const ContextMenuTooltip: FC<ContextMenuTooltipProps> = ({ objectId }) => {
  const {
    canvasStore: {
      setTooltip,
      sceneObjects,
      deleteSceneObject,
      setCurrentMode,
      setSceneObject
    }
  } = useStores()

  const sceneObject = sceneObjects[objectId]

  const addNewWallChild = async (type: ObjectType.WINDOW | ObjectType.DOOR) => {
    const childUrl = type === ObjectType.WINDOW ? getDefaultWindowUrl() : getDefaultDoorUrl()
    const model = await createWallChild(sceneObject.object as Wall, childUrl, type)

    if (!model) return

    const modelSize = getBufferGeometrySize(model?.geometry)
    // Так как будущий элемент теперь повернут на 90 градусов, то позиция x устанавливается как z
    // Двери и окна устанавливаются на краю стены (в силу особенности используемых моделей для дверей и окон, а также геометрии стен)
    model.position.set(WALL_WIDTH / 2 + modelSize.z / 2, modelSize.y / 2 , modelSize.x / 2 + 0.1)

    setSceneObject(model.uuid, model, type)
    setCurrentMode(CanvasEditMode.Camera)
    setTooltip(null)
  }

  const deleteObject = () => {
    deleteSceneObject(objectId)
    setTooltip(null)
    setCurrentMode(CanvasEditMode.Camera)
  }

  const goToSceneObjectPage = () => {
    router.navigate(`/scene-graph/${objectId}`)
    setTooltip(null)
    setCurrentMode(CanvasEditMode.Camera)
  }

  return <Stack
    spacing={1}
    sx={{ width: 'max-content' }}>
    <Box alignSelf="end">
      <IconButton
        onClick={() => setTooltip(null)}
        size="small">
        <Close />
      </IconButton>
    </Box>
    <Stack spacing={1}>
      {
        sceneObject.type === ObjectType.WALL &&
        <>
          <Button
            onClick={() => addNewWallChild(ObjectType.WINDOW)}
            variant="contained"
            startIcon={<Window />}>
            Построить окно
          </Button>
          <Button
            onClick={() => addNewWallChild(ObjectType.DOOR)}
            variant="contained"
            startIcon={<SensorDoor />}>
            Построить дверь
          </Button>
        </>
      }
      <Button
        onClick={goToSceneObjectPage}
        variant="contained"
        startIcon={<ArrowBack />}>
        Свойства объекта
      </Button>
      <Button
        onClick={deleteObject}
        variant="contained"
        startIcon={<Delete />}>
        Удалить объект
      </Button>
    </Stack>
  </Stack>
}

export default ContextMenuTooltip