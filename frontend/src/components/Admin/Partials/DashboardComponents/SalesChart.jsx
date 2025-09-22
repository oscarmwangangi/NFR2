import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip.jsx';

export default function SalesChart({ data }) {
  console.log("Sales Chart Data:", data);
  return (
    <div className="bg-[#330000] p-6 rounded-lg h-full">
      {data.length > 0 ? (
        
        <>
          <h3 className="text-white mb-4 font-semibold">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#550000" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#ffcccc' }}
                stroke="#ffcccc"
              />
              <YAxis 
                tick={{ fill: '#ffcccc' }}
                stroke="#ffcccc"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#ff3d3d"
                strokeWidth={2}
                dot={{ fill: '#ff3d3d', r: 4 }}
                activeDot={{ r: 6, fill: '#ff0000' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className="text-red-300">No matching results found</p>
      )}
    </div>
  );
}
