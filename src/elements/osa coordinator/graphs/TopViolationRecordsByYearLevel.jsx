import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopViolationRecordsByYearLevel = () => {
  const [state, setState] = useState({
    series: [], // This will hold the count of users for each year level
    options: {
      chart: {
        height: 350,
        type: "radialBar",
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
                // Custom formatter to display the total count of users
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
      labels: [], // This will hold the year levels (e.g., 'First Year', 'Second Year', etc.)
      legend: {
        show: true, // Enable legend
        position: "top", // Position of the legend (top, bottom, left, right)
        horizontalAlign: "center", // Align the legend horizontally (center, left, right)
        floating: true, // Make the legend float over the chart
        fontSize: "14px", // Font size for the legend items
      },
    },
  });

  useEffect(() => {
    // Fetch data from the backend API
    axios
      .get("http://localhost:9000/violation-records/year-level")
      .then((response) => {
        const data = response.data;

        // Extract year levels and user counts
        const yearLevels = data.map((item) => item.year_level);
        const userCounts = data.map((item) => item.user_count);

        // Update state with the data for the chart
        setState({
          ...state,
          series: userCounts,
          options: {
            ...state.options,
            labels: yearLevels, // Set labels for the year levels dynamically
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching violation record counts:", error);
      });
  }, []);

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
