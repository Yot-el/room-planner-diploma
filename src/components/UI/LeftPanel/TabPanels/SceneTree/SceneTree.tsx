import { getModelShortName, getWallShortName, getWindowShortName } from '@/utils/helpers/helpers'
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
      selectedObject,
      windowsByWallId
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
          disabled={!Object.keys(models).length}
          sx={{ userSelect: 'none' }}
        >
          {
            Object.values(models).map((model) => (
              <TreeItem
                key={model.uuid}
                itemId={model.uuid}
                label={getModelShortName(model.uuid, model.userData?.name as string)}
                onDoubleClick={() => { navigate(`${model.uuid}`) }}
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
          disabled={!Object.keys(walls).length}
          sx={{ userSelect: 'none' }}
        >
          {
            Object.values(walls).map((wall) => (
              <TreeItem
                key={wall.uuid}
                itemId={wall.uuid}
                label={getWallShortName(wall.uuid)}
                onDoubleClick={() => { navigate(`${wall.uuid}`) }}
                sx={selectedObject?.object.uuid === wall.uuid ? {
                  color: 'warning.main'
                } : {}}
              >
                {
                  windowsByWallId(wall.uuid).map((window) => (<TreeItem
                    key={window.uuid}
                    itemId={window.uuid}
                    label={getWindowShortName(window.uuid)}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      navigate(`${window.uuid}`)
                    }}
                    sx={selectedObject?.object.uuid === window.uuid ? {
                      color: 'warning.main'
                    } : {}}
                  />
                  ))
                }
              </TreeItem>
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