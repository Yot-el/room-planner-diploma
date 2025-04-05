import { useState, useRef } from 'react'
import { useAuth } from '../../../context/authContext'
import axios from 'axios'
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  IconButton
} from '@mui/material'
import { Edit, Cancel, Save, Logout, Password } from '@mui/icons-material'
import { User } from '@/types/authTypes'
import { useNavigate } from 'react-router'

const Account = () => {
  const { token, logout, user, setUser } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [tempUser, setTempUser] = useState<User | null>({ ...user })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempUser(prev => ({ ...prev,
      [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('name', tempUser.name)
      formData.append('email', tempUser.email)

      if (fileInputRef.current?.files?.[0]) {
        formData.append('photo', fileInputRef.current.files[0])
      }

      const response = await axios.patch(
        'http://localhost:3000/users/updateMe',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('data from profile: ', response.data)

      setUser(response.data.user)
      setTempUser(response.data.user)
      setSuccess('Profile updated successfully!')
      setEditMode(false)
      setImagePreview('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTempUser(user)
    setEditMode(false)
    setImagePreview('')
    setError('')
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 4 }}>
        <Box
          sx={{ display: 'flex',
            justifyContent: 'space-between',
            mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            color="primary">
            Your Profile
          </Typography>
          <Button
            startIcon={<Logout />}
            onClick={logout}
            color="error"
            variant="outlined"
          >
            Logout
          </Button>
        </Box>

        <Box
          sx={{ display: 'flex',
            flexDirection: { xs: 'column',
              md: 'row' },
            gap: 4 }}>
          {/* Profile Photo Section */}
          <Box
            sx={{ display: 'flex',
              flexDirection: 'column',
              alignItems: 'center' }}>
            <IconButton
              onClick={editMode ? triggerFileInput : undefined}
              sx={{ p: 0 }}>
              <Avatar
                src={imagePreview || user?.photo}
                sx={{
                  width: 150,
                  height: 150,
                  fontSize: '3rem',
                  border: '3px solid',
                  borderColor: 'primary.main'
                }}
              >
                {!imagePreview && !user?.photo && user?.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            {editMode && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <Button
                  variant="text"
                  color="primary"
                  onClick={triggerFileInput}
                  sx={{ mt: 2 }}
                >
                  Change Photo
                </Button>
              </>
            )}
          </Box>

          {/* Profile Details Section */}
          <Box sx={{ flexGrow: 1 }}>
            {editMode ? (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={tempUser.name}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={tempUser.email}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="h6">{user?.name}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="h6">{user?.email}</Typography>
                </Box>
              </>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary">
                Role
              </Typography>
              <Chip
                label={user?.role}
                color="primary"
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary">
                Status
              </Typography>
              <Chip
                label={user?.active ? 'Active' : 'Inactive'}
                color={user?.active ? 'success' : 'default'}
              />
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{ display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4 }}>
          {editMode ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Box sx={{display: 'flex', gap: '10px'}}>
              <Button
                variant="contained"
                startIcon={<Password />}
                onClick={() => navigate('/update-password')}
              >
                Update Password
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
              >
              Edit Profile
              </Button>
            </Box>
          )}
        </Box>

        {/* navigate("/update-password") */}

        {/* Status Messages */}
        {error && (
          <Alert
            severity="error"
            sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}
      </Paper>
    </Container>
  )
}

export default Account