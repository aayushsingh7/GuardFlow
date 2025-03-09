import React, { useState } from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";

import styles from "../styles/Box.module.css"

const Box = ({ packageName, data }) => {
    const [show, setShow] = useState(false)
    // console.log(data)
    return (
        <div className={styles.box}>
            <div className={styles.box_header}>
                <div>
                    <h4>{packageName}</h4>
                    <p>({data.length} Vulerabilities)</p>
                </div>
                <button onClick={() => setShow(!show)}>{show ? "Hide" : "View"} Details</button>
            </div>

            <div className={styles.detials} style={{ overflow: "hidden", height: show ? "auto" : "0px" }}>
                <table>
                    <tr>
                        <th>Package Version</th>
                        <th>Vulnerability</th>
                        <th>severity</th>
                        <th>Fixed Version</th>
                    </tr>
                    {data.map((detail) => {
                        console.log("DETAILS IN HERE", detail)
                        return (
                            <tr>
                                <td>{detail.package}</td>
                                <td>{detail.title}</td>
                                <td>{detail.severity}</td>
                                <td>{detail.fixedIn[0]}</td>
                            </tr>
                        )
                    })}

                </table>
            </div>


            {/* <div>
                <span className={styles.danger}>{dangerVersion}</span>
                <span className={styles.dec}><FaLongArrowAltRight /></span>
                <span className={styles.safe}>{secureVersion}</span>
            </div> */}
        </div>
    )
}

export default Box