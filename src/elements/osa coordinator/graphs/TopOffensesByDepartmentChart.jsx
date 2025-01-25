import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const TopOffensesByDepartmentChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'offense-bar-chart',
        stacked: true,
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Offenses',
          style: {
            fontWeight: '600',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Offense Count',
          style: {
            fontWeight: '600',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
    },
    series: [],
  });

  
  const fetchData = () => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    axios
      .get('https://test-backend-api-2.onrender.com/api/top-offenses', { params })
      .then((response) => {
        const departments = [];
        const offenses = [];
        const offenseCountsByDepartment = {};
        const departmentColors = {
          'College of Computer Studies': '#4B9393',
          'College of Criminal Justice Education': '#CE1F20',
          'College of Engineering': '#772133',
          'College of Arts and Sciences': '#5FB4FA',
          'College of Teacher Education': '#54A210',
          'College of Accountancy and Finance': '#F0CD44',
          'College of Business Management': '#E28641',
          'College of Health Sciences': '#10A955',
        };

        response.data.forEach((row) => {
          if (!offenses.includes(row.offense_name)) {
            offenses.push(row.offense_name);
          }
          if (!departments.includes(row.department_name)) {
            departments.push(row.department_name);
          }

          if (!offenseCountsByDepartment[row.offense_name]) {
            offenseCountsByDepartment[row.offense_name] = {};
          }
          offenseCountsByDepartment[row.offense_name][row.department_name] =
            row.offense_count;
        });

        const seriesData = departments.map((department) => ({
          name: department,
          data: offenses.map(
            (offense) => offenseCountsByDepartment[offense][department] || 0
          ),
          color: departmentColors[department] || '#000000',
        }));

        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              categories: offenses,
            },
          },
          series: seriesData,
        });
      })
      .catch((error) => {
        console.error('Error fetching offenses data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]); 


  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};


export default TopOffensesByDepartmentChart;
