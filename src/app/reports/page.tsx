"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

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

interface ReportData {
  analytics: AnalyticsData;
  generatedAt: string;
  userProfile?: {
    name?: string;
    email?: string;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('ecobuddy_analytics_data');
      if (savedData) {
        const analyticsData = JSON.parse(savedData);
        setReportData({
          analytics: analyticsData,
          generatedAt: new Date().toLocaleDateString(),
          userProfile: {
            name: userName || 'User',
            email: userEmail || ''
          }
        });
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  }, [userName, userEmail]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return [16, 185, 129]; // green-500
      case 'Moderate': return [245, 158, 11]; // yellow-500
      case 'High': return [249, 115, 22]; // orange-500
      case 'Very High': return [239, 68, 68]; // red-500
      default: return [107, 114, 128]; // gray-500
    }
  };

  const getDetailedRecommendations = (categoryData: CategoryData[]) => {
    const recommendations: Record<string, { immediate: string[], shortTerm: string[], longTerm: string[], tips: string[] }> = {
      transportation: {
        immediate: [
          "Walk or bike for trips under 2 miles",
          "Combine multiple errands into one trip",
          "Use public transportation when available",
          "Practice eco-driving: smooth acceleration, maintain steady speeds"
        ],
        shortTerm: [
          "Consider carpooling or ride-sharing for regular commutes",
          "Work from home 1-2 days per week if possible",
          "Plan vacations closer to home to reduce air travel",
          "Maintain your vehicle regularly for optimal fuel efficiency"
        ],
        longTerm: [
          "Consider purchasing a hybrid or electric vehicle",
          "Move closer to work or choose jobs with shorter commutes",
          "Advocate for better public transportation in your area"
        ],
        tips: [
          "Every gallon of gasoline saved prevents 20 lbs of CO₂",
          "Air travel produces ~0.5 kg CO₂ per mile per passenger",
          "Electric vehicles can reduce transport emissions by 60-70%"
        ]
      },
      home: {
        immediate: [
          "Switch to LED bulbs (use 75% less energy)",
          "Unplug electronics when not in use",
          "Lower thermostat by 2°F in winter, raise by 2°F in summer",
          "Use cold water for washing clothes when possible"
        ],
        shortTerm: [
          "Install a programmable thermostat",
          "Seal air leaks around windows and doors",
          "Replace old appliances with ENERGY STAR certified models",
          "Switch to a renewable energy provider"
        ],
        longTerm: [
          "Install solar panels or solar water heating",
          "Upgrade home insulation and windows",
          "Consider heat pump installation for heating/cooling",
          "Install smart home energy management systems"
        ],
        tips: [
          "Heating and cooling account for ~40% of home energy use",
          "Solar panels can reduce home emissions by 80%+",
          "Proper insulation can cut energy bills by 15-20%"
        ]
      },
      food: {
        immediate: [
          "Reduce meat consumption by 1-2 meals per week",
          "Buy local produce when seasonally available",
          "Plan meals to reduce food waste",
          "Compost organic waste instead of throwing away"
        ],
        shortTerm: [
          "Start a small herb or vegetable garden",
          "Buy from farmers markets or local producers",
          "Learn to preserve seasonal foods",
          "Choose organic options for the 'Dirty Dozen' produce"
        ],
        longTerm: [
          "Transition to a more plant-based diet",
          "Install rainwater collection for garden irrigation",
          "Support regenerative agriculture practices",
          "Consider joining or starting a community garden"
        ],
        tips: [
          "Beef production creates ~60kg CO₂ per kg of meat",
          "Food waste accounts for ~8% of global emissions",
          "Local food can reduce transport emissions by 90%"
        ]
      },
      consumption: {
        immediate: [
          "Buy only what you need - practice mindful consumption",
          "Choose products with minimal packaging",
          "Repair items instead of replacing them",
          "Buy quality items that last longer"
        ],
        shortTerm: [
          "Shop at thrift stores and consignment shops",
          "Learn basic repair skills (sewing, basic electronics)",
          "Choose multi-purpose items to reduce overall purchases",
          "Support companies with strong sustainability practices"
        ],
        longTerm: [
          "Embrace minimalism and reduce overall possessions",
          "Invest in high-quality, durable goods",
          "Support circular economy initiatives",
          "Advocate for right-to-repair legislation"
        ],
        tips: [
          "The average American discards 80 lbs of clothing annually",
          "Extending clothing life by 9 months reduces emissions by 30%",
          "Buying used can reduce environmental impact by 80%"
        ]
      }
    };

    const sortedCategories = [...categoryData].sort((a, b) => b.value - a.value);
    const topCategory = sortedCategories[0];
    return recommendations[topCategory.name] || recommendations.consumption;
  };

  const generateDetailedPDF = async () => {
    if (!reportData) return;

    setGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = 0;
      
      const levelColorRGB = getLevelColor(reportData.analytics.level);

      // Helper function to add new page with header
      const addNewPage = (title: string) => {
        pdf.addPage();
        pdf.setFillColor(5, 150, 105);
        pdf.rect(0, 0, pageWidth, 25, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin, 16);
        return 40;
      };

      // PAGE 1: COVER PAGE
      pdf.setFillColor(5, 150, 105);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CARBON FOOTPRINT', pageWidth/2, 80, { align: 'center' });
      pdf.text('ASSESSMENT REPORT', pageWidth/2, 100, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Comprehensive Environmental Impact Analysis', pageWidth/2, 130, { align: 'center' });
      
      // Report details box
      pdf.setFillColor(255, 255, 255, 0.9);
      pdf.rect(40, 160, 130, 60, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Report Details', 50, 175);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Prepared for: ${userName || 'Individual Assessment'}`, 50, 185);
      if (userEmail) pdf.text(`Contact: ${userEmail}`, 50, 195);
      pdf.text(`Assessment Date: ${reportData.generatedAt}`, 50, 205);
      pdf.text(`Report ID: ECO-${Date.now().toString().slice(-6)}`, 50, 215);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text('Generated by EcoBuddy Environmental Platform', pageWidth/2, 250, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('www.ecobuddy.com | Your Environmental Companion', pageWidth/2, 260, { align: 'center' });

      // PAGE 2: EXECUTIVE SUMMARY
      yPosition = addNewPage('Executive Summary');
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Assessment Overview', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const overviewText = [
        'This comprehensive carbon footprint assessment analyzes your environmental impact across',
        'four key categories: Transportation, Home Energy, Food & Diet, and Consumption patterns.',
        'The analysis provides actionable insights to help reduce your carbon emissions and',
        'contribute to global climate action goals.'
      ];
      overviewText.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });

      // Key Metrics Box
      yPosition += 10;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, yPosition, contentWidth, 45, 'F');
      pdf.setDrawColor(229, 231, 235);
      pdf.rect(margin, yPosition, contentWidth, 45, 'S');
      
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Assessment Results', margin + 10, yPosition);
      
      yPosition += 12;
      pdf.setFontSize(18);
      pdf.setTextColor(levelColorRGB[0], levelColorRGB[1], levelColorRGB[2]);
      pdf.text(`${Math.round(reportData.analytics.total)} kg CO₂e`, margin + 10, yPosition);
      pdf.setFontSize(10);
      pdf.text('Annual Carbon Footprint', margin + 10, yPosition + 6);
      
      pdf.setFontSize(14);
      pdf.text(`${reportData.analytics.level} Impact`, margin + 80, yPosition);
      pdf.setFontSize(10);
      pdf.text('Environmental Impact Level', margin + 80, yPosition + 6);
      
      // Global context
      yPosition += 25;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Global Context & Benchmarking', margin, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const globalAvg = 4800;
      const developedAvg = 9200;
      const targetEmissions = 2000;
      
      const benchmarks = [
        { label: 'Global Average (2023)', value: globalAvg, comparison: reportData.analytics.total > globalAvg ? 'above' : 'below' },
        { label: 'Developed Countries Average', value: developedAvg, comparison: reportData.analytics.total > developedAvg ? 'above' : 'below' },
        { label: 'Paris Agreement Target (2030)', value: targetEmissions, comparison: reportData.analytics.total > targetEmissions ? 'above' : 'below' }
      ];
      
      benchmarks.forEach(benchmark => {
        pdf.text(`• ${benchmark.label}: ${benchmark.value} kg CO₂e`, margin + 5, yPosition);
        pdf.setTextColor(benchmark.comparison === 'above' ? 239 : 16, benchmark.comparison === 'above' ? 68 : 185, benchmark.comparison === 'above' ? 68 : 129);
        pdf.text(`(${Math.round(((reportData.analytics.total - benchmark.value) / benchmark.value) * 100)}% ${benchmark.comparison})`, margin + 100, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 8;
      });

      // Category breakdown chart
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Emissions by Category', margin, yPosition);
      
      yPosition += 10;
      const categoryColors = [[59, 130, 246], [16, 185, 129], [245, 158, 11], [239, 68, 68]];
      
      reportData.analytics.categoryData.forEach((category, index) => {
        const barWidth = (category.value / reportData.analytics.total) * (contentWidth - 80);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const categoryName = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        pdf.text(categoryName, margin, yPosition + 4);
        
        const categoryColor = categoryColors[index % categoryColors.length];
        pdf.setFillColor(categoryColor[0], categoryColor[1], categoryColor[2]);
        pdf.rect(margin + 40, yPosition, barWidth, 8, 'F');
        
        pdf.setFontSize(8);
        pdf.text(`${Math.round(category.value)} kg CO₂e`, margin + 45 + barWidth, yPosition + 5);
        pdf.text(`(${category.percentage}%)`, margin + 45 + barWidth + 35, yPosition + 5);
        
        yPosition += 12;
      });

      // PAGE 3: DETAILED CATEGORY ANALYSIS
      yPosition = addNewPage('Detailed Category Analysis');
      
      reportData.analytics.categoryData.forEach((category, index) => {
        if (yPosition > 250) {
          yPosition = addNewPage('Detailed Category Analysis (Continued)');
        }
        
        const categoryName = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const textColor = categoryColors[index % categoryColors.length];
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`${categoryName} Analysis`, margin, yPosition);
        
        yPosition += 8;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Category stats
        pdf.text(`Annual Emissions: ${Math.round(category.value)} kg CO₂e`, margin + 5, yPosition);
        yPosition += 6;
        pdf.text(`Percentage of Total: ${category.percentage}%`, margin + 5, yPosition);
        yPosition += 6;
        
        // Category-specific insights
        const insights: Record<string, string[]> = {
          transportation: [
            `Daily impact: ~${Math.round(category.value / 365)} kg CO₂e`,
            'Primary sources: Vehicle fuel, air travel, public transport',
            'Reduction potential: 30-60% through behavior changes'
          ],
          home: [
            `Monthly impact: ~${Math.round(category.value / 12)} kg CO₂e`,
            'Primary sources: Electricity, heating, cooling, appliances',
            'Reduction potential: 20-50% through efficiency improvements'
          ],
          food: [
            `Weekly impact: ~${Math.round(category.value / 52)} kg CO₂e`,
            'Primary sources: Meat consumption, food transport, packaging',
            'Reduction potential: 25-70% through dietary changes'
          ],
          consumption: [
            `Per purchase impact varies significantly`,
            'Primary sources: Manufacturing, shipping, packaging, disposal',
            'Reduction potential: 40-80% through conscious consumption'
          ]
        };
        
        const categoryInsights = insights[category.name] || insights.consumption;
        categoryInsights.forEach(insight => {
          pdf.text(`• ${insight}`, margin + 5, yPosition);
          yPosition += 6;
        });
        
        yPosition += 10;
      });

      // PAGE 4: COMPREHENSIVE RECOMMENDATIONS
      yPosition = addNewPage('Comprehensive Action Plan');
      
      const topCategory = [...reportData.analytics.categoryData].sort((a, b) => b.value - a.value)[0];
      const recommendations = getDetailedRecommendations(reportData.analytics.categoryData);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Priority Focus: ${topCategory.name.charAt(0).toUpperCase() + topCategory.name.slice(1)}`, margin, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`This category represents ${topCategory.percentage}% of your carbon footprint`, margin, yPosition);
      pdf.text(`Potential annual reduction: ${Math.round(topCategory.value * 0.4)} kg CO₂e`, margin, yPosition + 6);
      
      yPosition += 20;
      
      // Immediate Actions
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(16, 185, 129);
      pdf.text('Immediate Actions (Start Today)', margin, yPosition);
      
      yPosition += 8;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      recommendations.immediate.forEach((action) => {
        if (yPosition > 270) {
          yPosition = addNewPage('Action Plan (Continued)');
        }
        pdf.setFillColor(16, 185, 129);
        pdf.circle(margin + 3, yPosition - 1, 1, 'F');
        const lines = pdf.splitTextToSize(action, contentWidth - 15);
        pdf.text(lines, margin + 8, yPosition);
        yPosition += lines.length * 5 + 3;
      });
      
      yPosition += 8;
      
      // Short-term Actions
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(245, 158, 11);
      pdf.text('Short-term Goals (1-6 months)', margin, yPosition);
      
      yPosition += 8;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      recommendations.shortTerm.forEach((action) => {
        if (yPosition > 270) {
          yPosition = addNewPage('Action Plan (Continued)');
        }
        pdf.setFillColor(245, 158, 11);
        pdf.circle(margin + 3, yPosition - 1, 1, 'F');
        const lines = pdf.splitTextToSize(action, contentWidth - 15);
        pdf.text(lines, margin + 8, yPosition);
        yPosition += lines.length * 5 + 3;
      });

      // PAGE 5: LONG-TERM STRATEGY & IMPACT PROJECTIONS
      yPosition = addNewPage('Long-term Strategy & Impact Projections');
      
      // Long-term Actions
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('Long-term Investments (6+ months)', margin, yPosition);
      
      yPosition += 8;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      recommendations.longTerm.forEach((action) => {
        pdf.setFillColor(59, 130, 246);
        pdf.circle(margin + 3, yPosition - 1, 1, 'F');
        const lines = pdf.splitTextToSize(action, contentWidth - 15);
        pdf.text(lines, margin + 8, yPosition);
        yPosition += lines.length * 5 + 3;
      });
      
      yPosition += 15;
      
      // Impact Projections
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Projected Impact & Savings', margin, yPosition);
      
      yPosition += 12;
      const scenarios = [
        { name: 'Conservative (20% reduction)', reduction: 0.2, timeframe: '1 year' },
        { name: 'Moderate (40% reduction)', reduction: 0.4, timeframe: '2 years' },
        { name: 'Aggressive (60% reduction)', reduction: 0.6, timeframe: '3 years' }
      ];
      
      scenarios.forEach(scenario => {
        const newTotal = Math.round(reportData.analytics.total * (1 - scenario.reduction));
        const annualSaving = Math.round(reportData.analytics.total * scenario.reduction);
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(scenario.name, margin, yPosition);
        
        yPosition += 7;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`• Target footprint: ${newTotal} kg CO₂e annually`, margin + 5, yPosition);
        yPosition += 5;
        pdf.text(`• Annual savings: ${annualSaving} kg CO₂e`, margin + 5, yPosition);
        yPosition += 5;
        pdf.text(`• Timeframe: ${scenario.timeframe}`, margin + 5, yPosition);
        yPosition += 5;
        
        // Environmental equivalence
        const treesEquivalent = Math.round(annualSaving / 21); // 1 tree absorbs ~21kg CO2/year
        const milesEquivalent = Math.round(annualSaving / 0.41); // ~0.41kg CO2/mile driving
        
        pdf.text(`• Equivalent to: ${treesEquivalent} trees planted or ${milesEquivalent} miles not driven`, margin + 5, yPosition);
        yPosition += 10;
      });
      
      // Tips and Facts
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Facts & Tips', margin, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      recommendations.tips.forEach(tip => {
        pdf.setFillColor(107, 114, 128);
        pdf.rect(margin + 2, yPosition - 2, 2, 2, 'F');
        const lines = pdf.splitTextToSize(tip, contentWidth - 15);
        pdf.text(lines, margin + 8, yPosition);
        yPosition += lines.length * 5 + 3;
      });

      // PAGE 6: APPENDIX & METHODOLOGY
      yPosition = addNewPage('Methodology & Data Sources');
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Calculation Methodology', margin, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      const methodology = [
        'This assessment uses established carbon footprint calculation methodologies:',
        '',
        'Transportation: Based on EPA emission factors for various transport modes,',
        'considering fuel type, efficiency, and average annual usage patterns.',
        '',
        'Home Energy: Calculated using regional electricity grid emission factors',
        'and natural gas consumption patterns, adjusted for home size and efficiency.',
        '',
        'Food & Diet: Based on life-cycle assessment data from peer-reviewed',
        'studies, considering production, processing, transport, and waste.',
        '',
        'Consumption: Estimated using expenditure-based calculations with',
        'environmentally-extended input-output models for various product categories.',
        '',
        'Data Sources:',
        '• EPA Greenhouse Gas Equivalencies Calculator',
        '• IPCC Guidelines for National Greenhouse Gas Inventories',
        '• Carnegie Mellon EIO-LCA Model',
        '• Our World in Data Environmental Database',
        '• Academic research from climate science journals'
      ];
      
      methodology.forEach(line => {
        const lines = pdf.splitTextToSize(line, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 5;
      });
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Limitations & Considerations', margin, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      const limitations = [
        '• This assessment provides estimates based on general consumption patterns',
        '• Actual emissions may vary based on specific brands, products, and behaviors',
        '• Some indirect emissions (scope 3) may not be fully captured',
        '• Regional variations in energy sources affect accuracy',
        '• Seasonal variations in behavior are averaged over the year'
      ];
      
      limitations.forEach(limitation => {
        pdf.text(limitation, margin, yPosition);
        yPosition += 6;
      });
      
      // Footer with contact and next steps
      yPosition = 270;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, yPosition, contentWidth, 20, 'F');
      
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Next Steps & Support', margin + 5, yPosition);
      
      yPosition += 6;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Visit ecobuddy.com for tracking tools, community support, and updated recommendations', margin + 5, yPosition);
      pdf.text('Follow @EcoBuddyApp for daily tips and environmental news', margin + 5, yPosition + 4);

      // Save the comprehensive PDF
      pdf.save(`EcoBuddy-Comprehensive-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating detailed PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Keep the existing UI code but update the PDF generation function call
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-center text-red-500 mb-4">No Report Data Available</h1>
          <p className="text-center mb-6">Please complete the carbon footprint calculator first to generate a report.</p>
          <div className="text-center">
            <a 
              href="/calculator" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Take Calculator
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Generate Professional Carbon Footprint Report</h1>
        
        {/* User Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name (Optional)</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email (Optional)</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Enhanced Report Preview */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Comprehensive Report Preview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Footprint</p>
              <p className={`text-2xl font-bold`} style={{ color: getLevelColor(reportData.analytics.level).map(c => `rgb(${c})`).join(',').replace(/rgb\(|\)/g, '').replace(/,/g, ', ') }}>
                {Math.round(reportData.analytics.total)} kg CO₂e
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Impact Level</p>
              <p className={`text-xl font-semibold`} style={{ color: getLevelColor(reportData.analytics.level).map(c => `rgb(${c})`).join(',').replace(/rgb\(|\)/g, '').replace(/,/g, ', ') }}>
                {reportData.analytics.level}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Report Pages</p>
              <p className="text-xl font-semibold text-blue-600">6 Pages</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Category Breakdown:</h4>
            {reportData.analytics.categoryData.map((category) => (
              <div key={category.name} className="flex justify-between items-center">
                <span className="capitalize">{category.name}</span>
                <span className="font-medium">
                  {Math.round(category.value)} kg CO₂e ({category.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Report Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">This comprehensive 6-page report includes:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">📋</span>
                <span>Professional cover page with report ID</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">📊</span>
                <span>Executive summary with key metrics</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">🔍</span>
                <span>Detailed category analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">🌍</span>
                <span>Global benchmarking & comparisons</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">🎯</span>
                <span>Comprehensive action plan (immediate, short & long-term)</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">📈</span>
                <span>Impact projections & savings scenarios</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">🔬</span>
                <span>Methodology & data sources</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">💡</span>
                <span>Expert tips & environmental facts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={generateDetailedPDF}
            disabled={generatingPDF}
            className={`px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center ${
              generatingPDF ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Generating Comprehensive PDF...
              </>
            ) : (
              <>
                <span className="mr-2">📄</span>
                Download Professional Report (6 pages)
              </>
            )}
          </button>
          
          <a 
            href="/analytics" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-center"
          >
            View Analytics Dashboard
          </a>
          
          <a 
            href="/calculator" 
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md text-center"
          >
            Retake Assessment
          </a>
        </div>
      </motion.div>
    </div>
  );
}