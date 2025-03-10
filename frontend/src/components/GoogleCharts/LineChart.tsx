import React from "react";
import { Chart } from "react-google-charts";

const LineChart: React.FC<{ data: (string | number)[][], title: string, y_title: string, x_title: string}> = ({ data, title, y_title, x_title }) => {
    const options = {
        title: title,  // Correcting this line
        hAxis: { title: x_title, titleTextStyle: { color: "#333" } },
        vAxis: { title: y_title, minValue: 0 },
        curveType: "function",
        pointSize: 3,
        lineWidth: 4,
        areaOpacity: 0.3,
        legend: null,
    };

    return (
        <div>
            <Chart chartType="LineChart" data={data} options={options} width={"100%"} height={"400px"}/>
        </div>
    );
};

const LineChartExtend: React.FC<{ 
    data1: (string | number)[][],  // Dữ liệu chính cho Line Chart
    data2: (string | number)[][],  // Dữ liệu chỉ chứa 1 điểm đặc biệt
    title: string, 
    y_title: string, 
    x_title: string 
  }> = ({ data1, data2, title, y_title, x_title }) => {
  
      // Kiểm tra nếu không có dữ liệu đầu vào
      if (!data1 || data1.length < 2) {
          return <p>Không có dữ liệu để hiển thị</p>;
      }
  
      const chartData = [
          [...data1[0], "ROAS"], // Thêm cột cho điểm đặc biệt
          ...data1.slice(1).map(([x, y]) => [x, y, null]), // Line chart data
          ...(data2.length > 1 ? data2.slice(1).map(([x, y]) => [x, null, y]) : []) // Điểm đặc biệt
      ];
  
      const options = {
          title: title,
          hAxis: { title: x_title, titleTextStyle: { color: "#333" } },
          vAxis: { title: y_title, minValue: 0 },
          curveType: "function",
          pointSize: 4,  // Kích thước điểm của Line Chart
          lineWidth: 3,  // Độ dày đường Line Chart
          areaOpacity: 0.3,
          legend: "none",
          series: {
              0: { type: "line", color: "blue" },  // Line Chart chính
              1: { type: "scatter", color: "red", pointSize: 5 } // Điểm đặc biệt
          },
      };

      return (
          <div>
              <Chart 
                  chartType="ComboChart" 
                  data={chartData} 
                  options={options} 
                  width={"100%"} 
                  height={"400px"} 
              />
          </div>
      );
  };


export { LineChart, LineChartExtend };
