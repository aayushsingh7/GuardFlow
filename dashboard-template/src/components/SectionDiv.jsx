import React from 'react'
import styles from "../styles/SectionDiv.module.css"


const SectionDiv = ({ heading, children }) => {
    return (
        <div className={styles.section_div}>
            <h3>{heading}</h3>
            <div className={styles.div_content}>
                {children}
            </div>
        </div>
    )
}

export default SectionDiv