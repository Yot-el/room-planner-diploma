import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../../../context/authContext'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material'
import { LockReset } from '@mui/icons-material'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()

  console.log('in reset', token)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('in reset handler')


    if (password !== passwordConfirmation) {
      setError('Passwords do not match')
      return
    }
    console.log(token)

    setIsLoading(true)
    try {
      await resetPassword(password, passwordConfirmation, token as string)
      navigate('/login', {
        state: {
          message: 'Password reset successfully! Please login with your new password.'
        }
      })
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setError(err.response?.data?.message || 'Error resetting password')
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
          width: '100%' }}>
        <Box
          sx={{ textAlign: 'center',
            mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            color="primary">
            Reset Password
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
        </Box>

        <Typography
          variant="body1"
          sx={{ mb: 3 }}>
          Please enter your new password below. Minimum 8 characters.
        </Typography>

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
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            inputProps={{ minLength: 8 }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            margin="normal"
            inputProps={{ minLength: 8 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            disabled={isLoading}
            size="large"
            startIcon={isLoading ? <CircularProgress
              size={20}
              color="inherit" /> : <LockReset />}
            sx={{ py: 1.5,
              mt: 3
            }}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>



        {error && (
          <Box
            sx={{ textAlign: 'center',
              mt: 3 }}>
            <MuiLink
              component={Link}
              to="/forgot-password"
              color="text.secondary"
              underline="hover"
            >
              Request new reset link
            </MuiLink>
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default ResetPassword