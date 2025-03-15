import React from 'react'
import { TfiFaceSad } from "react-icons/tfi";


const NotEnoughDataWarning = () => {
    return (
        <div className="not_enough_data_warning">
            <TfiFaceSad style={{ fontSize: "60px", marginBottom: "15px" }} />
            <p>Not Enough Data</p>
            <span>If connected, it may take few minutes/page refresh to show</span>
        </div>
    )
}

export default NotEnoughDataWarning