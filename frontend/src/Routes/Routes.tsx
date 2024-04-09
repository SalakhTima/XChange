import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import LoginPage from '../pages/LoginPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ path: 'login', element: <LoginPage /> }]
  }
])
