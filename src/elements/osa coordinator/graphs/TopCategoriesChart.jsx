import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopCategoriesChart = () => {
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.5,
        },
      },
      labels: [],
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 1,
        },
      },
      fill: {
        type: "pattern",
        opacity: 1,
        pattern: {
          enabled: true,
          style: [
            "verticalLines",
            "squares",
            "horizontalLines",
            "circles",
            "slantedLines",
          ],
          background: ["#FFD700", "#32CD32"], // Yellow and Green colors
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      theme: {
        palette: "palette2",
      },
      title: {
        text: "Top Categories by Violation Records",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    // Fetch the top categories data from the API
    axios
      .get("http://localhost:9000/api/top-categories")
      .then((response) => {
        const data = response.data;
        const categories = Array.isArray(data)
          ? data.map((item) => item.category_name || "Unknown")
          : [];
        const counts = Array.isArray(data)
          ? data.map((item) => item.violation_count || 0)
          : [];

        // Update chart state
        setState((prevState) => ({
          ...prevState,
          series: counts,
          options: {
            ...prevState.options,
            labels: categories,
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <div id="chart">
        {state.series.length > 0 ? (
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="donut"
            width={380}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default TopCategoriesChart;
