import React, { useState } from 'react'
import styles from "../styles/LoginAndRegister.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/ContextAPI'

const Login = () => {
    const navigate = useNavigate()
    const { setOrganization } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const login = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orgs/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email, password
                })
            })
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setOrganization(data.org)
                navigate("/profile")
            }

        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    return (
        <div className={styles.container}>

            <form onSubmit={(e) => e.preventDefault()}>
                <h2>Login To Continue</h2>
                <div className={styles.input_feilds}>
                    <input required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" type="text" placeholder='Enter Organization Email' />
                    <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter  Password' autoComplete='off' />
                </div>
                <div className={styles.btn_con}>
                    <button onClick={login} disabled={loading}>{loading ? "Logging..." : "Login"}</button>

                    <p>Don't have any account? <Link to={"/register"}>Register</Link></p>
                </div>
            </form>


        </div>
    )
}

export default Login