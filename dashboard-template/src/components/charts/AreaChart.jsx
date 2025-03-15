import React from 'react'
import { Area, CartesianGrid, AreaChart as Chart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import NotEnoughDataWarning from '../NotEnoughDataWarning'

const AreaChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-20px" }}>
            {data.length == 0 ? <NotEnoughDataWarning /> : <Chart data={data}
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
                <YAxis domain={[0, 500]} tick={{ style: { fontSize: 10 } }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#8884d8" fillOpacity={1} fill="url(#colorrequests)" />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </Chart>}
        </ResponsiveContainer>
    )
}

export default AreaChart