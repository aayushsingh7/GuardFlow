import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//     { name: '07/03/2025', get: 4000, put: 2400, post: 1200, delete: 800, amt: 2400 },
//     { name: '08/03/2025', get: 3000, put: 1398, post: 1600, delete: 900, amt: 2210 },
//     { name: '09/03/2025', get: 2000, put: 9800, post: 2000, delete: 500, amt: 2290 },
//     { name: '10/03/2025', get: 2780, put: 3908, post: 1700, delete: 1300, amt: 2000 },
//     { name: '11/03/2024', get: 1890, put: 4800, post: 2100, delete: 1400, amt: 2181 },
//     { name: '12/03/2024', get: 2390, put: 3800, post: 1800, delete: 1200, amt: 2500 },
//     { name: '13/03/2024', get: 3490, put: 4300, post: 2500, delete: 1500, amt: 2100 },
// ];

const MultiBarChart = ({ data }) => {
    console.log("MultiBarChart()", data)
    return (
        <ResponsiveContainer width="100%" height={400} style={{ marginLeft: "-20px" }}>
            <BarChart
                style={{ fontSize: "14px" }}
                width={"100%"}
                height={"100%"}
                data={data}
                margin={{ top: 20, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ style: { fontSize: 12 } }} />
                <YAxis tick={{ style: { fontSize: 12 } }} />
                <Tooltip contentStyle={undefined} />
                <Legend />
                <Bar dataKey="put" fill="#8884d8" />
                <Bar dataKey="get" fill="#82ca9d" />
                <Bar dataKey="post" fill="#FFBB28" />
                <Bar dataKey="delete" fill="#FF8042" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MultiBarChart;
