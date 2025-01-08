import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopUniformDefianceByStatusChart = () => {
  const [chartData, setChartData] = useState({
    series: [], // This will hold the count of uniform defiance records for each status
    labels: [], // This will hold the statuses (e.g., 'Pending', 'Resolved', etc.)
  });

  useEffect(() => {
    // Fetch data from the backend API
    axios
      .get("http://localhost:9000/uniform-defiances/status")
      .then((response) => {
        const data = response.data;

        // Extract statuses and their total counts
        const statuses = data.map((item) => item.status);
        const totals = data.map((item) => item.total);

        // Update chart data
        setChartData({ labels: statuses, series: totals });
      })
      .catch((error) => {
        console.error("Error fetching uniform defiance status data:", error);
      });
  }, []);

  const options = {
    chart: {
      width: 380, // Set a fixed width for the chart
      type: "polarArea", // Set chart type to 'polarArea'
    },
    labels: chartData.labels, // Use statuses as labels
    colors: ["#3357FF", "#FF33A6", "#FFC300"], // Custom color array for different segments
    fill: {
      opacity: 1, // Set opacity for fill
    },
    stroke: {
      width: 1, // Set stroke width for chart segments
      colors: undefined, // No specific stroke color
    },
    yaxis: {
      show: false, // Hide the y-axis
    },
    theme: {
      monochrome: {
        enabled: false, // Disable monochrome theme to use custom colors
      },
    },
  };

  return (
    <div>
      <h2>Uniform Defiance Status</h2>
      {chartData.labels.length > 0 ? (
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="polarArea"
          height={350}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TopUniformDefianceByStatusChart;
