import React, { useEffect, useState } from 'react'
import Page from '../components/Page'
// import styles from "../styles/Home.module.css"
import Section from '../components/Section'
import AreaChart from '../components/charts/AreaChart'
import SectionDiv from '../components/SectionDiv'
import BarChart from '../components/charts/BarChart'
import MarkdownPreview from "@uiw/react-markdown-preview"
import LineChart from '../components/charts/LineChart'
import Box from '../components/Box'
import getStartAndEndTime from '../utils/getStartAndEndTime'

const Home = () => {

    const [routesRequest, setRoutesRequest] = useState([]);
    const [requestPerMin, setRequestPerMin] = useState([]);
    const [requestPerHour, setRequestPerHour] = useState([]);
    const [aiSummary, setAiSummary] = useState("")
    const [scanReports, setScanReports] = useState({});
    const [summary, setSummary] = useState("")

    const fetchTrafficOverview = async () => {
        const { startTime, endTime } = getStartAndEndTime();
        try {
            const getData = await fetch(`http://localhost:4000/api/v1/traffic/overview?organizationID=67c8709bc4fc2c40a1b53be2&startTime=${startTime}&endTime=${endTime}`, {
                method: "GET",
                credentails: "include",
                headers: { "Content-Type": "application/json" }
            })
            let response = await getData.json();
            let routeTraffic = {}
            response.data[0].trafficOverview.map((data) => {
                setRequestPerHour((old) => {
                    return [...old, { hour: data.hour <= 12 ? `${data.hour} AM` : `${data.hour} PM`, requests: data.totalRequests }]
                })
            })
            const lastData = response.data[0].trafficOverview[response.data[0].trafficOverview.length - 1];

            setRequestPerMin(Object.entries(lastData.breakdown).map((detail) => ({
                minute: `00:${detail[0] < 10 ? "0" + detail[0] : detail[0]} m`,
                requests: detail[1]
            })))

        } catch (error) {
            console.log(error)
        }
    }

    const fetchRoutesTraffic = async () => {
        const { startTime, endTime } = getStartAndEndTime()
        try {
            const response = await fetch(`http://localhost:4000/api/v1/traffic/routes-overview?organizationID=67c8709bc4fc2c40a1b53be2&startTime=${startTime}&endTime=${endTime}`, {
                method: "GET",
                credentails: "include",
                headers: { "Content-Type": "application/json" }
            })
            let data = await response.json()
            setRoutesRequest(data.data.map((info) => {
                return { name: info.route, uv: info.totalRequests }
            }))
        } catch (err) {
            console.log(err)
        }
    }

    const aiTrafficSummary = async () => {
        const { startTime, endTime } = getStartAndEndTime()
        try {
            const response = await fetch(`http://localhost:4000/api/v1/ai/traffic-summary?organizationID=67c8709bc4fc2c40a1b53be2&startTime=${startTime}&endTime=${endTime}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })
            const data = await response.json();
            setAiSummary(data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchScanResults = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/reports/latest-report?organizationID=67c8709bc4fc2c40a1b53be2&startTime=2025-03-05T00:00:00&endTime=2025-03-07T23:59:59`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })
            const data = await response.json();
            data.data.vulnerabilities.map((pk) => {
                if (scanReports[pk.packageName]) {
                    scanReports[pk.packageName].push({
                        package: pk.version,
                        title: pk.title,
                        severity: pk.severity,
                        fixedIn: pk.fixedIn,
                    })
                } else {
                    scanReports[pk.packageName] = [{
                        package: pk.version,
                        title: pk.title,
                        severity: pk.severity,
                        fixedIn: pk.fixedIn,
                    }]
                }
            })

            setSummary(data.data.summary)
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        fetchTrafficOverview();
        fetchRoutesTraffic();
        aiTrafficSummary()
        fetchScanResults();
    }, [])
    return (
        <Page>
            <h1>Overview</h1>
            <Section heading={"AI Overview"} cols={1}>
                <SectionDiv>
                    <div data-color-mode="light" style={{ paddingBottom: "15px" }}>
                        <MarkdownPreview source={aiSummary.slice(5, -3)} />
                    </div>
                </SectionDiv>
            </Section>

            <Section heading={"Traffic Overview"} cols={1}>
                <Section cols={2} marginReq={false} >
                    <SectionDiv heading={"Request Per Minute (1 hour)"} data-color-mode="light">
                        {requestPerMin && <LineChart data={requestPerMin} />}
                    </SectionDiv>
                    <SectionDiv heading={"Most Used Routes (Today)"}>
                        {routesRequest && <BarChart data={routesRequest} />}
                    </SectionDiv>
                </Section>
                <SectionDiv heading={"Request Per Hour (Today)"}>
                    {requestPerHour && <AreaChart data={requestPerHour} />}
                </SectionDiv>
            </Section>

            <Section heading={"Scan Overview"} cols={1}>
                <SectionDiv heading={summary}>

                    {Object.entries(scanReports)?.map((obj) => {
                        // console.log("THIS IS OBJECT", obj[0], obj[1])
                        return <Box packageName={obj[0]} data={obj[1]} />
                    })}
                </SectionDiv>
            </Section>
        </Page>
    )
}

export default Home