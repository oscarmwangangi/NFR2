import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import PieChartData from './DashboardComponents/PieChartData';
import { 
  Bell, MessageCircle, PlusCircle, Users, 
  ShoppingCart, DollarSign, Package, Clock, UserPlus 
} from 'lucide-react';
import SearchAndFilter from './DashboardComponents/SearchAndFilter';
import SummaryCard from './DashboardComponents/SummaryCard';
import SalesChart from './DashboardComponents/SalesChart';
import BarChartData from './DashboardComponents/BarChartData';

const COLORS = ['#ff3333', '#cc0000', '#800000', '#4d0000'];

export default function Dashboard() {
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
  
  const [salesData, setSalesData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [orderCats, setOrderCats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [users, setUsers] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, cartRes, categoriesRes, salesRes, growthRes, ordersRes,userRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard-summary`, { withCredentials: true }), 
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/cart-summary`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/order-categories`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/sales-data`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/customer-growth`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/recent-orders`)
          ,axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/last-logins`, { withCredentials: true })
        ]);

        setSummary(summaryRes.data);
        setCartSummary(cartRes.data);
        setOrderCats(categoriesRes.data);
        setSalesData(salesRes.data);
        setGrowthData(growthRes.data);
        setRecentOrders(ordersRes.data);
        setUsers(userRes.data); 
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
      }
    };

    fetchData();
  }, []);


  // Filter recent orders
   const filteredOrders = useMemo(() => {
    let filtered = [...recentOrders];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.order_id.toString().includes(query) ||
        order.first_name.toLowerCase().includes(query) ||
        order.second_name.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.delivery_date);
        
        switch(dateFilter) {
          case 'day':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            return orderDate >= startOfWeek;
          case 'month':
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
          case 'year':
            return orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [recentOrders, searchQuery, dateFilter]);


const growthChartData = useMemo(() => {
  if (!users || users.length === 0) return [];

  const countsByMonth = users.reduce((acc, user) => {
    if (!user.last_login) return acc;
    const date = new Date(user.last_login);
    if (isNaN(date)) return acc;

    const monthKey = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(countsByMonth).map(month => ({
    date: month,
    users: countsByMonth[month],
  }));
}, [users]);

// Orders by delivery_date (grouped by month)
const ordersByDeliveryDate = useMemo(() => {
  if (!filteredOrders || filteredOrders.length === 0) return [];

  const countsByMonth = filteredOrders.reduce((acc, order) => {
    if (!order.delivery_date) return acc;
    const date = new Date(order.delivery_date);
    if (isNaN(date)) return acc;

    const monthKey = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(countsByMonth).map(month => ({
    date: month,
    orders: countsByMonth[month],
  }));
}, [filteredOrders]);

// Sales chart (sum sales by month instead of daily raw values)
const salesChartData = useMemo(() => {
  if (!filteredOrders || filteredOrders.length === 0) return [];

  const salesByMonth = filteredOrders.reduce((acc, order) => {
    if (!order.delivery_date || !order.total) return acc;
    const date = new Date(order.delivery_date);
    if (isNaN(date)) return acc;

    const monthKey = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    acc[monthKey] = (acc[monthKey] || 0) + parseFloat(order.total);
    return acc;
  }, {});

  return Object.keys(salesByMonth).map(month => ({
    date: month,
    sales: salesByMonth[month],
  }));
}, [filteredOrders]);

const categoryChartData = useMemo(() => {
  // Group filteredOrders by status (or category)
  const counts = filteredOrders.reduce((acc, order) => {
    const key = order.status || "Unknown"; 
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Convert object into recharts format
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
}, [filteredOrders]);

  return (
    <div className="bg-[#1a0000] min-h-screen text-[#ffcccc] p-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        
        <div className="flex items-center gap-6">
          <SearchAndFilter 
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            dateFilter={dateFilter}
            onDateFilterChange={(e) => setDateFilter(e.target.value)}
          />
          
          <div className="flex items-center gap-3 bg-[#2a0000] px-3 py-1.5 rounded-lg">
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="Admin"
              className="w-8 h-8 rounded-full border border-[#ff3d3d]"
            />
            <span className="text-sm font-semibold">Oscar M.</span>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {filteredOrders.length > 0 ? (
              <>   
        <SummaryCard 
          title="Total Revenue" 
          value={`KSh ${summary.totalRevenue.toLocaleString() || "0"}`} 
          icon={<DollarSign size={20} className="text-[#ff3d3d]" />}
          color="border-l-4 border-[#ff3d3d]"
        />
        
        <SummaryCard 
          title="Total Orders"  
          value={summary.totalOrders ?? "0"} 
          icon={<ShoppingCart size={20} className="text-[#ffcc00]" />}
          color="border-l-4 border-[#ffcc00]"
        />
        <SummaryCard 
          title="Products Sold" 
          value={summary.productsSold ?? "0"} 
          icon={<Package size={20} className="text-[#00cc66]" />}
          color="border-l-4 border-[#00cc66]"
        />
        <SummaryCard 
          title="Pending Orders" 
          value={summary.pendingOrders ?? "0"} 
          icon={<Clock size={20} className="text-[#ff9966]" />}
          color="border-l-4 border-[#ff9966]"
        />
        <SummaryCard 
          title="Active Customers" 
          value={summary.activeCustomers ?? "0"} 
          icon={<UserPlus size={20} className="text-[#9966ff]" />}
          color="border-l-4 border-[#9966ff]"
        />
        </>
         ) : (
                          
        'No matching results found'
                          
                        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <SalesChart  data={salesChartData} />
        
<PieChartData data={categoryChartData} />


  <BarChartData data={growthChartData} title="Customer Growth (last_login)" dataKey="users" barColor="#ffcc00" />
  <BarChartData data={ordersByDeliveryDate} title="Orders by Delivery Date" dataKey="orders" barColor="#33ccff" />



        <div className="bg-[#330000] p-6 rounded-lg">
          <h3 className="text-white mb-4 font-semibold">Recent Orders ({filteredOrders.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-[#550000]">
                <tr>
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.order_id} className="border-b border-[#550000] hover:bg-[#2a0000]">
                      <td className="py-3">{order.order_id}</td>
                      <td>{order.first_name} {order.second_name}</td>
                      <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
                      <td>KSh {order.total}</td>
                      <td>
<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
    order.status === 'Processing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
    order.status === 'Shipped' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
    order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
    order.status === 'Completed' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
    order.status === 'Refunded' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
    'bg-gray-500/20 text-gray-300 border border-gray-500/30'
  }`}>
    {order.status}
  </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-[#ff9999]">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}