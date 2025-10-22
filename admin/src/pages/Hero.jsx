import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';

const Hero = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [token]);

  const dashboardCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: assets.add_icon,
      color: 'bg-blue-500',
      link: '/list'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: assets.order_icon,
      color: 'bg-green-500',
      link: '/orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: assets.order_icon,
      color: 'bg-yellow-500',
      link: '/orders'
    },
    {
      title: 'Total Revenue',
      value: `$${
        typeof stats.totalRevenue === 'number' && !isNaN(stats.totalRevenue)
          ? stats.totalRevenue.toLocaleString()
          : '0'
      }`,
      icon: assets.order_icon,
      color: 'bg-purple-500',
      link: '/orders'
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome to your e-commerce management panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <NavLink key={index} to={card.link} className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <img src={card.icon} alt={card.title} className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
     

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
            <div>
              <p className="font-medium text-gray-800">New order received</p>
              <p className="text-sm text-gray-600">Order #1234 - $150.00</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">2 min ago</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <p className="font-medium text-gray-800">Product added</p>
              <p className="text-sm text-gray-600">New product "Wireless Headphones" added to catalog</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4"></div>
            <div>
              <p className="font-medium text-gray-800">Order status updated</p>
              <p className="text-sm text-gray-600">Order #1230 marked as shipped</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">3 hours ago</span>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Hero;