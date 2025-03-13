import React from 'react'
import styles from "../styles/Profile.module.css"
import Page from '../components/Page'
import { useAppContext } from '../context/ContextAPI'

const Profile = () => {
    const { organization } = useAppContext()
    return (
        <Page>
            <h1>Profile</h1>
            <div className={styles.profile_div}>

                <div className={styles.box}>
                    <div className={styles.feild}>
                        <span className={styles.feild_name}>Organization ID</span>
                        <span className={styles.feild_value}>{organization._id}</span>
                    </div>

                    <div className={styles.feild}>
                        <span className={styles.feild_name}>Email</span>
                        <span className={styles.feild_value}>{organization.email}</span>
                    </div>


                    <div className={styles.feild}>
                        <span className={styles.feild_name}>Name</span>
                        <span className={styles.feild_value}>{organization.name}</span>
                    </div>

                    <div className={styles.feild}>
                        <span className={styles.feild_name}>Joined On</span>
                        <span className={styles.feild_value}>{organization.createdAt}</span>
                    </div>
                </div>

            </div>
        </Page>
    )
}

export default Profile