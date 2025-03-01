import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";

import styles from "../styles/Box.module.css"

const Box = ({ packageName, dangerVersion, secureVersion }) => {
    return (
        <div className={styles.box}>
            <h4>{packageName}</h4>
            <div>
                <span className={styles.danger}>{dangerVersion}</span>
                <span className={styles.dec}><FaLongArrowAltRight /></span>
                <span className={styles.safe}>{secureVersion}</span>
            </div>
        </div>
    )
}

export default Box