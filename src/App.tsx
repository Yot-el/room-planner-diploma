import ThreeCanvas from '@/components/ThreeCanvas/ThreeCanvas'
import { RootProvider } from '@/utils/hooks/useStores'

function App() {
  return (
    <RootProvider>
      <ThreeCanvas />
    </RootProvider>
  )
}

export default App
