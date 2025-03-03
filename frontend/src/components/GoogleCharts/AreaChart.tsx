import React from "react";
import { Chart } from "react-google-charts";

const BasicAreaChart: React.FC<{ data: (string | number)[][] }> = ({ data }) => {
    const options = {
        title: "Retention Curve",
        hAxis: { title: "Day n Since Install", titleTextStyle: { color: "#333" } },
        vAxis: { title: "Retention %", minValue: 0 },
        curveType: "function", 
        pointSize: 3, 
        lineWidth: 4, 
        areaOpacity: 0.3,
        legend: null,
    };

    return (
        <div>
            <Chart chartType="AreaChart" data={data} options={options} width={"100%"} height={"400px"} />
        </div>
    );
};

export { BasicAreaChart };
