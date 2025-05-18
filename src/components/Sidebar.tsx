"use client"; // Add this line because usePathname is a client hook

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  FaTachometerAlt,
  FaIndustry,
  FaLeaf,
  FaChartBar,
  FaFileAlt,
  FaQuestionCircle,
  FaLightbulb,
} from 'react-icons/fa';

// Define the type for navigation items
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

// List of environmental facts
const ecoFacts = [
  "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
  "Deforestation accounts for about 10% of the world's greenhouse gas emissions.",
  "Turning off lights when leaving a room can save significant energy over time.",
  "A dripping faucet can waste over 3,000 gallons of water per year.",
  "Using reusable bags can save hundreds of plastic bags per person annually.",
  "Planting trees helps absorb CO2, a major greenhouse gas.",
  "Reducing meat consumption can lower your carbon footprint significantly.",
];

export default function Sidebar() {
  const pathname = usePathname();
  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ecoFacts.length);
    setCurrentFact(ecoFacts[randomIndex]);
  }, []);

  const navItems: NavItem[] = [
    // { href: '/', label: 'Authentication', icon: FaTachometerAlt },
    { href: '/calculator', label: 'Carbon Calculator', icon: FaIndustry },
    { href: '/initiatives', label: 'Preventive Measures', icon: FaLeaf },
    { href: '/analytics', label: 'Analytics', icon: FaChartBar },
    { href: '/reports', label: 'Generate Reports', icon: FaFileAlt },
    { href: '/chatbot', label: 'Help & Support', icon: FaQuestionCircle },
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-green-800 text-white p-5 flex flex-col justify-between">
      <div> {/* Wrapper for top content (Logo + Nav) */}
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white p-1.5 rounded-full">
            <FaLeaf className="text-green-700 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">EcoBuddy</h2>
            <p className="text-xs text-green-200">Solutions</p>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-full transition-all duration-200 ease-in-out font-semibold ${
                      isActive
                        ? 'bg-lime-400 text-green-900'
                        : 'hover:bg-green-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div> {/* ✅ Correctly closed wrapper div */}

      {/* Did You Know Section - Updated Styling */}
      {/* Changed bg, added shadow-inner, adjusted text colors, increased rounded */}
      <div className="mt-8 p-4 bg-green-600 rounded-xl border border-green-500 shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <FaLightbulb className="text-yellow-300 text-lg flex-shrink-0" /> {/* Added flex-shrink-0 */}
          {/* Adjusted heading text color */}
          <h3 className="font-semibold text-sm text-green-50">Did you know?</h3>
        </div>
        {/* Adjusted fact text color */}
        <p className="text-xs text-green-100 leading-relaxed">
          {currentFact}
        </p>
      </div>
    </aside>
  );
}
