import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home.jsx'
import ThreatIntelligence from './pages/ThreatIntelligence.jsx'
import Traffic from './pages/Traffic.jsx'
import Scan from './pages/Scan.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/threat-intelligence", element: <ThreatIntelligence /> },
      { path: "/traffic", element: <Traffic /> },
      { path: "/scan", element: <Scan /> }
    ]
  },
  // {
  //   path: "*",
  //   element: <NotFound />
  // }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
