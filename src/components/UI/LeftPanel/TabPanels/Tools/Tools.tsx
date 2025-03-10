import { CanvasEditMode } from '@/models/canvas'
import { useStores } from '@/utils/hooks/useStores'
import { Button, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

const SceneTree: FC = () => {
  const {
    canvasStore: {
      setCurrentMode
    }
  } = useStores()

  return <Stack spacing={1}>
    <Button onClick={() => setCurrentMode(CanvasEditMode.BuildWall)} variant="contained">
      Построить стену
    </Button>
  </Stack>
}

export default observer(SceneTree)