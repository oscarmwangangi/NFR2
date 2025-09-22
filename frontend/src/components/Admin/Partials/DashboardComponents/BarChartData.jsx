import react from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Bell, MessageCircle, PlusCircle, Users, 
  ShoppingCart, DollarSign, Package, Clock, UserPlus 
} from 'lucide-react';

export default function BarChartData({data}) {
    return (
                <div className="bg-[#330000] p-6 rounded-lg">
                  <h3 className="text-white mb-4 font-semibold">Customer Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
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
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#330000',
                          borderColor: '#550000',
                          color: '#ffcccc'
                        }}
                      />
                      <Bar
                        dataKey="users"
                        name="New Users"
                        fill="#ffcc00"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
    );
}