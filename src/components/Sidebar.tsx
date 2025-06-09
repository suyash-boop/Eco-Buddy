"use client";

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
  FaBars,
  FaTimes,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ecoFacts.length);
    setCurrentFact(ecoFacts[randomIndex]);
  }, []);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems: NavItem[] = [
    { href: '/calculator', label: 'Carbon Calculator', icon: FaIndustry },
    { href: '/initiatives', label: 'Preventive Measures', icon: FaLeaf },
    { href: '/analytics', label: 'Analytics', icon: FaChartBar },
    { href: '/reports', label: 'Generate Reports', icon: FaFileAlt },
    { href: '/chatbot', label: 'Help & Support', icon: FaQuestionCircle },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Floating Menu Button - Only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-green-800 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-110"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-lg" />
          ) : (
            <FaBars className="text-lg" />
          )}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-45 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-45 w-64 h-screen bg-green-800 text-white p-5 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Header */}
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
            <ul className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <li 
                    key={item.href}
                    className={`
                      transform transition-all duration-300 ease-out
                      ${isMobileMenuOpen 
                        ? `translate-x-0 opacity-100` 
                        : 'md:translate-x-0 md:opacity-100 -translate-x-4 opacity-0 md:opacity-100'
                      }
                    `}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-medium
                        transform hover:scale-105 hover:shadow-lg
                        ${isActive
                          ? 'bg-lime-400 text-green-900 shadow-lg'
                          : 'hover:bg-green-700 hover:text-white hover:translate-x-1'
                        }
                      `}
                      onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="text-lg flex-shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Did You Know Section */}
        <div 
          className={`
            mt-8 p-4 bg-green-600 rounded-xl border border-green-500 shadow-inner
            transform transition-all duration-500 ease-out
            ${isMobileMenuOpen 
              ? 'translate-y-0 opacity-100' 
              : 'md:translate-y-0 md:opacity-100 translate-y-4 opacity-0 md:opacity-100'
            }
          `}
          style={{
            transitionDelay: isMobileMenuOpen ? '400ms' : '0ms'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FaLightbulb className="text-yellow-300 text-lg flex-shrink-0 animate-pulse" />
            <h3 className="font-semibold text-sm text-green-50">Did you know?</h3>
          </div>
          <p className="text-xs text-green-100 leading-relaxed">
            {currentFact}
          </p>
        </div>
      </aside>

      {/* Desktop Spacer - Only on desktop to push content right */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
