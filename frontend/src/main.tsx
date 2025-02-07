import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Feed } from './features/feed/pages/Feed/Feed'
import { Login } from './features/authentication/pages/Login/Login'
import { Signup } from './features/authentication/pages/Signup/Signup'
import { ResetPassword } from './features/authentication/pages/ResetPassword/ResetPassword'

import { AuthenticationContextProvider } from './features/authentication/contexts/AuthenticationContextProvider'
import { ApplicationLayout } from './components/ApplicationLayout/ApplicationLayout'
import { AuthenticationLayout } from './features/authentication/components/AuthenticationLayout/AuthenticationLayout'
import { Profile } from './features/authentication/pages/Profile/Profile'
import { VerifyEmail } from './features/authentication/pages/VerifyEmail/VerifyEmail'


const router = createBrowserRouter([
  {
    element: <AuthenticationContextProvider/>,
    
    children: [
      {
        path: "/",
        element: <ApplicationLayout />,
        children: [
          {
            index: true,
            element: <Feed />
          },
          {
            path: "friends",
            element: <div>Friends</div>
          },
          {
            path: "messages",
            element: <div>Messages</div>
          },
          {
            path: "notifications",
            element: <div>notifications</div>
          },
          {
            path: "profile/:id",
            element: <div>Profile</div>
          },
          {
            path: "settings",
            element: <div>Settings</div>
          },

        ]
      },
      {
        path: "/authentication",
        element: <AuthenticationLayout />,
        children:[
          {
            path:"login",
            element: <Login />,
          },
          {
            path:"signup",
            element: <Signup />
          },
          {
            path:"request-password-reset",
            element: <ResetPassword />
          },
          {
            path:"profile/:id",
            element: <Profile />
          },
          {
            path:"verify-email",
            element: <VerifyEmail />
          },
          
        ]
      },
      {
        path:"*",
        element: <Navigate to="/" />
      }

    ]
  }
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router = {router}>

    </RouterProvider>
  </StrictMode>,
);
