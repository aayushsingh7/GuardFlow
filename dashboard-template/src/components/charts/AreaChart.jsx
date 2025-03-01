import React from 'react'
import { Area, CartesianGrid, AreaChart as Chart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const AreaChart = () => {
    const data = [
        { name: "12 AM", uv: 1200, amt: 1500 },
        { name: "1 AM", uv: 1400, amt: 1600 },
        { name: "2 AM", uv: 1000, amt: 1400 },
        { name: "3 AM", uv: 900, amt: 1300 },
        { name: "4 AM", uv: 800, amt: 1200 },
        { name: "5 AM", uv: 950, amt: 1250 },
        { name: "6 AM", uv: 1100, amt: 1350 },
        { name: "7 AM", uv: 1500, amt: 1600 },
        { name: "8 AM", uv: 2000, amt: 1800 },
        { name: "9 AM", uv: 2500, amt: 2000 },
        { name: "10 AM", uv: 3000, amt: 2200 },
        { name: "11 AM", uv: 3200, amt: 2400 },
        { name: "12 PM", uv: 3500, amt: 2600 },
        { name: "1 PM", uv: 3700, amt: 2800 },
        // { name: "2 PM", uv: 3900, amt: 3000 },
        // { name: "3 PM", uv: 4200, amt: 3200 },
        // { name: "4 PM", uv: 4600, amt: 3400 },
        // { name: "5 PM", uv: 5000, amt: 3600 },
        // { name: "6 PM", uv: 5200, amt: 3800 },
        // { name: "7 PM", uv: 5400, amt: 4000 },
        // { name: "8 PM", uv: 4800, amt: 3800 },
        // { name: "9 PM", uv: 4000, amt: 3500 },
        // { name: "10 PM", uv: 3200, amt: 3000 },
        // { name: "11 PM", uv: 2000, amt: 2500 }
    ];

    return (
        <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-20px" }}>
            <Chart data={data}
                margin={{ top: 10, left: 0, bottom: 0 }} >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="2">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis tick={{ style: { fontSize: 10 } }} dataKey="name" />
                <YAxis domain={[0, 7000]} tick={{ style: { fontSize: 10 } }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </Chart>
        </ResponsiveContainer>
    )
}

export default AreaChart