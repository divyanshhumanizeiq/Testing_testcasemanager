
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TestCaseStatus } from '../../types';

interface StatusPieChartProps {
  data: {
    name: TestCaseStatus;
    value: number;
  }[];
}

const COLORS = {
  [TestCaseStatus.Pass]: '#22c55e', // green-500
  [TestCaseStatus.Fail]: '#ef4444', // red-500
  [TestCaseStatus.Blocked]: '#f59e0b', // amber-500
  [TestCaseStatus.NotRun]: '#6b7280', // gray-500
};

const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            if (percent === 0) return '';
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            return (
              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
            borderColor: '#4b5563', // border-gray-600
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#d1d5db' }} // text-gray-300
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ color: '#9ca3af' /* text-gray-400 */ }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusPieChart;
