import { ContextMenuTooltipProps } from '@/models/tooltip'
import { useStores } from '@/utils/hooks/useStores'
import { Stack, Box, IconButton, Button } from '@mui/material'
import { FC } from 'react'
import { Close } from '@mui/icons-material'
import { CanvasEditMode } from '@/models/canvas'
import { Window, Delete, ArrowBack } from '@mui/icons-material'
import { ObjectType, Wall } from '@/models/three'
import { createWindow, getBufferGeometrySize } from '@/utils/helpers/three'
import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { router } from '@/main.tsx'

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

  const addNewWindow = async () => {
    const windowModel = await createWindow(sceneObject.object as Wall)

    if (!windowModel) return

    const windowModelSize = getBufferGeometrySize(windowModel?.geometry)
    // Так как окно теперь повернуто на 90 градусов, то позиция x устанавливается как z
    // Окно устанавливается на краю стены (в силу особенности используемых моделей для окон и геометрии стен)
    windowModel.position.set(WALL_WIDTH / 2 + windowModelSize.z / 2, windowModelSize.y / 2 , windowModelSize.x / 2 + 0.1)

    setSceneObject(windowModel.uuid, windowModel, ObjectType.WINDOW)
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
        <Button
          onClick={addNewWindow}
          variant="contained"
          startIcon={<Window />}>
        Построить окно
        </Button>
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