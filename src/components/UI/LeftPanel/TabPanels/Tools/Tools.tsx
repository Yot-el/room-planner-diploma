import { CanvasEditMode } from '@/models/canvas'
import { useStores } from '@/utils/hooks/useStores'
import { Button, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'

const Tools: FC = () => {
  const {
    canvasStore: {
      currentMode,
      setCurrentMode
    }
  } = useStores()

  useEffect(() => {
    // При переходе на другую страницу сбрасываем режим
    return () => {
      if (currentMode === CanvasEditMode.BuildWall) {
        setCurrentMode(CanvasEditMode.Camera)
      }
    }
  }, [currentMode])

  return <Stack spacing={1}>
    <Button onClick={() => setCurrentMode(CanvasEditMode.BuildWall)} variant="contained">
      Построить стену
    </Button>
  </Stack>
}

export default observer(Tools)