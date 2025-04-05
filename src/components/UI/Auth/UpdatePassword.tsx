import { useState } from 'react'
import { useAuth } from '../../../context/authContext'
import { useNavigate } from 'react-router'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material'
import { ArrowBack, Lock } from '@mui/icons-material'

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { token, logout, updatePassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (newPassword !== newPasswordConfirmation) {
      setError('New passwords don\'t match')
      setIsLoading(false)
      return
    }

    try {
      await updatePassword(currentPassword, newPassword, newPasswordConfirmation)
      setSuccess(true)
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setError(err.response?.data?.message || 'Password update failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    navigate('/login')
    return null
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
            Change Password
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

        {success ? (
          <Alert
            severity="success"
            sx={{ mb: 3 }}>
            Password updated successfully! You&apos;ll be redirected to login shortly.
          </Alert>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              margin="normal"
              inputProps={{ minLength: 6 }}
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              margin="normal"
              inputProps={{ minLength: 6 }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              required
              margin="normal"
              inputProps={{ minLength: 6 }}
            />

            <Box
              sx={{display: 'flex',
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
                startIcon={isLoading ? <CircularProgress
                  size={20}
                  color="inherit" /> : <Lock />}
                sx={{ py: 1.5 }}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>

          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default UpdatePassword