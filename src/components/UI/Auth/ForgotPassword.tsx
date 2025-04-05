import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
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
import { useAuth } from '@/context/authContext'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await forgotPassword(email)

      setMessage('Password reset link sent to your email!')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setError(err.response?.data?.message || 'Error sending reset link')
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
            Forgot Password
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
        </Box>

        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

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
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            autoComplete="email"
          />

          <Box
            sx={{ display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3}}>
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
                'Send Reset Link'
              )}
            </Button>
          </Box>



          <Box
            sx={{ textAlign: 'center',
              mt: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary">
              Remember your password?{' '}
              <MuiLink
                component={Link}
                to="/login"
                color="primary"
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Log in instead
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default ForgotPassword