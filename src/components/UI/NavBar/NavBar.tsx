import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../../context/authContext'
import { Avatar, Button, AppBar, Toolbar, Typography, Box, styled } from '@mui/material'

const NavLink = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(2),
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline'
  }
}))

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar
      position="static"
      sx={{ minHeight: 60 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}>
          Room Planner
        </Typography>

        <NavLink
          component={Link}
          to="/">Home</NavLink>

        {isAuthenticated ? (
          <>
            <NavLink
              component={Link}
              to="/account">Account</NavLink>
            <NavLink onClick={handleLogout}>Logout</NavLink>
            <Avatar
              src={user?.photo}
              sx={{
                width: 40,
                height: 40,
                ml: 2,
                border: '2px solid white'
              }}
            />
          </>
        ) : (
          <>
            <NavLink
              component={Link}
              to="/login">Login</NavLink>
            <NavLink
              component={Link}
              to="/signup">Signup</NavLink>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}