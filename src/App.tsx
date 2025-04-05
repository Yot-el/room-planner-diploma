import ThreeCanvas from '@/components/ThreeCanvas/ThreeCanvas'
import LeftPanel from '@/components/UI/LeftPanel/LeftPanel'
import Toolbar from '@/components/UI/Toolbar/Toolbar'
import { RootProvider } from '@/utils/hooks/useStores'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    // Редирект на каталог
    if (pathname === '/') navigate('/catalogue')
  }, [ pathname ])

  return (
    <Box
      component="main"
      sx={{
        height: '100%',
        overflow: 'auto',
        bgcolor: 'background.default',
        position: 'relative'
      }}
    >
      <RootProvider>
        <div
          style={{height: '100%',
            width: '100%'}}>
          <ThreeCanvas />
        </div>
        <Toolbar />
        <LeftPanel />
      </RootProvider>
    </Box>
  )
}

export default App
