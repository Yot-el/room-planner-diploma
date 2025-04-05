import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/main.css'
import Box from '@mui/material/Box'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from './App.tsx'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import Catalogue from '@/components/UI/LeftPanel/TabPanels/Catalogue/Catalogue.tsx'
import SceneTree from '@/components/UI/LeftPanel/TabPanels/SceneTree/SceneTree.tsx'
import Tools from '@/components/UI/LeftPanel/TabPanels/Tools/Tools.tsx'
import SceneObject from '@/components/UI/LeftPanel/TabPanels/SceneObject/SceneObject.tsx'
import Navbar from './components/UI/NavBar/NavBar.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './context/authContext.tsx'
import SignupForm from './components/UI/Auth/SignupForm.tsx'
import Login from './components/UI/Auth/Login.tsx'
import Account from './components/UI/Auth/Account.tsx'
import ForgotPassword from './components/UI/Auth/ForgotPassword.tsx'
import { element } from 'three/src/nodes/TSL.js'
import ProtectedRoute from './components/UI/Auth/ProtectedRoute.tsx'
import ResetPassword from './components/UI/Auth/ResetPassword.tsx'
import UpdatePassword from './components/UI/Auth/UpdatePassword.tsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Box
            sx={{ display: 'flex',
              flexDirection: 'column',
              // background: 'orangered',
              height: '100vh' }}>
            <Navbar />
            <Routes>
              <Route
                path='/signup'
                element={<SignupForm />} />
              <Route
                path='/login'
                element={<Login />} />
              <Route
                path='/forgot-password'
                element={<ForgotPassword />} />
              <Route
                path='/reset-password/:token'
                element={<ResetPassword />}>
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route
                  path='/account'
                  element={<Account />}>
                </Route>
                <Route
                  path='/update-password'
                  element={<UpdatePassword />}>
                </Route>
              </Route>
              <Route
                path="/"
                element={<App />} >
                <Route
                  path="catalogue"
                  element={<Catalogue />} />
                <Route
                  path="scene-graph"
                  element={<Outlet />}>
                  <Route
                    index
                    element={<SceneTree />} />
                  <Route
                    path=":objectId"
                    element={<SceneObject />} />
                </Route>
                <Route
                  path="tools"
                  element={<Tools />} />
              </Route>
            </Routes>
          </Box>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
