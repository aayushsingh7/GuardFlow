import React, { useState, useEffect } from 'react'
import Page from '../components/Page'
import Section from "../components/Section"
import SectionDiv from "../components/SectionDiv"
import LineChart from "../components/charts/LineChart"
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import getStartAndEndTime from '../utils/getStartAndEndTime'
import { useAppContext } from '../context/ContextAPI'

const Traffic = () => {
    const { organization, requestPerHour, setRequestOverFiveHoursFunc, routesRequests, requestOverFiveHours, setRoutesRequestsFunc } = useAppContext()
    // const [routesRequest, setroutesRequest] = useState([]);
    // const [requestPerMin, setRequestPerMin] = useState([]);
    // const [requestPerHour, setRequestPerHour] = useState([]);
    // const [scanReports, setScanReports] = useState([])
    const [aiSummary, setAiSummary] = useState("")
    const [scanReports, setScanReports] = useState({});
    const [summary, setSummary] = useState("")
    const [routeData, setRouteData] = useState([])
    const [selectedRoute, setSelectedRoute] = useState("users")

    const fetchTrafficOverview = async () => {
        const { startTime, endTime } = getStartAndEndTime();
        try {
            const getData = await fetch(`${import.meta.env.VITE_API_URL}/traffic/overview?organizationID=${organization._id}&startTime=${startTime}&endTime=${endTime}`, {
                method: "GET",
                credentails: "include",
                headers: { "Content-Type": "application/json" }
            })
            let response = await getData.json();
            let newData = []
            response.data[0].trafficOverview.map((data, index) => {
                // console.log(data)
                // if ((response.data[0].trafficOverview.length) - 5 <= index) {

                newData = [...newData, ...Object.entries(data.breakdown).map((detail) => ({
                    minute: `${data.hour}:${detail[0] < 10 ? "0" + detail[0] : detail[0]} m`,
                    requests: detail[1]
                }))]

                // }
                console.log(newData)
            })
            setRequestOverFiveHoursFunc(newData, "new")
        } catch (error) {
            console.log(error)
        }
    }

    const fetchRoutesTraffic = async () => {
        const { startTime, endTime } = getStartAndEndTime();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/traffic/routes-overview?organizationID=${organization._id}&startTime=${startTime}&endTime=${endTime}`, {
                method: "GET",
                credentails: "include",
                headers: { "Content-Type": "application/json" }
            })
            let data = await response.json()
            let routesData = data.data.map((info) => {
                return { name: info.route, uv: info.totalRequests, value: info.totalRequests }
            })
            setRoutesRequestsFunc(routesData, "new")
        } catch (err) {
            console.log(err)
        }
    }

    const aiTrafficSummary = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/traffic-summary?organizationID=${organization._id}&startTime=2025-03-05T00:00:00&endTime=2025-03-06T23:59:59`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/latest-report?organizationID=${organization._id}&startTime=2025-03-05T00:00:00&endTime=2025-03-07T23:59:59`, {
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

    const getRouteDetail = async () => {
        const { startTime, endTime } = getStartAndEndTime();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/traffic/route?organizationID=${organization._id}&startTime=${startTime}&endTime=${endTime}&route=${selectedRoute}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })
            const data = await response.json();
            setRouteData(data.data[0])
            console.log(data.data[0])
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        getRouteDetail()
    }, [selectedRoute])

    useEffect(() => {
        fetchTrafficOverview();
        fetchRoutesTraffic();
        // aiTrafficSummary()
        // fetchScanResults();
    }, [])

    // useEffect(() => {
    //     console.log(requestPerMin)
    // }, [requestPerMin])

    return (
        <Page>
            <h1>Traffic Analysis</h1>
            <Section cols={1} heading={"Overall Traffic Overview"}>
                <SectionDiv heading={"Request Per Minute (5 hrs)"}>
                    <LineChart data={requestOverFiveHours} />
                </SectionDiv>

                <SectionDiv heading={"Request Per Hour (24 Hrs)"}>
                    <AreaChart data={requestPerHour} />
                </SectionDiv>
            </Section>


            <Section cols={1} heading={"Traffic Per Routes"}>
                <SectionDiv heading={"Traffic Per Routes (Today)"}>
                    <BarChart data={routesRequests} />
                </SectionDiv>

                <SectionDiv heading={"Traffic Contribution Per Routes"}>
                    {/* < /> */}
                    <PieChart data={routesRequests} />
                </SectionDiv>
            </Section>


        </Page>
    )
}

export default Traffic