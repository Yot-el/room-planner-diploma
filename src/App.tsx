import ThreeCanvas from '@/components/ThreeCanvas/ThreeCanvas'
import Toolbar from '@/components/UI/Toolbar/Toolbar'
import { RootProvider } from '@/utils/hooks/useStores'

function App() {
  return (
    <RootProvider>
      <ThreeCanvas />
      <Toolbar />
    </RootProvider>
  )
}

export default App
