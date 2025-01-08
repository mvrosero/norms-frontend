import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const TopCategoriesChart = ({ startDate, endDate }) => {
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
          blur: 5,
          opacity: 0.5,
        },
        toolbar: {
          show: true, 
          tools: {
            download: true, 
          },
          offsetX: 70, 
          offsetY: -50, 
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
          blur: 5,
          opacity: 1,
        },
      },
      fill: {
        type: "pattern",
        opacity: 1,
        pattern: {
          enabled: true,
          style: [
            "squares",
            "slantedLines",
            "circles",
            "horizontalLines",
            "verticalLines",
          ],
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      theme: {
        palette: "palette6",
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
    const fetchData = () => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      // Fetch the top categories data from the API
      axios
        .get(`http://localhost:9000/api/top-categories?${params.toString()}`)
        .then((response) => {
          const data = response.data;
          const categories = Array.isArray(data)
            ? data.map((item) => item.category_name || "Unknown")
            : [];
          const counts = Array.isArray(data)
            ? data.map((item) => item.violation_count || 0)
            : [];


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
    };
    fetchData();
  }, [startDate, endDate]);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
        height: "60vh", 
      }}
    >
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
