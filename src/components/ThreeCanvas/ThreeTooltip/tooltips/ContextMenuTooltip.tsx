import { ContextMenuTooltipProps } from '@/models/tooltip'
import { useStores } from '@/utils/hooks/useStores'
import { Stack, Box, Tooltip, IconButton, Button } from '@mui/material'
import { FC } from 'react'
import { Close } from '@mui/icons-material'
import { CanvasEditMode } from '@/models/canvas'
import { Window, Delete } from '@mui/icons-material'
import { ObjectType, Wall } from '@/models/three'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

export const WINDOW_LENGTH = 2
export const WINDOW_HEIGHT = 1.5

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

  const createWindow = () => {
    if ((sceneObject.object as Wall).geometry.parameters.depth < WINDOW_LENGTH) return

    const windowGeometry = new BoxGeometry(1, WINDOW_HEIGHT, WINDOW_LENGTH)
    windowGeometry.translate(0, (sceneObject.object as Wall).geometry.parameters.height / 2, WINDOW_LENGTH / 2 + 0.1)
    const windowMaterial = new MeshBasicMaterial({ color: 0x3f7b9d })
    const window = new Mesh(windowGeometry, windowMaterial)

    sceneObject.object.add(window)

    setSceneObject(window.uuid, window, ObjectType.WINDOW)
    setCurrentMode(CanvasEditMode.Camera)
    setTooltip(null)
  }

  const deleteObject = () => {
    if (sceneObject.type === ObjectType.WINDOW) {
      sceneObject.object.removeFromParent()
    }

    deleteSceneObject(objectId)
    setTooltip(null)
    setCurrentMode(CanvasEditMode.Camera)
  }

  return <Stack spacing={1} sx={{ width: 'max-content' }}>
    <Box alignSelf="end">
      <IconButton onClick={() => setTooltip(null)} size="small">
        <Close />
      </IconButton>
    </Box>
    {
      sceneObject.type === ObjectType.WALL &&
      <Box>
        <Button onClick={createWindow} variant="contained" startIcon={<Window />}>
        Построить окно
        </Button>
      </Box>
    }
    <Box>
      <Button onClick={deleteObject} variant="contained" startIcon={<Delete />}>
        Удалить объект
      </Button>
    </Box>
  </Stack>
}

export default ContextMenuTooltip