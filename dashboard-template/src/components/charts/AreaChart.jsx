import React from 'react'
import { Area, CartesianGrid, AreaChart as Chart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const AreaChart = () => {
    const data = [
        { hour: "12 AM", requests: 1200, amt: 1500 },
        { hour: "1 AM", requests: 1400, amt: 1600 },
        { hour: "2 AM", requests: 1000, amt: 1400 },
        { hour: "3 AM", requests: 900, amt: 1300 },
        { hour: "4 AM", requests: 800, amt: 1200 },
        { hour: "5 AM", requests: 950, amt: 1250 },
        { hour: "6 AM", requests: 1100, amt: 1350 },
        { hour: "7 AM", requests: 1500, amt: 1600 },
        { hour: "8 AM", requests: 2000, amt: 1800 },
        { hour: "9 AM", requests: 2500, amt: 2000 },
        { hour: "10 AM", requests: 3000, amt: 2200 },
        { hour: "11 AM", requests: 3200, amt: 2400 },
        { hour: "12 PM", requests: 3500, amt: 2600 },
        { hour: "1 PM", requests: 3700, amt: 2800 },
        // { hour: "2 PM", requests: 3900, amt: 3000 },
        // { hour: "3 PM", requests: 4200, amt: 3200 },
        // { hour: "4 PM", requests: 4600, amt: 3400 },
        // { hour: "5 PM", requests: 5000, amt: 3600 },
        // { hour: "6 PM", requests: 5200, amt: 3800 },
        // { hour: "7 PM", requests: 5400, amt: 4000 },
        // { hour: "8 PM", requests: 4800, amt: 3800 },
        // { hour: "9 PM", requests: 4000, amt: 3500 },
        // { hour: "10 PM", requests: 3200, amt: 3000 },
        // { hour: "11 PM", requests: 2000, amt: 2500 }
    ];

    return (
        <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-20px" }}>
            <Chart data={data}
                margin={{ top: 10, left: 0, bottom: 0 }} >
                <defs>
                    <linearGradient id="colorrequests" x1="0" y1="0" x2="0" y2="2">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis tick={{ style: { fontSize: 10 } }} dataKey="hour" />
                <YAxis domain={[0, 7000]} tick={{ style: { fontSize: 10 } }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#8884d8" fillOpacity={1} fill="url(#colorrequests)" />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </Chart>
        </ResponsiveContainer>
    )
}

export default AreaChart