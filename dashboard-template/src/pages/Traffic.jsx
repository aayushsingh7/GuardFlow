import React, { useEffect, useState } from 'react'
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import LineChart from "../components/charts/LineChart"
import MultiBarChart from '../components/charts/MultiBarChart'
import PieChart from '../components/charts/PieChart'
import DropDown from '../components/DropDown'
import Page from '../components/Page'
import Section from "../components/Section"
import SectionDiv from "../components/SectionDiv"
import { useAppContext } from '../context/ContextAPI'
import getStartAndEndTime from '../utils/getStartAndEndTime'
import Notification from '../utils/notification'

const Traffic = () => {
    const { organization, requestPerHour, setRequestOverFiveHoursFunc, routesRequests, requestOverFiveHours, setRoutesRequestsFunc, isServerConnected } = useAppContext()
    const [selectedRoute, setSelectedRoute] = useState("Not Selected")

    const [methodsUsageThisWeek, setMethodsUsageThisWeek] = useState([])
    const [methodsContribution, setMethodsContribution] = useState([])

    const [availableRoutes, setAvailableRoutes] = useState([])

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
            response.data[response.data.length - 1].trafficOverview.map((data, index) => {
                if ((response.data[response.data.length - 1].trafficOverview.length) - 5 <= index) {
                    newData = [
                        ...newData,
                        ...Object.entries(data.breakdown)
                            // .slice(0, 5) // Get the latest 5
                            .map((detail) => ({
                                minute: `${data.hour}:${detail[0] < 10 ? "0" + detail[0] : detail[0]} m`,
                                requests: detail[1]
                            }))
                    ];
                }

            })
            setRequestOverFiveHoursFunc(newData, "new")
        } catch (error) {
            Notification.error("Oops! cannot fetch traffic overview at this moment")
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
            let methodsUsageThisWeek = data.data.map((info) => {
                setAvailableRoutes((oldRoutes) => {
                    return [...oldRoutes, ...info.routes]
                })
                return { name: info.mainRoute, uv: info.totalRequests, value: info.totalRequests }
            })
            setRoutesRequestsFunc(methodsUsageThisWeek, "new")
        } catch (err) {
            Notification.error("Oops! cannot fetch routes traffic at this  moment")
        }
    }

    const getRouteDetail = async () => {
        const { weekStarted, endTime } = getStartAndEndTime();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/traffic/route?organizationID=${organization._id}&startTime=${weekStarted}&endTime=${endTime}&route=${selectedRoute}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })
            let data = await response.json();
            data = data.data[0]
            setMethodsContribution([
                { name: "GET", uv: data.totalGet, value: data.totalGet },
                { name: "POST", uv: data.totalPost, value: data.totalPost },
                { name: "PUT", uv: data.totalPut, value: data.totalPut },
                { name: "DELETE", uv: data.totalDelete, value: data.totalDelete }
            ])
            let formattedMethodsUsageData = data.dailyAggregate.map((aggregateData) => {
                return {
                    name: aggregateData.date,
                    get: aggregateData.metrics.get,
                    post: aggregateData.metrics.post,
                    put: aggregateData.metrics.put,
                    delete: aggregateData.metrics.delete
                };
            });
            setMethodsUsageThisWeek(formattedMethodsUsageData)
        } catch (err) {
            Notification.error("Oops! cannot fetch route detail at this moment")
        }
    }


    useEffect(() => {
        if (isServerConnected) {
            getRouteDetail()
        }
    }, [selectedRoute])

    useEffect(() => {
        if (isServerConnected) {
            fetchTrafficOverview();
            fetchRoutesTraffic();
        }
    }, [isServerConnected])


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

            <Section cols={1} heading={`Detail Route Analysis (1 hour delay)`}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h6 style={{ marginRight: "10px" }}>Selected Route: </h6>
                    <DropDown options={availableRoutes} selectedRoute={selectedRoute} handleSelectedOption={setSelectedRoute} />
                </div>
                <SectionDiv heading={`CRUD Requests This Week`}>
                    <MultiBarChart data={methodsUsageThisWeek} />
                </SectionDiv>
                <SectionDiv heading={`CRUD Method Contribution Overall (This Week)`}>
                    <PieChart data={methodsContribution} />
                </SectionDiv>
            </Section>
        </Page>
    )
}

export default Traffic