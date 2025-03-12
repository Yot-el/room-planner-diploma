import { RotationTooltip, TooltipType, WallTooltip } from '@/models/tooltip'
import { useStores } from '@/utils/hooks/useStores'
import { Box, Paper, Stack } from '@mui/material'
import { Html } from '@react-three/drei'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  minWidth: '100px',
  minHeight: '50px',
  padding: '5px'
}))

const getTooltipTextByType = (type: TooltipType, data: WallTooltip | RotationTooltip) => {
  switch (type) {
  case TooltipType.WALL: {
    const info = data as WallTooltip
    return <Stack>
      <Box sx={{ textWrap: 'nowrap' }}>{`Ширина: ${info.width}м`}</Box>
      <Box sx={{ textWrap: 'nowrap' }}>{`Высота: ${info.height}м`}</Box>
      <Box sx={{ textWrap: 'nowrap' }}>{`Длина: ${info.length.toFixed(2)}м`}</Box>
    </Stack>
  }
  }
}

const ThreeTooltip: FC = () => {
  const {
    canvasStore: {
      tooltip
    }
  } = useStores()

  return <mesh position={tooltip ? tooltip?.position.toArray() : [0, 0, 0]}>
    {
      tooltip && <Html
        style={{ transform: 'translate3d(0, calc(50% + 20px), 0)' }}>
        <Item elevation={3}>
          {getTooltipTextByType(tooltip.type, tooltip.data)}
        </Item>
      </Html>
    }

  </mesh>
}

export default observer(ThreeTooltip)