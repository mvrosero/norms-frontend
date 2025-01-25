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

const TotalViolationRecordsChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    daily: [],
    monthly: [],
    yearly: [],
  });
  
  const [selectedOption, setSelectedOption] = useState('daily'); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        // Fetch data from backend with date filter
        const response = await axios.get(
          `http://localhost:9000/violation-records/totals?${params.toString()}`
        );
        const data = response.data;
        setChartData({
          daily: data.daily,
          monthly: data.monthly,
          yearly: data.yearly,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]);


  // Chart options for the daily data
  const dailyOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: "Daily Violation Records Total",
      align: "center",
    },
    xaxis: {
      categories: chartData.daily.map((item) => item.day_of_week),
      title: {
        text: "Days",
        style: {
          fontWeight: '600',
        },
      },
    },
    yaxis: {
      title: {
        text: "Record Counts",
        style: {
          fontWeight: '600',
        },
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

  // Chart options for the monthly data 
  const monthlyOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Monthly Violation Records Total",
      align: "center",
    },
    xaxis: {
      categories: chartData.monthly.map((item) => item.month),
      title: {
        text: "Months",
        style: {
          fontWeight: '600',
        },
      },
    },
    yaxis: {
      title: {
        text: "Record Counts",
        style: {
          fontWeight: '600',
        },
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

  // Chart options for the yearly data 
  const yearlyOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Yearly Violation Records Total",
      align: "center",
    },
    xaxis: {
      categories: chartData.yearly.map((item) => item.year),
      title: {
        text: "Record Counts",
        style: {
          fontWeight: '600',
        },
      },
    },
    yaxis: {
      title: {
        text: "Years",
        style: {
          fontWeight: '600',
        },
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
  const dailySeries = [
    {
      name: "Violations",
      data: chartData.daily.map((item) => item.total),
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


  // Handle the dropdown change
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  return (
    <div>
      {/* Dropdown for selecting the chart view */}
      <div style={{ marginBottom: '20px' }}>
          <select id="chart-view" value={selectedOption} onChange={handleOptionChange} style={{ padding: '4px 30px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
          </select>
      </div>

      {/* Conditional rendering based on selected Option */}
      {selectedOption === 'daily' && (
        <div>
          <ReactApexChart
            options={dailyOptions}
            series={dailySeries}
            type="line"
            height={350}
          />
        </div>
      )}

      {selectedOption === 'monthly' && (
        <div>
          <ReactApexChart
            options={monthlyOptions}
            series={monthlySeries}
            type="bar"
            height={350}
          />
        </div>
      )}

      {selectedOption === 'yearly' && (
        <div>
          <ReactApexChart
            options={yearlyOptions}
            series={yearlySeries}
            type="bar"
            height={350}
          />
        </div>
      )}
    </div>
  );
};


export default TotalViolationRecordsChart;
