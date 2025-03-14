import { RotationTooltipProps, TooltipType, WallTooltipProps, ContextMenuTooltipProps, TooltipData } from '@/models/tooltip'
import { useStores } from '@/utils/hooks/useStores'
import { Box, IconButton, Paper, Stack, Tooltip } from '@mui/material'
import { Html } from '@react-three/drei'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { styled } from '@mui/material/styles'
import WallTooltip from '@/components/ThreeCanvas/ThreeTooltip/tooltips/WallTooltip'
import RotationTooltip from '@/components/ThreeCanvas/ThreeTooltip/tooltips/RotationTooltip'
import ContextMenuTooltip from '@/components/ThreeCanvas/ThreeTooltip/tooltips/ContextMenuTooltip'

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

const getTooltipTextByType = (type: TooltipType, data: TooltipData) => {
  switch (type) {
  case TooltipType.WALL: {
    const info = data as WallTooltipProps
    return <WallTooltip {...info}/>
  }
  case TooltipType.ROTATE: {
    const info = data as RotationTooltipProps
    return <RotationTooltip {...info} />
  }
  case TooltipType.CONTEXT_MENU: {
    const info = data as ContextMenuTooltipProps
    return <ContextMenuTooltip {...info} />
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