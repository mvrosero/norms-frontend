import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopSubcategoriesChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: [],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical", 
          gradientToColors: ["#D4FFFF", "#FFB88C", "#FF7374", "#E1768B", "#C4EBFF", "#A4F4A3", "#FFF5AC", "#5BF4B8"],
          shadeIntensity: 0.9,
          stops: [0, 100],
        },
      },
      colors: ["#4B9393", "#E28641", "#CE1F20", "#772133", "#5FB4FA", "#54A210", "#F0CD44", "#10A955"], 
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "right",
      },
    },
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        // Fetch the top subcategories data from the API with date filters
        const response = await axios.get(`http://localhost:9000/api/top-subcategories?${params.toString()}`);
        const data = response.data;


        const subcategoryNames = Array.isArray(data)
          ? data.map((item) => item.subcategory_name || "Unknown")
          : [];
        const violationCounts = Array.isArray(data)
          ? data.map((item) => item.violation_count || 0)
          : [];
        setChartData((prevState) => ({
          ...prevState,
          series: violationCounts,
          options: {
            ...prevState.options,
            labels: subcategoryNames,
          },
        }));
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]); 


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      {chartData.series.length > 0 ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          width={500}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};


export default TopSubcategoriesChart;
