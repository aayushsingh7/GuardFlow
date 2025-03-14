import React, { useEffect, useRef } from 'react'
import { Route, Routes } from 'react-router-dom'
import io from "socket.io-client"
import SideNav from './layouts/SideNav'
import Home from './pages/Home.jsx'
import ThreatIntelligence from './pages/ThreatIntelligence.jsx'
import Traffic from './pages/Traffic.jsx'
// import Scan from './pages/Scan.jsx'
import { useAppContext } from './context/ContextAPI.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Verify from './layouts/Verify.jsx'

const App = () => {
  const { setVerify, verify, setRequestPerMinFunc, setRequestOverFiveHoursFunc, currHourTrafficData, setRoutesRequestsFunc } = useAppContext()
  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`)
    socket.on("req_per_minute", (data) => {

      // if(data)
      setRequestPerMinFunc(data, "old")
      setRequestOverFiveHoursFunc(data, "old")

      // { name: info.route, uv: info.totalRequests, value: info.totalRequests }
      setRoutesRequestsFunc(data.routesTraffic, "old")


      // console.log(data)
      // console.log(currHourTrafficData)
      // setRequestPerHourFunc(data)

      // setRequestPerMin((oldData) => {
      //   return [...oldData, {
      //     minute: data.time,
      //     requests: data.requests
      //   }]
      // })

      // routesReqestsData((oldData)=> {

      // })
    })
    socket.on("req_per_hour", (data) => {
      console.log("REQUEST PER HOUR: ", data)
    })
  }, [])

  useEffect(() => {
    console.log("Now inside currHourTrafficData", currHourTrafficData)
  }, [currHourTrafficData])

  useEffect(() => {
    setVerify(true)
  }, [])

  return (
    <div className='app'>
      {verify && <Verify />}
      <Routes>
        <Route path="/" element={
          <>
            <SideNav />
            <Home />
          </>
        } />
        <Route path="/threat-intelligence" element={
          <>
            <SideNav />
            <ThreatIntelligence />
          </>
        } />
        <Route path="/traffic" element={
          <>
            <SideNav />
            <Traffic />
          </>
        } />
        <Route path="/profile" element={
          <>
            <SideNav />
            <Profile />
          </>
        } />
        {/* <Route path="/scan" element={<Scan />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  )
}

export default App