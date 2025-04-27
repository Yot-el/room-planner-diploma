import { useAuth } from '@/context/authContext'
import { getDoorShortName, getModelShortName, getWallShortName, getWindowShortName } from '@/utils/helpers/helpers'
import { useStores } from '@/utils/hooks/useStores'
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Stack, TextField, useTheme } from '@mui/material'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router'


const SceneTree: FC = () => {
  const {
    canvasStore: {
      clearSceneObjects,
      models,
      walls,
      selectedObject,
      windowsByWallId,
      doorsByWallId,
      sceneObjects
    },
    projectStore: {
      loadProject,
      saveProject,
      project
    }
  } = useStores()
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [overrideProject, setOverrideProject] = useState(!!project)
  const [projectTitle, setProjectTitle] = useState(project?.name ?? '')

  const auth = useAuth()
  // console.log(auth)

  const saveScene = () => {
    saveProject(projectTitle)
    setIsDialogOpen(false)
  }

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
                {
                  doorsByWallId(wall.uuid).map((door) => (<TreeItem
                    key={door.uuid}
                    itemId={door.uuid}
                    label={getDoorShortName(door.uuid)}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      navigate(`${door.uuid}`)
                    }}
                    sx={selectedObject?.object.uuid === door.uuid ? {
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
      onClick={() => loadProject()}
      variant="contained">
      Загрузить сцену
    </Button>
    <Button
      disabled={!Object.values(sceneObjects).length}
      onClick={() => setIsDialogOpen(true)}
      variant="contained">
      Сохранить сцену
    </Button>
    <Button
      onClick={clearSceneObjects}
      variant="contained">
      Очистить сцену
    </Button>
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}>
      <DialogTitle>Сохранение проекта</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '16px'
        }}>
        <TextField
          label="Название проекта"
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox
            checked={overrideProject}
            disabled={!project}
            onChange={(e, checked) => setOverrideProject(checked)} />}
          label="Перезаписать текущий проект"
        />
        <Button
          sx={{
            marginTop: '16px'
          }}
          onClick={saveScene}
          variant="contained">
            Сохранить
        </Button>
      </DialogContent>
    </Dialog>
  </Stack>
}

export default observer(SceneTree)