import { getModelShortName, getWallShortName } from '@/utils/helpers/helpers'
import { useStores } from '@/utils/hooks/useStores'
import { Button, Stack, useTheme } from '@mui/material'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useNavigate } from 'react-router'


const SceneTree: FC = () => {
  const {
    canvasStore: {
      clearSceneObjects,
      models,
      walls,
      selectedObject
    }
  } = useStores()
  const navigate = useNavigate()

  return <Stack
    spacing={1}
    height="100%">
    <Stack
      spacing={1}
      flexGrow={1}>
      <SimpleTreeView>
        <TreeItem
          itemId="models"
          label="Модели"
          disabled={!Object.keys(models).length}>
          {
            Object.values(models).map((model) => (
              <TreeItem
                key={model.uuid}
                itemId={model.uuid}
                label={getModelShortName(model.uuid, model.userData?.name as string)}
                onClick={() => { navigate(`${model.uuid}`) }}
                sx={selectedObject?.object.uuid === model.uuid ? {
                  color: 'warning.main'
                } : {}}
              />
            ))
          }
        </TreeItem>
        <TreeItem
          itemId="walls"
          label="Стены"
          disabled={!Object.keys(walls).length}>
          {
            Object.values(walls).map((wall) => (
              <TreeItem
                key={wall.uuid}
                itemId={wall.uuid}
                label={getWallShortName(wall.uuid)}
                onClick={() => { navigate(`${wall.uuid}`) }}
              />
            ))
          }
        </TreeItem>
      </SimpleTreeView>
    </Stack>
    <Button
      onClick={clearSceneObjects}
      variant="contained">
      Очистить сцену
    </Button>
  </Stack>
}

export default observer(SceneTree)