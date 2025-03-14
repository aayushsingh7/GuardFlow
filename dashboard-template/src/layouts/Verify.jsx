import React, { useEffect } from 'react'
import { useAppContext } from '../context/ContextAPI'
import { useNavigate } from 'react-router-dom'
import Notification from '../utils/notification'

const Verify = () => {
    const navigate = useNavigate()
    const { setVerify, setOrganization } = useAppContext()

    const authenticateUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orgs/auth`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })
            const data = await response.json()
            if (response.status == 200) {
                setOrganization(data.org)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (err) {
            Notification.error("Oops! something went wrong, try again later")
            navigate("/login")
        }
        setVerify(false)
    }

    useEffect(() => {
        authenticateUser()
    }, [])
    return (
        <div className='verify'>
            <div>
                <span className='loader'></span>
                <p>Please wait, while we verify you...</p>
            </div>
        </div>
    )
}

export default Verify