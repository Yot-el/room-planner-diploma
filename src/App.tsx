import ThreeCanvas from '@/components/ThreeCanvas/ThreeCanvas'
import LeftPanel from '@/components/UI/LeftPanel/LeftPanel'
import Toolbar from '@/components/UI/Toolbar/Toolbar'
import { RootProvider } from '@/utils/hooks/useStores'

function App() {
  return (
    <RootProvider>
      <ThreeCanvas />
      <Toolbar />
      <LeftPanel />
    </RootProvider>
  )
}

export default App
