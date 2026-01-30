import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ZChart = ({ type = 'bar', data, options }) => {
  const chartTypes = {
    line: <Line data={data} options={options} />,
    bar: <Bar data={data} options={options} />,
    pie: <Pie data={data} options={options} />,
    doughnut: <Doughnut data={data} options={options} />,
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
      {chartTypes[type] || chartTypes['bar']}
    </div>
  );
};

export default ZChart;
