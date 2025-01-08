import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TotalViolationRecordsChart = () => {
  const [chartData, setChartData] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    // Fetch data from backend
    axios
      .get("http://localhost:9000/violation-records/totals")
      .then((response) => {
        const data = response.data;
        setChartData({
          weekly: data.weekly,
          monthly: data.monthly,
          yearly: data.yearly,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Prepare chart options for the weekly data
  const weeklyOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: "Weekly Violation Totals",
      align: "center",
    },
    xaxis: {
      categories: chartData.weekly.map((item) => item.day_of_week),
    },
    yaxis: {
      title: {
        text: "Total Violations",
      },
    },
    colors: ["#FF5733"], // Red color for weekly chart
  };

  const monthlyOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Monthly Violation Totals",
      align: "center",
    },
    xaxis: {
      categories: chartData.monthly.map((item) => item.month),
    },
    yaxis: {
      title: {
        text: "Total Violations",
      },
    },
    colors: ["#33FF57"], // Green color for monthly chart
  };

  const yearlyOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Yearly Violation Totals",
      align: "center",
    },
    xaxis: {
      categories: chartData.yearly.map((item) => item.year),
    },
    yaxis: {
      title: {
        text: "Total Violations",
      },
    },
    colors: ["#3357FF"], // Blue color for yearly chart
  };

  // Prepare the series data
  const weeklySeries = [
    {
      name: "Violations",
      data: chartData.weekly.map((item) => item.total),
    },
  ];

  const monthlySeries = [
    {
      name: "Violations",
      data: chartData.monthly.map((item) => item.total),
    },
  ];

  const yearlySeries = [
    {
      name: "Violations",
      data: chartData.yearly.map((item) => item.total),
    },
  ];

  return (
    <div>
      {/* Weekly Chart */}
      <div>
        <h2>Weekly Violation Totals</h2>
        <ReactApexChart
          options={weeklyOptions}
          series={weeklySeries}
          type="line"
          height={350}
        />
      </div>

      {/* Monthly Chart */}
      <div>
        <h2>Monthly Violation Totals</h2>
        <ReactApexChart
          options={monthlyOptions}
          series={monthlySeries}
          type="bar"
          height={350}
        />
      </div>

      {/* Yearly Chart */}
      <div>
        <h2>Yearly Violation Totals</h2>
        <ReactApexChart
          options={yearlyOptions}
          series={yearlySeries}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default TotalViolationRecordsChart;
