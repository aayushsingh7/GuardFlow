import React, { useEffect, useRef, useState } from 'react';
import Page from '../components/Page';
import Section from '../components/Section';
import SectionDiv from '../components/SectionDiv';
import MarkdownPreview from '@uiw/react-markdown-preview';
import styles from '../styles/ThreatIntelligence.module.css';
import { useAppContext } from '../context/ContextAPI';

const ThreatIntelligence = (e) => {
    const { currHourTrafficData, organization } = useAppContext();
    const messageRef = useRef();
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            msg: `
## Hello! How can I assist you today?
- Would you like a **summary of today's traffic patterns**?
- Do you need a **comparison of traffic data**?
- Should I **analyze vulnerabilities in your packages**?
- Are you looking for **recommendations or insights**?
    
### Feel free to ask me anything. I'm here to help! 🚀
`,
        },
    ]);
    const [userPrompt, setUserPrompt] = useState('');

    const sendMessage = async (e) => {
        setLoading(true)
        if (e.key === 'Enter') {
            console.log('function triggered');
            let prompt = userPrompt;
            setMessages((messages) => [
                ...messages,
                {
                    role: 'user',
                    msg: userPrompt,
                },
            ]);
            setUserPrompt('');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        userPrompt: `
${prompt}

### Current Hour Traffic Data so Far
${JSON.stringify(currHourTrafficData)}
`,
                        organizationID: organization._id,
                    }),
                });
                let data = await response.json();
                setMessages((messages) => [
                    ...messages,
                    {
                        role: 'assistant',
                        msg: data.data,
                    },
                ]);
            } catch (err) {
                console.log(err);
            }
        }
        setLoading(false)
    };

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length]);

    return (
        <Page>
            <h1>Threat Intelligence</h1>
            <div className={styles.ai_chat}>
                <div data-color-mode='light'>
                    {messages.map((message, index) => {
                        if (message.role === 'user') {
                            return (
                                <div key={index} className={styles.user_message}>
                                    <div>{message.msg}</div>
                                </div>
                            );
                        } else {
                            return (
                                <MarkdownPreview
                                    key={index}
                                    source={message.msg}
                                    style={{
                                        padding: '15px',
                                        marginTop: '10px',
                                        borderRadius: '10px',
                                        borderBottomLeftRadius: '0px',
                                    }}
                                />
                            );
                        }
                    })}
                    {loading && <div className={styles.ai_typing}><p className='loader_2'></p> Bruno is thinking...</div>}
                    <div ref={messageRef}></div>
                </div>
            </div>
            <input
                className={styles.input}
                placeholder='Ask Me Anything...'
                onKeyDown={(e) => sendMessage(e)}
                onChange={(e) => setUserPrompt(e.target.value)}
                value={userPrompt}
            />
        </Page>
    );
};

export default ThreatIntelligence;