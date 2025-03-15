import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/main.css'
import App from './App.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Catalogue from '@/components/UI/LeftPanel/TabPanels/Catalogue/Catalogue.tsx'
import SceneTree from '@/components/UI/LeftPanel/TabPanels/SceneTree/SceneTree.tsx'
import Tools from '@/components/UI/LeftPanel/TabPanels/Tools/Tools.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="scene-graph" element={<SceneTree />} />
          <Route path="tools" element={<Tools />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
