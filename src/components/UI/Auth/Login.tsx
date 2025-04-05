import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/authContext'
import { useNavigate, useSearchParams, Link } from 'react-router'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
  Alert,
  CircularProgress
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, login } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(searchParams.get('redirect') || '/')
    }
  }, [isAuthenticated, navigate, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setError(err.response?.data?.error_message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ height: '100vh',
        display: 'flex',
        alignItems: 'center' }}>
      <Paper
        elevation={3}
        sx={{ p: 4,
          width: '100%',
          my: 'auto' }}>
        <Box
          sx={{ textAlign: 'center',
            mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            color="primary">
            Login
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            autoComplete="current-password"
            inputProps={{ minLength: 6 }}
          />

          <Box
            sx={{ textAlign: 'right',
              mb: 2 }}>
            <MuiLink
              component={Link}
              to="/forgot-password"
              color="text.secondary"
              underline="hover"
            >
              Forgot password?
            </MuiLink>
          </Box>

          <Box
            sx={{display: 'flex',
                alignItems: 'center',
              justifyContent: 'space-between'}}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ color: 'primary.main' }}
            >
            Back
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              size="large"
              sx={{ py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  color="inherit" />
              ) : (
                'Login'
              )}
            </Button>

          </Box>

          <Box
            sx={{ textAlign: 'center',
              mt: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary">
              Don&apos;t have an account?{' '}
              <MuiLink
                component={Link}
                to="/signup"
                color="primary"
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login