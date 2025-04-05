import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../../context/authContext'
import type { FormData } from '../../../types/authTypes'
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
  Grid2
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const SignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    photo: '',
    role: 'user',
    password: '',
    passwordConfirmation: ''
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        email: '',
        password: ''
      }))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        setFormData(prev => ({
          ...prev,
          photo: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords don\'t match')
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('role', formData.role)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('passwordConfirmation', formData.passwordConfirmation)

      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append('photo', fileInputRef.current.files[0])
      }

      await signup(formDataToSend)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        photo: '',
        role: 'user',
        password: '',
        passwordConfirmation: ''
      })
      setPreviewImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Container
        maxWidth="sm"
        sx={{ mt: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4 }}>
        <Paper
          elevation={3}
          sx={{ p: 4,
            textAlign: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            color="primary">
            Signup Successful!
          </Typography>
          <Typography variant="body1">
            Your account has been created successfully.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 4 }}>
        <Box
          sx={{ textAlign: 'center',
            mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            color="primary">
            Create Your Account
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
        </Box>

        {error && (
          <Box
            sx={{ mb: 2,
              p: 2,
              bgcolor: 'error.light',
              borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}>
          <Grid
            container
            spacing={3}>
            {/* Photo Upload */}
            <Grid
              item
              xs={12}
              sx={{ textAlign: 'center' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <div
                style={{display: 'flex',
                  alignItems: 'center',
                  height: '80px',
                  justifyContent: 'space-between'}}>
                <label htmlFor="photo-upload">
                  <Button
                    variant="outlined"
                    component="span">
                  Choose Profile Photo
                  </Button>
                </label>
                {previewImage && (
                  <Avatar
                    src={previewImage}
                    sx={{
                      width: '80px',
                      height: '80px',
                      alignItems: 'center',
                      mx: 'auto'
                    }}
                  />
                )}
              </div>
            </Grid>

            {/* Name */}
            <Grid
              item
              xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Email */}
            <Grid
              item
              xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                autoComplete="new-email" // Disable autofill
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Password */}
            <Grid
              item
              xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                autoComplete="new-email" // Disable autofill
                onChange={handleChange}
                required
                inputProps={{ minLength: 8 }}
              />
              <FormHelperText>Minimum 8 characters</FormHelperText>
            </Grid>

            {/* Password Confirmation */}
            <Grid
              item
              xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                required
                inputProps={{ minLength: 8 }}
              />
            </Grid>

            {/* Submit Button */}


            {/* <Grid
              item
              xs={12}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ color: 'primary.main' }}
              >
            Back
              </Button>

            </Grid> */}

            <Grid
              item
              display='flex'
              justifyContent='space-between'
              xs={12}>
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
                disabled={isSubmitting}
                size="large"
                sx={{ py: 1.5 }}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>


            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default SignupForm