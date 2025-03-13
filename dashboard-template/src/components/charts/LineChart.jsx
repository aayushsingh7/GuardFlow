import { useEffect, useState } from "react";
import {
    LineChart as Chart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Brush,
    ReferenceArea,
} from "recharts";

// const generateData = () =>
//     Array.from({ length: 1 * 60 }, (_, i) => ({
//         // Math.floor(i / 60)
//         minute: `00:${i % 60 < 10 ? "0" + i % 60 : i % 60} m`,
//         requests: Math.floor(Math.random() * 500), // Example data
//     }));


const RequestPerMinuteChart = ({ data }) => {

    useEffect(() => {
        console.log("DATA CHANGED", data)
    }, [data])

    const [zoomDomain, setZoomDomain] = useState({ start: 0, end: data.length });

    const handleZoom = (e) => {
        if (!e || !e.activeLabel) return;
        const startIndex = data.findIndex((d) => d.minute === e.activeLabel);
        setZoomDomain({
            start: startIndex - 15 > 0 ? startIndex - 15 : 0,
            end: startIndex + 15 < data.length ? startIndex + 15 : data.length,
        });
    };

    const resetZoom = () => setZoomDomain({ start: 0, end: data.length });

    return (
        <ResponsiveContainer width="100%" height={300} style={{ marginLeft: "-30px" }}>

            <Chart width={100} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="minute" tick={{ fontSize: 10 }} />
                <YAxis tick={{ style: { fontSize: 10 } }} />
                <Tooltip />
                <Brush dataKey="minute" height={30} stroke="#8884d8" />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                <ReferenceArea onMouseDown={handleZoom} />
            </Chart>
        </ResponsiveContainer>
    );
};

export default RequestPerMinuteChart;
