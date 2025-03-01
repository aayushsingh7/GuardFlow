import React from 'react'
import Page from '../components/Page'
import Section from '../components/Section'
import SectionDiv from '../components/SectionDiv'
import MarkdownPreview from "@uiw/react-markdown-preview"
import styles from "../styles/ThreatIntelligence.module.css"

const ThreatIntelligence = () => {
    const source = `
## 📌 Potential Causes
- **SQL Injection (SQLi)** – Exploiting database vulnerabilities.  
- **DDoS Attack** – Overloading server resources.  
- **Credential Stuffing** – Using leaked credentials for unauthorized access.  

## 🎯 Attacker Motives
- **Data Theft** – Stealing sensitive information.  
- **Service Disruption** – Crippling website functionality.  
- **Ransom/Extortion** – Demanding payment to stop the attack.    
`
    return (
        <Page>
            <h1>Threat Intelligence</h1>
            <div className={styles.ai_chat}>
                {/* <div className={styles.chat}> */}

                <div data-color-mode="light">
                    <MarkdownPreview source={source} style={{ padding: "15px" }} />
                    <MarkdownPreview source={source} style={{ padding: "15px" }} />
                    <MarkdownPreview source={source} style={{ padding: "15px" }} />
                </div>

                {/* </div> */}
            </div>
            <input className={styles.input} placeholder='Ask Me Anything...' />
        </Page>
    )
}

export default ThreatIntelligence