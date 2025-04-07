import { ImageListItem, ImageListItemBar, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

const CatalogueItem: FC<Props> = ({ onClick, name, imageSrc, imageAlt }) => {
  return <ImageListItem
    onClick={onClick}
    sx={{ cursor: 'pointer' }}>
    <img
      src={imageSrc}
      alt={imageAlt}
      loading="lazy"
      style={{
        height: '100%',
        width: '100%',
        objectFit: 'contain'
      }}
    />
    {
      name && <ImageListItemBar
        title={name}
      />
    }
  </ImageListItem>
}

interface Props {
  onClick: () => void
  name: string
  imageSrc: string
  imageAlt?: string
}

export default observer(CatalogueItem)