import React from 'react'
import styles from "../styles/Section.module.css"

const Section = ({ heading, marginReq = true, cols, children }) => {
    return (
        <section className={styles.section} style={{ marginTop: marginReq ? "30px" : "0px" }}>
            {heading && <h2>{heading}</h2>}
            <div className={styles.content_grid} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {children}
            </div>
        </section>

    )
}

export default Section