import React from 'react';
import { BarChart as Chart, ResponsiveContainer, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';

// const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

// const data = [
//     { name: '/users', uv: 4000, amt: 2400 },
//     { name: '/documents', uv: 3000, amt: 2210 },
//     { name: '/uploads', uv: 2000, amt: 2290 },
//     { name: '/ai', uv: 2780, amt: 2000 },
//     { name: '/stories', uv: 1890, amt: 2181 },
// ];

const BarChart = ({ data }) => {
    // console.log("Data in BarChart.jsx", data)
    return (
        <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-30px" }}>
            <Chart
                data={data}
                margin={{ top: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={{ style: { fontSize: 14 } }} dataKey="name" />
                <YAxis domain={[0, 200]} tick={{ style: { fontSize: 10 } }} />
                <Bar dataKey="uv" fill="#8884d8" label={{ position: 'top', fontSize: "12px" }}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={"#8884d8"} />
                    ))}
                </Bar>
            </Chart>
        </ResponsiveContainer>
    );
};

export default BarChart;
