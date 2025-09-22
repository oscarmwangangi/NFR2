import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip.jsx';
const COLORS = ['#ff3333', '#cc0000', '#800000', '#4d0000'];

export default function PieChartData({data}) {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    productsSold: 0,
    pendingOrders: 0,
    activeCustomers: 0,
  });
  
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    activeCarts: 0,
    topProducts: [],
  });
  
  const [orderCats, setOrderCats] = useState({});
  const [orderStatusData, setOrderStatusData] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, cartRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard-summary`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/cart-summary`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/order-categories`)
        ]);

        setSummary(summaryRes.data);
        setCartSummary(cartRes.data);
        setOrderCats(categoriesRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
    
    // Fetch order status data separately
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/order-statuses`)
      .then(r => {
        setOrderStatusData(r.data);
        console.log("Order Status Data:", r.data);
      })
      .catch(err => console.error("Order status fetch failed", err));
  }, []);

  const categoryChartData = useMemo(() => Object.keys(orderCats).map(key => ({
    name: key,
    value: orderCats[key]
  })), [orderCats]);

  const statusChartData = useMemo(() => {
    return orderStatusData.map(status => ({
      name: status.status,
      value: status.count
    }));
  }, [orderStatusData]);
  
  const getStatusColor = (status) => {
    const colorMap = {
      'Completed': '#4CAF50',
      'Processing': '#2196F3',
      'Pending': '#FFC107',
      'Cancelled': '#F44336',
      'Refunded': '#9E9E9E',
      'Shipped': '#673AB7',
      'Delivered': '#009688',
    };
    return colorMap[status] || '#607D8B'; // default color
  };

return (
    <div className="bg-[#330000] p-6 rounded-lg">
      <h3 className="text-white mb-4 font-semibold">Orders by Category & Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Categories Pie Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}  // Increased inner radius
                outerRadius={80}
                paddingAngle={2}   // Reduced padding
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} // Simpler label
                labelLine={false}
                stroke="none"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal"  // Changed to horizontal
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  color: '#ffcccc',
                  paddingTop: '20px'  // Added padding
                }}
                formatter={(value, entry, index) => (
                  <span className="text-[#ffcccc] text-xs">
                    {categoryChartData[index].name}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="h-[300px]">
          {statusChartData.length > 0 && statusChartData.some(item => item.value > 0) ?  (
          <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {statusChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
        ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      color: '#ffcccc',
                      paddingTop: '20px'
                    }}
                    formatter={(value, entry) => (
                      <span className="text-[#ffcccc] text-xs">{entry.value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-[#ff9999]">
              Loading order status data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}