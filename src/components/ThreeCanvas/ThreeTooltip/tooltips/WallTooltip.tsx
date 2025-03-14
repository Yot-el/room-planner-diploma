import { WallTooltipProps } from '@/models/tooltip'
import { Stack, Box } from '@mui/material'
import { FC } from 'react'

const WallTooltip: FC<WallTooltipProps> = ({ width, height, length }) => {
  return <Stack>
    <Box sx={{ textWrap: 'nowrap' }}>{`Ширина: ${width}м`}</Box>
    <Box sx={{ textWrap: 'nowrap' }}>{`Высота: ${height}м`}</Box>
    <Box sx={{ textWrap: 'nowrap' }}>{`Длина: ${length.toFixed(2)}м`}</Box>
  </Stack>
}

export default WallTooltip