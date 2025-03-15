import React, { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
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
  const { setVerify, verify, setRequestPerMinFunc, setRequestOverFiveHoursFunc, currHourTrafficData, setRoutesRequestsFunc, isServerConnected, setIsServerConnected, setNewReportsAvailable } = useAppContext()

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`)
    let currMinData = []
    socket.on("push_scan_results", (report) => {
      console.log("----------------------push_scan_results------------------", report)
      setNewReportsAvailable(true)
    })
    socket.on("main_server_status", (connectionStatus) => {

      setIsServerConnected(connectionStatus)
    })
    socket.on("current_hour_data", (data) => {
      for (let minData of Object.entries(data.breakdown)) {
        currMinData.push({
          minute: `${data.hour < 10 ? `0${data.hour}` : data.hour}:${minData[0] < 10 ? "0" + minData[0] : minData[0]} m`,
          requests: minData[1]
        })
      }

      setRequestPerMinFunc(currMinData, "new")
      setRequestOverFiveHoursFunc(currMinData, "new")
      setRoutesRequestsFunc(data.trafficPerRoutes, "old")
    })
    // setRequestPerMinFunc(data, "new")
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
    setVerify(true)
  }, [])

  return (
    <div className='app'>
      {!isServerConnected && <div className="server_error">
        Connection to the main server is required to access the dashboard and its features.
        <Link style={{ marginLeft: "7px" }} to="">Refer to README.md for setup instructions.</Link>
      </div>}
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