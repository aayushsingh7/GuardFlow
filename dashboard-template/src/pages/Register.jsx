import React, { useState } from 'react'
import styles from "../styles/LoginAndRegister.module.css"
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/ContextAPI'

const Register = () => {
    const { setOrganization } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState("")
    const [name, setName] = useState("")

    const register = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orgs/register`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email, password, name, location
                })
            })
            const data = await response.json();
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
                <h2>Register To Continue</h2>
                <div className={styles.input_feilds}>
                    <input required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" type="text" placeholder='Enter Organization Email' />
                    <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" type="text" placeholder='Enter Organization Username' />
                    <input required value={location} onChange={(e) => setLocation(e.target.value)} autoComplete="off" type="text" placeholder='Enter Organization Location' />
                    <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter Password' autoComplete='off' />
                </div>
                <div className={styles.btn_con}>
                    <button onClick={register} disabled={loading}>{loading ? "Registering..." : "Register"}</button>

                    <p>Already have any account? <Link to={"/login"}>Login</Link></p>
                </div>
            </form>


        </div>
    )
}

export default Register