import React, { PureComponent } from 'react';
import { PieChart as Chart, Legend, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import NotEnoughDataWarning from '../NotEnoughDataWarning';


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

const PieChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            {data.length == 0 ? <NotEnoughDataWarning /> : <Chart style={{ fontSize: "14px" }} width="100%" height="100%">
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </Chart>}
        </ResponsiveContainer>
    );
}
export default PieChart;
