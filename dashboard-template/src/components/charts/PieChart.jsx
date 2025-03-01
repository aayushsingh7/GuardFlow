import React, { PureComponent } from 'react';
import { PieChart as Chart, Legend, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: '/users', value: 400 },
    { name: '/uploads', value: 300 },
    { name: '/documents', value: 300 },
    { name: '/stories', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <Chart style={{ fontSize: "14px" }} width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </Chart>
        </ResponsiveContainer>
    );
}
export default PieChart;
