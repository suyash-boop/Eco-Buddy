"use client"; // Required for useState, useEffect, and event handlers

import Link from 'next/link';
import Image from 'next/image'; // Assuming you might want your logo
import React, { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

export default function SignInPage() {
  // ADD THIS LOG: See if the component function body is entered
  console.log("SignInPage component rendering...");

  const router = useRouter(); // Hook for navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    // ADD THIS LINE: Log immediately upon entry
    console.log("handleSignIn function entered!");
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Attempting Supabase sign in with:", email); // Log email being used
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // Log the immediate result from Supabase
      console.log("Supabase signInWithPassword result:", { signInData, signInError });

      if (signInError) {
        console.error("Supabase sign in error object:", signInError);
        throw signInError; // Throw error to be caught below
      }

      // Check if user/session data exists in the response
      if (!signInData.session || !signInData.user) {
         console.error("Sign in successful according to Supabase, but session or user data is missing in the response!");
         throw new Error("Authentication succeeded but session data is missing.");
      }

      // Explicitly check client-side session *after* successful sign in
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Client-side session check immediately after sign in:", currentSession);

      if (!currentSession) {
          console.error("Client-side session is STILL null immediately after successful sign in!");
          // Don't redirect if the session isn't confirmed client-side
          throw new Error("Client-side session not established after sign-in.");
      }

      console.log("Sign in successful, session confirmed client-side, attempting full page redirect.");

      // Use window.location.assign for a full page navigation
      window.location.assign('/'); // Redirect to the root path

    } catch (err: any) {
      console.error("Error during sign in process:", err);
      // Use err.message which might come from Supabase or our custom errors
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false); // Ensure loading is reset on any error
    }
    // No finally block needed if redirect happens
  };

  return (
    // Removed the outer full-screen div.
    // Added a container to center the form within the main layout area.
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Reverted background to white, kept dark mode variant */}
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
        {/* Optional: Logo */}
        <div className="flex justify-center">
           {/* ... logo/title ... */}
           <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">EcoBuddy</h1>
        </div>

        {/* Reverted text color to default (dark text on light bg) */}
        <h2 className="mt-6 text-center text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>

        {/* Updated form to use onSubmit */}
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {/* Removed action and method attributes */}
          {/* Keep hidden field for CSRF protection if needed later */}
          <input type="hidden" name="remember" defaultValue="true" />
          {/* Display error message if present */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              {/* Updated input to be controlled */}
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email} // Bind value to state
                onChange={(e) => setEmail(e.target.value)} // Update state on change
                disabled={loading} // Disable input when loading
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              {/* Updated input to be controlled */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password} // Bind value to state
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                disabled={loading} // Disable input when loading
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                // Reverted checkbox styles to original
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
              />
              {/* Reverted label text color to original */}
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              {/* Reverted link color to original */}
              <Link href="#" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            {/* Updated button to handle loading state AND ADD onClick */}
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              // ADD THIS onClick HANDLER FOR DEBUGGING
              onClick={() => console.log("Sign in BUTTON clicked!")}
              className={`group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : '' // Style for loading state
              }`}
            >
              {loading ? 'Signing In...' : 'Sign in'} {/* Change text when loading */}
            </button>
          </div>
        </form>

        {/* Reverted text color to original */}
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          {/* Reverted link color to original */}
          <Link href="/signup" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
            create an account
          </Link>
        </p>
      </div>
    </div>
  );
}