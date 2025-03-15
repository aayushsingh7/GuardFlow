import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NotEnoughDataWarning from '../NotEnoughDataWarning';


const MultiBarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400} style={{ marginLeft: "-20px" }}>
            {data.length == 0 ? <NotEnoughDataWarning /> : <BarChart
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
            </BarChart>}
        </ResponsiveContainer>
    );
};

export default MultiBarChart;
