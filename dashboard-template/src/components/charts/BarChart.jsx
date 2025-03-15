import React from 'react';
import { BarChart as Chart, ResponsiveContainer, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import NotEnoughDataWarning from '../NotEnoughDataWarning';


const BarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-30px" }}>
            {data.length == 0 ? <NotEnoughDataWarning /> : <Chart
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
            </Chart>}
        </ResponsiveContainer>
    );
};

export default BarChart;
