import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import axios from 'axios'
import { User } from '@/types/authTypes'

interface AuthContextType {
  token: string | null;
  user: User | null;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: ( currentPassword: string, newPassword: string, newPasswordConfirmation: string) => Promise<void>;
  forgotPassword: ( email: string ) => Promise<void>;
  resetPassword: ( password: string, passwordConfirmation: string, token: string ) => Promise<void>;
  signup: (FormDataToSend: FormData) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const userString = localStorage.getItem('user')
    if (storedToken && userString) {
      const storedUser: User = JSON.parse(userString) as User
      setToken(storedToken)
      setUser(storedUser)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3000/users/login', {
      email,
      password
    }, {
      withCredentials: true
    })

    console.log(response.data)

    const receivedToken: string = response.data.token as string
    const receivedUser: User = response.data.data.user as User
    setToken(receivedToken)
    setUser(receivedUser)
    localStorage.setItem('token', receivedToken)
    localStorage.setItem('user', JSON.stringify(receivedUser))
  }

  const resetPassword = async (password: string, passwordConfirmation: string, token: string) => {
    await axios.patch(
      `http://localhost:3000/users/resetPassword/${token}`,
      { password,
        passwordConfirmation })
  }


  const forgotPassword = async (email: string) => {
    await axios.post('http://localhost:3000/users/forgotPassword', { email })
  }

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) => {
    await axios.patch(
      `http://localhost:3000/users/updatePassword`,
      { currentPassword,
        newPassword,
        newPasswordConfirmation },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    )
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const signup = async (formDataToSend: FormData) => {
    await axios.post('http://localhost:3000/users/signup', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{ token,
        user,
        setUser,
        signup,
        login,
        logout,
        updatePassword,
        forgotPassword,
        resetPassword,
        isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}