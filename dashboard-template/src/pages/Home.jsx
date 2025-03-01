import React from 'react'
import Page from '../components/Page'
// import styles from "../styles/Home.module.css"
import Section from '../components/Section'
import AreaChart from '../components/charts/AreaChart'
import SectionDiv from '../components/SectionDiv'
import BarChart from '../components/charts/BarChart'
import MarkdownPreview from "@uiw/react-markdown-preview"
import LineChart from '../components/charts/LineChart'
import Box from '../components/Box'

const Home = () => {
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
            <h1>Overview</h1>
            <Section heading={"AI Overview"} cols={1}>
                <SectionDiv>
                    <div data-color-mode="light" style={{ paddingBottom: "15px" }}>
                        <MarkdownPreview source={source} />
                    </div>
                </SectionDiv>
            </Section>

            <Section heading={"Traffic Overview"} cols={1}>
                <Section cols={2} marginReq={false}>
                    <SectionDiv heading={"Request Per Minute (1 hour)"} data-color-mode="light">
                        <LineChart />
                    </SectionDiv>
                    <SectionDiv heading={"Most Used Routes (Today)"}>
                        <BarChart />
                    </SectionDiv>
                </Section>
                <SectionDiv heading={"Request Per Hour (Today)"}>
                    <AreaChart />
                </SectionDiv>
            </Section>

            <Section heading={"Scan Overview"} cols={2}>
                <SectionDiv heading={"Vulnerable Dependencies"}>
                    <Box packageName={"react-router-dom"} dangerVersion={"6.0.0"} secureVersion={"6.7.0"} />
                    <Box packageName={"axios"} dangerVersion={"0.21.0"} secureVersion={"0.21.1"} />
                    <Box packageName={"jsonwebtoken"} dangerVersion={"8.5.1"} secureVersion={"9.0.0"} />
                    <Box packageName={"lodash"} dangerVersion={"4.17.19"} secureVersion={"4.17.21"} />
                </SectionDiv>

                <SectionDiv heading={"Vulnerable Open-Source Packages"}>
                    <Box packageName={"event-stream"} dangerVersion={"3.3.6"} secureVersion={"Deprecated - Remove"} />
                    <Box packageName={"marked"} dangerVersion={"4.0.9"} secureVersion={"4.0.10"} />
                    <Box packageName={"serve"} dangerVersion={"11.3.2"} secureVersion={"13.0.2"} />
                    <Box packageName={"tar"} dangerVersion={"4.4.17"} secureVersion={"6.1.11"} />
                    <Box packageName={"css-what"} dangerVersion={"5.0.0"} secureVersion={"6.0.1"} />
                </SectionDiv>


                <SectionDiv heading={"Open Port(s)"}>

                </SectionDiv>
            </Section>
        </Page>
    )
}

export default Home