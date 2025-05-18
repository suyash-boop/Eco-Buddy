"use client"; // Navbar now needs to be a client component to use context

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Import the custom hook
import { FaUserCircle } from 'react-icons/fa'; // Example avatar icon

export default function Navbar() {
  const { user, signOut, loading } = useAuth(); // Get user, signOut function, and loading state

  // Function to display username (e.g., from email)
  const getDisplayName = () => {
    if (!user) return '';
    // Use user metadata if available, otherwise fallback to email prefix
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  return (
    <header className="sticky top-0 z-30 bg-green-800 dark:bg-green-800 text-white shadow-md h-16 flex items-center justify-between px-6"> {/* Changed to justify-between */}

      {/* Left side can remain empty or add branding/title if needed */}
      <div></div>

      {/* Right side buttons/user info */}
      <div className="flex items-center gap-4">
        {/* Calculate button - always visible */}
        <Link
          href="/calculator" // Link to the main page (dashboard) or calculator page
          className="inline-block bg-white hover:bg-gray-100 text-green-800 font-semibold py-2 px-5 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-green-800"
        >
          Calculate Carbon Footprint
        </Link>

        {/* Conditional rendering based on loading and user state */}
        {loading ? (
          // Optional: Show a loading indicator while checking auth state
          <div className="text-sm text-gray-300">Loading...</div>
        ) : user ? (
          // User is logged in: Show Avatar, Name, Sign Out
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-2xl text-gray-300" /> {/* Simple Avatar */}
            <span className="text-sm font-medium">{getDisplayName()}</span>
            <button
              onClick={signOut}
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-sm transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-green-800"
            >
              Sign Out
            </button>
          </div>
        ) : (
          // User is logged out: Show Sign In button
          <Link
            href="/signin"
            className="inline-block bg-white hover:bg-gray-100 text-green-800 font-semibold py-2 px-5 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-green-800"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}