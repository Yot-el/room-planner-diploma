import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/main.css'
import Box from '@mui/material/Box'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from './App.tsx'
import { BrowserRouter, createBrowserRouter, Navigate, Outlet, Route, RouterProvider, Routes } from 'react-router'
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

const Layout = () => {
  return <AuthProvider>
    <Box
      sx={{ display: 'flex',
        flexDirection: 'column',
        height: '100vh' }}>
      <Navbar />
      <Outlet />
    </Box>
  </AuthProvider>
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/signup',
        element: <SignupForm />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/account',
            element: <Account />
          },
          {
            path: '/update-password',
            element: <UpdatePassword />
          }
        ]
      },
      {
        element: <App />,
        path: '/',
        children: [
          {
            path: 'catalogue',
            element: <Catalogue />
          },
          {
            path: 'scene-graph',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <SceneTree />
              },
              {
                path: ':objectId',
                element: <SceneObject />
              }
            ]
          },
          {
            path: 'tools',
            element: <Tools />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
