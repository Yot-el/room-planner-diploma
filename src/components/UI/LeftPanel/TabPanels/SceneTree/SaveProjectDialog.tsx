import { useStores } from '@/utils/hooks/useStores'
import { Dialog, DialogTitle, DialogContent, TextField, FormControlLabel, Checkbox, Button } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'

const SaveProjectDialog: FC<Props> = ({ open, setIsOpen }) => {
  const {
    projectStore: {
      loadProject,
      saveProject,
      project
    }
  } = useStores()

  const [overrideProject, setOverrideProject] = useState(!!project)
  const [projectTitle, setProjectTitle] = useState(project?.name ?? '')

  const saveScene = () => {
    saveProject(projectTitle, overrideProject && project?.id ? project?.id : undefined)
    setIsOpen(false)
  }

  return <Dialog
    open={open}
    onClose={() => setIsOpen(false)}>
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
}

interface Props {
  open: boolean
  setIsOpen: (value: boolean) => void
}


export default observer(SaveProjectDialog)