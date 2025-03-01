import React, { useState } from 'react'
import styles from "../styles/SideNav.module.css"
import { Link } from 'react-router-dom'

const SideNav = () => {
    const [showSideNav, setShowSideNav] = useState(false)
    return (
        <nav className={`${styles.sidenav} ${styles.show}`}>
            <div>
                <h2>DocxAI </h2>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/threat-intelligence">Threat Intelligence</Link></li>
                    <li><Link to="/traffic">Traffic Analysis</Link></li>
                    {/* <li><Link to="/scan">Network Scanner</Link></li> */}
                </ul>
            </div>



        </nav>
    )
}

export default SideNav