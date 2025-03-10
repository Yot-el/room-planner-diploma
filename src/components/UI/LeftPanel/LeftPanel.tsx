import { Box, Stack, Tab, Tabs } from '@mui/material'
import { FC, useState } from 'react'
import { Chair, AccountTree, Handyman } from '@mui/icons-material'
import SceneTree from '@/components/UI/LeftPanel/TabPanels/SceneTree/SceneTree'
import Catalogue from '@/components/UI/LeftPanel/TabPanels/Catalogue/Catalogue'
import Tools from '@/components/UI/LeftPanel/TabPanels/Tools/Tools'

const tabs = [
  {
    label: 'Каталог',
    icon: <Chair />,
    tabPanel: <Catalogue />
  },
  {
    label: 'Сцена',
    icon: <AccountTree />,
    tabPanel: <SceneTree />
  },
  {
    label: 'Построить',
    icon: <Handyman />,
    tabPanel: <Tools />
  }
]

const LeftPanel: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  return <Stack
    sx={{
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100vh',
      width: '20vw',
      minWidth: '300px',
      padding: '8px',
      bgcolor: 'background.paper',
      boxShadow: '10px 10px 30px -24px rgba(0,0,0,0.75);'
    }}
    spacing={1} >
    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue as number)} variant="fullWidth" >
      {
        tabs.map((tab, index) => (<Tab key={index} label={tab.label} icon={tab.icon} />))
      }
    </Tabs>
    <Box flexGrow={1}>
      { tabs[activeTab].tabPanel }
    </Box>
  </Stack>
}

export default LeftPanel