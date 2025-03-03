import React from "react";
import { Chart } from "react-google-charts";

interface RegionGeoChartProps {
    data: any[];
    options: {};
    width: string;
    height: string;
}

const RegionGeoChart: React.FC<RegionGeoChartProps> = ({ data, options, width, height }) => {
    return (
        <div>
            <Chart
                chartType="GeoChart"
                options={options}
                width={width}
                height={height}
                data={data}
                chartEvents={[
                    {
                    eventName: "select",
                    callback: ({ chartWrapper }) => {
                        if (chartWrapper){
                            const chart = chartWrapper.getChart();
                            const selection = chart.getSelection();
                            
                            if (selection && selection.length > 0) {
                                const region = data[selection[0].row + 1];
                                console.log("Selected : " + region);
                            }
                            else {
                                return;
                            }
                        }
                    },
                    },
                ]}
            />
        </div>
    );
};


export { RegionGeoChart };