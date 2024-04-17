import { UserDataModel } from '../models/UserModels'
import { LoginFormInputs, RegisterFormInputs } from '../models/FormInputsModels'
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../services/AuthService'
import { toast } from 'react-toastify'
import React from 'react'
import axios, { AxiosResponse } from 'axios'

type UserContextType = {
  user: UserDataModel | null
  registerUser: (inputs: RegisterFormInputs) => void
  loginUser: (inputs: LoginFormInputs) => void
  logout: () => void
  isLoggedIn: () => boolean
}

type Props = {
  children: React.ReactNode
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDataModel | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const userDataString = localStorage.getItem('user')
    const userData: UserDataModel = userDataString
      ? JSON.parse(userDataString)
      : {}
    if (userData) {
      setUser(userData)
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + userData!.token
      axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    }
    setIsLoaded(true)
  }, [])

  const loginUser = async (inputs: LoginFormInputs) => {
    await loginApi(inputs)
      .then((response) => {
        if (response?.status === 200) {
          handleResponse(response)
        }
      })
      .catch((error) => toast.warning(error))
  }

  const registerUser = async (inputs: RegisterFormInputs) => {
    await registerApi(inputs)
      .then((response) => {
        if (response?.status === 200) {
          handleResponse(response)
        }
      })
      .catch((error) => toast.warning(error))
  }

  const handleResponse = (
    response: AxiosResponse<UserDataModel, any>
  ): void => {
    localStorage.setItem('user', JSON.stringify(response.data))
    setUser(response.data)
    axios.defaults.headers.common['Authorization'] =
      'Bearer ' + response.data.token
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    toast.success('Success.')
    navigate(`/uid/${response.data.id}/inbox`)
  }

  const isLoggedIn = () => {
    return !!user?.token
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <UserContext.Provider
      value={{ loginUser, registerUser, user, isLoggedIn, logout }}
    >
      {isLoaded ? children : null}
    </UserContext.Provider>
  )
}

export const useAuth = () => React.useContext(UserContext)
