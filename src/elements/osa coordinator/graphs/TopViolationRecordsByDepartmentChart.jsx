import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const TopViolationRecordsByDepartmentChart = ({ startDate, endDate }) => {
  const [state, setState] = useState({
    series: [{
      name: 'Violation Records',
      data: []
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: 5,
        curve: 'smooth'
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Departments',
          style: {
            fontWeight: '600',
          },
        },
        labels: {
          rotate: -45,
          style: {
            fontSize: '8px',
            fontWeight: '500',
          }
        }
      },
      yaxis: {
        title: {
          text: 'Violation Count',
          style: {
            fontWeight: '600',
          },
        },
        min: 0
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 5,
        colors: ['#FAD32E', '#FF8C00', '#FF0000'],
        strokeWidth: 2,
      }
    }
  });


  useEffect(() => {
    const fetchData = () => {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      // Fetch violation records count from the backend
      axios
        .get('http://localhost:9000/api/top-violationrecords', { params })
        .then((response) => {
          const data = response.data; 

          // Sort departments alphabetically
          const sortedData = data.sort((a, b) => a.department_name.localeCompare(b.department_name));

          const departments = sortedData.map((record) => record.department_name);
          const violationCounts = sortedData.map((record) => record.violation_count);

          setState((prevState) => ({
            ...prevState,
            series: [{
              name: 'Violation Records',
              data: violationCounts
            }],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: departments
              }
            }
          }));
        })
        .catch((err) => console.error('Error fetching violation records:', err));
    };
    fetchData();
  }, [startDate, endDate]);

  
  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
      </div>
    </div>
  );
};


export default TopViolationRecordsByDepartmentChart;
