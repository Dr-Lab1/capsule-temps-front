import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'


const router = createBrowserRouter([
  {
    path: "/",
    element: <BasePage />,
    children: [
      {
        path: '',
        element: <Home />
      },
      
    ]
  },
  
])

function BasePage() {

  return (
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <Outlet />
        <Footer />
      </body>
  )
}

function App() {

  return <RouterProvider router={router} />

}

export default App
