import React from "react";
import { Chart } from "react-google-charts";

interface ColumnChartProps {
    data: any[];
    options: {};
    width: string;
    height: string;
}

const BasicColumnChart: React.FC<ColumnChartProps> = ({ data, options, width, height }) => {
    return (
        <div>
            <Chart
                chartType="ColumnChart"
                data={data}
                options={options}
                width={width}
                height={height}
                legendToggle={true}
            />
        </div>
    );
};

const StackedMultiColumnChart: React.FC<ColumnChartProps>  = ({ data, options, width, height }) => {

    return (
        <div>
            <Chart
                chartType="ColumnChart"
                data={data}
                options={options}
                width={width}
                height={height}
                legendToggle={true}
            />
        </div>
    );
};

const NonStackedMultiColumnChart: React.FC = () => {

    const data = [
        ["City", "2010 Population", "2000 Population"],
        ["New York City, NY", 8175000, 8008000],
        ["Los Angeles, CA", 3792000, 3694000],
        ["Chicago, IL", 2695000, 2896000],
        ["Houston, TX", 2099000, 1953000],
        ["Philadelphia, PA", 1526000, 1517000],
    ];

    const options = {
        title: "Non-Stacked Multi Column Chart",
        isStacked: false,
        hAxis: {
            // title: "Total Population",
            minValue: 0,
        },
        vAxis: {
            title: "City",
        },
        legend: {
            position: "right",
            alignment: "top",
            textStyle: {
              color: "#233238",
              fontSize: 14,
            },
          },
    };

    const controls = {
        controlType: "StringFilter",
        options: {
            filterColumnIndex: 0,
            matchType: "any",
            ui: {
                label: "Search by name"
            }
        }
    }

    return (
        <div>
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
                chartPackages={["corechart", "controls"]}
                controls={[
                    {
                    controlType: "StringFilter",
                    options: {
                        filterColumnIndex: 0,
                        matchType: "any", // 'prefix' | 'exact',
                        ui: {
                        label: "Search by name",
                        },
                    },
                    },
                ]}
            />
        </div>
    );
};

export { BasicColumnChart, StackedMultiColumnChart, NonStackedMultiColumnChart };