import { RotationTooltipProps } from '@/models/tooltip'
import { Box } from '@mui/material'
import { FC } from 'react'

const RotationTooltip: FC<RotationTooltipProps> = ({ rotationDegree }) => {
  return (
    <Box
      sx={{ textWrap: 'nowrap',
        width: '160px' }}
    >
      {`Угол поворота: ${rotationDegree}º`}
    </Box>
  )
}

export default RotationTooltip