import { Input, InputAdornment, OutlinedInput, Stack, TextField } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { ChangeEvent, FC, useState } from 'react'

const TexturePicker: FC<Props> = ({ onChange, src, repeatX = 1 }) => {
  const [textureSrc, setTextureSrc] = useState(src)

  const updateObjectTexture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const url = URL.createObjectURL(file)
      setTextureSrc(url)
      onChange(url)
    }
  }

  const updateObjectRepeatX = (repeat: number) => {
    onChange(src, repeat)
  }

  return (
    <Stack spacing={2}>
      <OutlinedInput
        type='file'
        inputProps={{
          accept: '.jpg, .png'
        }}
        startAdornment={
          <InputAdornment
            position="start"
            disablePointerEvents={true} >
            {
              textureSrc &&
            <img
              style={{
                borderRadius: '4px',
                boxShadow: 'rgba(50, 50, 93, 0.11) 0px 4px 6px 0px, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px'
              }}
              width="24"
              height="24"
              src={textureSrc} />
            }
          </InputAdornment>
        }
        onChange={updateObjectTexture}
      />
      <TextField
        label="Повторения текстуры по X"
        type="number"
        value={repeatX}
        onChange={(e) => updateObjectRepeatX(+e.target.value)}
        slotProps={{
          htmlInput: {
            min: 1
          }
        }}
      />
    </Stack>
  )
}

interface Props {
  onChange: (value: string, repeatX?: number) => void
  src: string
  repeatX?: number
}

export default observer(TexturePicker)