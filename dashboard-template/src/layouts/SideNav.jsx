import React, { useEffect, useState } from 'react'
import styles from "../styles/SideNav.module.css"
import { Link, useNavigate } from 'react-router-dom'

const SideNav = () => {
    const [selectedRoute, setSelectedRoute] = useState("/")
    useEffect(() => {
        setSelectedRoute(location.pathname)
        console.log(selectedRoute.length)
    }, [location.pathname])
    return (
        <nav className={`${styles.sidenav} ${styles.show}`}>
            <div>
                <h2>GuardFlow </h2>
                <ul>
                    <li style={{ background: (selectedRoute == "/" && selectedRoute.length == 1) ? "#efefef" : "#ffffff" }} ><Link to="/">Home</Link></li>
                    <li style={{ background: selectedRoute == "/threat-intelligence" ? "#efefef" : "#ffffff" }}><Link to="/threat-intelligence">Threat Intelligence</Link></li>
                    <li style={{ background: selectedRoute == "/traffic" ? "#efefef" : "#ffffff" }}><Link to="/traffic">Traffic Analysis</Link></li>
                    <li style={{ background: selectedRoute == "/profile" ? "#efefef" : "#ffffff" }}><Link to="/profile">Profile</Link></li>
                </ul>
            </div>



        </nav>
    )
}

export default SideNav