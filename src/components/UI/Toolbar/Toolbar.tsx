import { CanvasEditMode } from '@/models/canvas'
import { Entries } from '@/models/utils'
import { useStores } from '@/utils/hooks/useStores'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { SwipeVertical, ControlCamera, Rotate90DegreesCcw } from '@mui/icons-material'

const CanvasModes = {
  [CanvasEditMode.Camera]: {
    title: 'Перемещение камеры',
    icon: <SwipeVertical />
  },
  [CanvasEditMode.Translate]: {
    title: 'Перемещение объекта',
    icon: <ControlCamera />
  },
  [CanvasEditMode.Rotate]: {
    title: 'Вращение объекта',
    icon: <Rotate90DegreesCcw />
  }
}

const Toolbar: FC = () => {
  const {
    canvasStore: {
      setCurrentMode, currentMode
    }
  } = useStores()

  return <Stack
    sx={{
      position: 'absolute',
      left: '50%',
      top: '0',
      transform: 'translateX(-50%)'
    }}
    direction="row"
    spacing={1}
  >
    {
      (Object.entries(CanvasModes) as Entries<typeof CanvasModes>)
        .map(([mode, { title, icon }], index) => (
          <Box
            key={index}
            onClick={() => setCurrentMode(mode)}>
            <Tooltip title={title}>
              <IconButton color={ mode === currentMode ? 'warning' : 'primary' }>
                { icon }
              </IconButton>
            </Tooltip>
          </Box>
        ))
    }
  </Stack>
}

export default observer(Toolbar)