import React, { useState } from 'react'
import styles from "../styles/DropDown.module.css"

const DropDown = ({ options, selectedRoute, handleSelectedOption }) => {
    const [showDropDown, setShowDropDown] = useState(false)
    return (
        <div className={`${styles.drop_down} ${showDropDown && styles.active_shadow}`} onClick={() => setShowDropDown(!showDropDown)}>
            <div className={`${styles.selected} ${showDropDown && styles.active}`}>{selectedRoute}</div>
            {showDropDown && <ul className={styles.options}>
                {options.map((option, index) => {
                    if (option != selectedRoute) {
                        return <li key={`${option}-${index}`} onClick={() => handleSelectedOption(() => option)}>{option}</li>
                    }
                })}
            </ul>}
        </div>
    )
}

export default DropDown