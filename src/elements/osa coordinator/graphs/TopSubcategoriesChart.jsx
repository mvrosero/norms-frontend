import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopSubcategoriesChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: [],
      fill: {
        type: "gradient", // Added gradient fill
      },
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
        position: "bottom",
      },
      title: {
        text: "Top Subcategories (Violations)",
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/top-subcategories"
        );
        const data = response.data;

        // Ensure data is valid
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
  }, []);

  return (
    <div id="chart">
      {chartData.series.length > 0 ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          width={380}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default TopSubcategoriesChart;
