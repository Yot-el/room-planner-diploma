import { ProjectListResponse } from '@/models/project'
import { getProjectList } from '@/utils/helpers/api'
import { useStores } from '@/utils/hooks/useStores'
import { FileDownload } from '@mui/icons-material'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'

export const ProjectsDialog: FC<Props> = ({ open, setIsOpen }) => {
  const [items, setItems] = useState<ProjectListResponse['projects']>([])

  const {
    projectStore: {
      loadProject
    }
  } = useStores()

  useEffect(() => {
    const getProjects = async () => {
      const projects = await getProjectList()
      setItems(projects)
    }

    getProjects()
  }, [])

  const loadProjectFromList = (id: string) => {
    setIsOpen(false)
    loadProject(id)
  }

  return <Dialog
    open={open}
    onClose={() => setIsOpen(false)}>
    <DialogTitle>Сохраненные проекты</DialogTitle>
    <DialogContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '16px'
      }}>
      {
        items.map((item) => <Box key={item.id} display="flex">
          <Typography flexGrow={1}>
            {
              item.name
            }
          </Typography>
          <IconButton
            onClick={() => loadProjectFromList(item.id)}
            size="small">
            <FileDownload />
          </IconButton>
        </Box>)
      }
    </DialogContent>
  </Dialog>
}

interface Props {
  open: boolean
  setIsOpen: (value: boolean) => void
}

export default observer(ProjectsDialog)