import { CanvasEditMode } from '@/models/canvas'
import { Entries } from '@/models/utils'
import { useStores } from '@/utils/hooks/useStores'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { AdsClick } from '@mui/icons-material'
import { ControlCamera } from '@mui/icons-material'

const CanvasModes = {
  [CanvasEditMode.Camera]: {
    title: 'Камера',
    icon: <ControlCamera />
  },
  [CanvasEditMode.Selection]: {
    title: 'Выбор объекта',
    icon: <AdsClick />
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
          <Box key={index} onClick={() => setCurrentMode(mode)}>
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