import React from 'react'
import { Outlet } from 'react-router-dom'
import SideNav from './layouts/SideNav'

const App = () => {
  return (
    <div className='app'>
      <SideNav/>
      <Outlet />
    </div>
  )
}

export default App