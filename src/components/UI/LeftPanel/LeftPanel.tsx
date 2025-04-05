import { Box, Stack, Tab, Tabs } from '@mui/material'
import { FC, useState } from 'react'
import { Chair, AccountTree, Handyman } from '@mui/icons-material'
import { Outlet, useLocation } from 'react-router'
import { useNavigate } from 'react-router'

const tabs = [
  {
    label: 'Каталог',
    icon: <Chair />,
    link: '/catalogue'
  },
  {
    label: 'Сцена',
    icon: <AccountTree />,
    link: '/scene-graph'
  },
  {
    label: 'Построить',
    icon: <Handyman />,
    link: '/tools'
  }
]

const LeftPanel: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // eslint-disable-next-line no-useless-escape
  const currentPath = pathname.match(/^\/[^\/]+/)?.[0]

  return <Stack
    sx={{
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100%',
      width: '20vw',
      minWidth: '300px',
      padding: '8px',
      bgcolor: 'background.paper',
      boxShadow: '10px 10px 30px -24px rgba(0,0,0,0.75);'
      // visibility: 'hidden'
    }}
    spacing={1} >
    {
      currentPath &&
        <>
          <Tabs
            value={currentPath}
            onChange={(e, newValue) => {
              navigate(newValue as string)
            }}
            variant="fullWidth"
          >
            {
              tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  value={tab.link}
                />))
            }
          </Tabs>
          <Box flexGrow={1}>
            <Outlet />
          </Box>
        </>
    }
  </Stack>
}

export default LeftPanel