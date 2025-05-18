"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'framer-motion';

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

interface AnalyticsData {
  total: number;
  level: string;
  categoryData: CategoryData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Format the category name for better display
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Only show label if the percentage is significant enough (> 5%)
  if (percent < 0.05) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      style={{ fontWeight: 'bold', fontSize: '12px', textShadow: '0 0 3px rgba(0,0,0,0.5)' }}
    >
      {`${formattedName} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // First check URL parameters
      const dataParam = searchParams.get('data');
      
      if (dataParam) {
        // If data is in URL, parse it and save to localStorage
        const parsedData = JSON.parse(dataParam);
        setAnalyticsData(parsedData);
        
        // Save to localStorage for persistence
        localStorage.setItem('ecobuddy_analytics_data', JSON.stringify(parsedData));
      } else {
        // If no URL data, try to get from localStorage
        const savedData = localStorage.getItem('ecobuddy_analytics_data');
        if (savedData) {
          setAnalyticsData(JSON.parse(savedData));
        }
      }
    } catch (error) {
      console.error('Error parsing analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-center text-red-500">No data available</h1>
          <p className="text-center mt-4">Please complete the carbon footprint calculator first.</p>
        </div>
      </div>
    );
  }

  const { total, level, categoryData } = analyticsData;

  // Get color based on impact level
  const getLevelColor = () => {
    switch (level) {
      case 'Low': return 'text-green-500';
      case 'Moderate': return 'text-yellow-500';
      case 'High': return 'text-orange-500';
      case 'Very High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Prepare comparison data
  const averageEmissions = {
    global: 4800,
    developed: 9200,
    developing: 3800,
    sustainable: 2000
  };

  const comparisonData = [
    { name: 'Your Footprint', value: total },
    { name: 'Global Average', value: averageEmissions.global },
    { name: 'Sustainable Target', value: averageEmissions.sustainable }
  ];

  // Prepare radar data
  const radarData = categoryData.map(cat => {
    // Format category names for better display
    let formattedName = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
    
    // Make longer names more readable
    if (formattedName === 'Transportation') formattedName = 'Transport';
    if (formattedName === 'Consumption') formattedName = 'Goods';
    
    return {
      subject: formattedName,
      A: cat.value,
      fullMark: Math.max(...categoryData.map(c => c.value)) * 1.2
    };
  });

  // Prepare tips based on highest emission category
  const highestCategory = [...categoryData].sort((a, b) => b.value - a.value)[0];
  
  const getTips = (category: string) => {
    switch(category) {
      case 'transportation':
        return [
          "Consider using public transportation or carpooling",
          "Walk or bike for short distances",
          "If possible, switch to an electric or hybrid vehicle",
          "Combine errands to reduce trips"
        ];
      case 'home':
        return [
          "Switch to LED light bulbs",
          "Improve home insulation",
          "Use energy-efficient appliances",
          "Consider renewable energy sources"
        ];
      case 'food':
        return [
          "Reduce meat consumption",
          "Buy local and seasonal produce",
          "Minimize food waste",
          "Grow your own vegetables if possible"
        ];
      case 'consumption':
        return [
          "Buy second-hand items when possible",
          "Repair instead of replace",
          "Choose products with minimal packaging",
          "Invest in quality items that last longer"
        ];
      default:
        return ["No specific tips available"];
    }
  };

  const tips = getTips(highestCategory.name);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">Carbon Footprint Analytics</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Detailed analysis of your carbon emissions
        </p>
        
        <div className="text-center mb-8">
          <p className="text-lg">Your estimated annual carbon footprint:</p>
          <p className={`text-4xl font-bold ${getLevelColor()}`}>
            {Math.round(total)} kg CO₂e
          </p>
          <p className={`text-xl ${getLevelColor()}`}>{level} Impact</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Emissions by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.map(item => ({
                    ...item,
                    // Format the name for legend display
                    name: item.name.charAt(0).toUpperCase() + item.name.slice(1)
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={4}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${Math.round(Number(value))} kg CO₂e`}
                  labelFormatter={(name) => name.charAt(0).toUpperCase() + name.slice(1)}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    border: 'none'
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Comparison with Averages</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${Math.round(Number(value))} kg CO₂e`} />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Emissions Profile</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius="80%" 
                data={radarData}
              >
                <PolarGrid gridType="polygon" stroke="#e0e0e0" />
                <PolarAngleAxis 
                  dataKey="subject"
                  tick={{ 
                    fill: '#666', 
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                  stroke="#888"
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 'auto']} 
                  tick={{ fill: '#666' }}
                  stroke="#888"
                  tickCount={5}
                />
                <Radar 
                  name="Carbon Emissions" 
                  dataKey="A" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                  strokeWidth={2}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Tooltip 
                  formatter={(value) => `${Math.round(Number(value))} kg CO₂e`}
                  labelFormatter={(label) => `${label} Emissions`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    border: 'none'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconSize={10}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Reduction Tips</h2>
          <p className="mb-4">Your highest emissions are from <span className="font-bold capitalize">{highestCategory.name}</span>. Here are some tips to reduce your impact:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{tip}</li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <span className="font-bold">Did you know?</span> Reducing your {highestCategory.name} emissions by just 20% could lower your total carbon footprint by approximately {Math.round(highestCategory.percentage * 0.2)}%.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 text-center"
      >
        <h2 className="text-xl font-bold mb-4">Take Action</h2>
        <p className="mb-6">Ready to reduce your carbon footprint? Check out our preventive measures for more ideas.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="/initiatives" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            View Preventive Measures
          </a>
          <a 
            href="/calculator" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Retake Calculator
          </a>
        </div>
      </motion.div>
    </div>
  );
}