import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/ContextAPI.jsx'
import { Bounce, ToastContainer } from 'react-toastify'


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/threat-intelligence", element: <ThreatIntelligence /> },
//       { path: "/traffic", element: <Traffic /> },
//       { path: "/scan", element: <Scan /> }
//     ]
//   },
//   // {
//   //   path: "*",
//   //   element: <NotFound />
//   // }
// ]);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AppProvider>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </BrowserRouter>
  </AppProvider>
  // </StrictMode >,
)
