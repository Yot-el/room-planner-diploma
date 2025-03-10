import { useStores } from '@/utils/hooks/useStores'
import { Button, Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

const SceneTree: FC = () => {
  const {
    canvasStore: {
      clearSceneObjects
    }
  } = useStores()

  return <Stack spacing={1}>
    <Button onClick={clearSceneObjects} variant="contained">
      Очистить сцену
    </Button>
  </Stack>
}

export default observer(SceneTree)