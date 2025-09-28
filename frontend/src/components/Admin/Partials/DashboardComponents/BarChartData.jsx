import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function BarChartData({ data, title, dataKey, barColor }) {
  return (
    <div className="bg-[#330000] p-6 rounded-lg">
      <h3 className="text-white mb-4 font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#550000" />
          <XAxis dataKey="date" tick={{ fill: '#ffcccc' }} stroke="#ffcccc" />
          <YAxis tick={{ fill: '#ffcccc' }} stroke="#ffcccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#330000',
              borderColor: '#550000',
              color: '#ffcccc',
            }}
          />
          <Bar
            dataKey={dataKey}
            name={title}
            fill={barColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
