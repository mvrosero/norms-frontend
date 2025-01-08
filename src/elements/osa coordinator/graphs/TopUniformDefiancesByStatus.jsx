import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopUniformDefianceByStatusChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    series: [], 
    labels: [], 
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        // Fetch data from the backend API with the date filters
        const response = await axios.get(
          `http://localhost:9000/uniform-defiances/status?${params.toString()}`
        );
        const data = response.data;

        const statuses = data.map((item) => item.status);
        const totals = data.map((item) => item.total);

        setChartData({ labels: statuses, series: totals });
      } catch (error) {
        console.error("Error fetching uniform defiance status data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]); 


  // Default colors for each status
  const getColorByStatus = (status) => {
    switch (status) {
      case "approved":
        return "#28A745"; 
      case "rejected":
        return "#DC3545"; 
      case "pending":
        return "#F7C948"; 
      default:
        return "#808080"; 
    }
  };


  const options = {
    chart: {
      width: 380, 
      type: "polarArea", 
      toolbar: {
        show: true, 
        tools: {
          download: true, 
        },
        offsetX: 0, 
        offsetY: -10, 
      },
    },
    labels: chartData.labels, 
    colors: chartData.labels.map(getColorByStatus), 
    fill: {
      opacity: 1, 
    },
    stroke: {
      width: 1, 
      colors: undefined, 
    },
    yaxis: {
      show: false, 
    },
    theme: {
      monochrome: {
        enabled: false, 
      },
    },
  };


  return (
    <div>
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
