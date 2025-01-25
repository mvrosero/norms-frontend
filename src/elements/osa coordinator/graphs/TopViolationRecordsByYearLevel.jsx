import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopViolationRecordsByYearLevel = ({ startDate, endDate }) => {
  const [state, setState] = useState({
    series: [], 
    options: {
      chart: {
        height: 350,
        type: "radialBar",
        offsetX: 0, 
        toolbar: {
          show: true, 
          tools: {
            download: true, 
          },
          offsetX: 0, 
          offsetY: 10, 
        },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
      labels: [], 
      legend: {
        show: true, 
        position: "right", 
        horizontalAlign: "center", 
        floating: true, 
        fontSize: "12px", 
        offsetY: 230
      },
      colors: [
        "#5FB4FA", "#10A955", "#E28641", "#4B9393", "#F0CD44", "#54A210", "#772133", "#CE1F20" 
      ],
    },
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        // Fetch data from the backend API with the date filters
        const response = await axios.get(
          `https://test-backend-api-2.onrender.com/violation-records/year-level?${params.toString()}`
        );
        const data = response.data;

        const yearLevels = data.map((item) => item.year_level);
        const userCounts = data.map((item) => item.user_count);
        setState({
          ...state,
          series: userCounts,
          options: {
            ...state.options,
            labels: yearLevels, 
          },
        });
      } catch (error) {
        console.error("Error fetching violation record counts:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]); 


  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="radialBar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};


export default TopViolationRecordsByYearLevel;
