import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const getBarColor = (total) => {
  if (total <= 20) {
    return '#FFEB3B';
  } else if (total <= 40) {
    return '#FF9800'; 
  } else {
    return '#F44336'; 
  }
};

const TotalUniformDefiancesChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        // Fetch data from backend with date filter
        const response = await axios.get(
          `http://localhost:9000/uniform-defiances/totals?${params.toString()}`
        );
        const data = response.data;
        setChartData({
          weekly: data.weekly,
          monthly: data.monthly,
          yearly: data.yearly,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]);


  // Weekly chart options
  const weeklyOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: "Weekly Uniform Defiance Totals",
      align: "center",
    },
    xaxis: {
      categories: chartData.weekly.map((item) => item.day_of_week),
    },
    yaxis: {
      title: {
        text: "Total Uniform Defiances",
      },
    },
    stroke: {
      curve: 'smooth',
      colors: ['#ff856b'],
      width: 3,
    },
    plotOptions: {
      area: {
        fillColor: '#FF5733',
        opacity: 0.2,
      },
    },
  };

  // Monthly chart options
  const monthlyOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Monthly Uniform Defiance Totals",
      align: "center",
    },
    xaxis: {
      categories: chartData.monthly.map((item) => item.month),
    },
    yaxis: {
      title: {
        text: "Total Uniform Defiances",
      },
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: chartData.monthly.map((item) => ({
            from: item.total,
            to: item.total,
            color: getBarColor(item.total),
          })),
        },
      },
    },
  };

  // Yearly chart options
  const yearlyOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Yearly Uniform Defiance Totals",
      align: "center",
    },
    xaxis: {
      categories: chartData.yearly.map((item) => item.year),
    },
    yaxis: {
      title: {
        text: "Total Uniform Defiances",
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          ranges: chartData.yearly.map((item) => ({
            from: item.total,
            to: item.total,
            color: getBarColor(item.total),
          })),
        },
      },
    },
  };


  // Series data for the charts
  const weeklySeries = [
    {
      name: "Uniform Defiances",
      data: chartData.weekly.map((item) => item.total),
    },
  ];

  const monthlySeries = [
    {
      name: "Uniform Defiances",
      data: chartData.monthly.map((item) => item.total),
    },
  ];

  const yearlySeries = [
    {
      name: "Uniform Defiances",
      data: chartData.yearly.map((item) => item.total),
    },
  ];


  return (
    <div>
      {/* Weekly Chart */}
      <div>
        <ReactApexChart
          options={weeklyOptions}
          series={weeklySeries}
          type="line"
          height={350}
        />
      </div>

      {/* Monthly Chart */}
      <div>
        <ReactApexChart
          options={monthlyOptions}
          series={monthlySeries}
          type="bar"
          height={350}
        />
      </div>

      {/* Yearly Chart */}
      <div>
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


export default TotalUniformDefiancesChart;
