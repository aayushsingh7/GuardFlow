import React, { useState } from 'react'
import Page from '../components/Page'
import Section from '../components/Section'
import SectionDiv from '../components/SectionDiv'
import MarkdownPreview from "@uiw/react-markdown-preview"
import styles from "../styles/ThreatIntelligence.module.css"

const ThreatIntelligence = (e) => {
    const [message, setMessages] = useState([{
        role: "assistant", msg: `
## Hey There!, how can i help you today?
- Do you want me summerize today's tarffic behavior?
- Do you want me to compare traffic data?
- Do you want me to analysze vulnerability in your packages?
- Do you want me to give you any suggestion?

### Please feel free to ask me about anything🙌.
`}])
    const [userPrompt, setUserPrompt] = useState("")

    const sendMessage = async (e) => {
        if (e.key == "Enter") {
            console.log("function triggered")
            let prompt = userPrompt;
            setMessages((messages) => {
                return [...messages, {
                    role: "user",
                    msg: userPrompt
                }]
            })
            setUserPrompt("")
            try {
                const response = await fetch(`http://localhost:4000/api/v1/ai/chat`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        userPrompt: prompt,
                        startTime: "2025-03-05T00:00:00",
                        endTime: "2025-03-05T12:00:00",
                        organizationID: "67c8709bc4fc2c40a1b53be2",
                        hour: 4,
                        route: "users"
                    })

                })
                let data = await response.json()
                setMessages((messages) => {
                    return [...messages, {
                        role: "assistant",
                        msg: data.data
                    }]
                })
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <Page>
            <h1>Threat Intelligence</h1>
            <div className={styles.ai_chat}>
                {/* <div className={styles.chat}> */}

                <div data-color-mode="light">
                    {
                        message.map((message) => {
                            return <MarkdownPreview source={message.msg} style={{ padding: "15px", border: message.role == "user" ? "4px solid blue" : "4px solid red" }} />
                        })
                    }
                    {/* <MarkdownPreview source={o} style={{ padding: "15px" }} /> */}
                    {/* <MarkdownPreview source={e} style={{ padding: "15px" }} /> */}
                    {/* <MarkdownPreview source={source} style={{ padding: "15px" }} /> */}
                </div>

                {/* </div> */}
            </div>
            <input className={styles.input} placeholder='Ask Me Anything...' onKeyDown={(e) => sendMessage(e)} onChange={(e) => setUserPrompt(e.target.value)} value={userPrompt} />
        </Page>
    )
}

export default ThreatIntelligence