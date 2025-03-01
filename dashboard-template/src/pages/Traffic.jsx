import React from 'react'
import Page from '../components/Page'
import Section from "../components/Section"
import SectionDiv from "../components/SectionDiv"
import LineChart from "../components/charts/LineChart"
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'

const Traffic = () => {
    const source = `
# 🚨 Website Traffic Surge - Potential Security Threat

## 📌 Potential Causes
- **SQL Injection (SQLi)** – Exploiting database vulnerabilities.  
- **DDoS Attack** – Overloading server resources.  
- **Credential Stuffing** – Using leaked credentials for unauthorized access.  

## 🎯 Attacker Motives
- **Data Theft** – Stealing sensitive information.  
- **Service Disruption** – Crippling website functionality.  
- **Ransom/Extortion** – Demanding payment to stop the attack.  

## 🔧 Immediate Actions
- 🔍 **Check logs** for suspicious activity.  
- 🛡 **Enable WAF (Web Application Firewall).**  
- 🔒 **Secure database** with proper input sanitization.  
- 🚫 **Block suspicious traffic** and apply rate limiting.  

⚠ **Take immediate action to prevent further damage!**  
`
    return (
        <Page>
            <h1>Traffic Analysis</h1>
            <Section cols={1} heading={"Overall Traffic Overview"}>
                <SectionDiv heading={"Request Per Minute (5 hrs)"}>
                    <LineChart />
                </SectionDiv>

                <SectionDiv heading={"Request Per Hour (24 Hrs)"}>
                    <AreaChart />
                </SectionDiv>
            </Section>


            <Section cols={2} heading={"Traffic Per Routes"}>
                <SectionDiv heading={"Traffic Per Routes (Today)"}>
                    <BarChart />
                </SectionDiv>

                <SectionDiv heading={"Traffic Contribution Per Routes"}>
                    {/* < /> */}
                    <PieChart />
                </SectionDiv>
            </Section>

        </Page>
    )
}

export default Traffic