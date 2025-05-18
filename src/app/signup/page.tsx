"use client"; // Required for state and event handlers

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Optional: Add confirm password state if needed
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For success/info messages
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // Optional: Add password confirmation check
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   setLoading(false);
    //   return;
    // }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        // You can add options here, like redirect URLs or metadata
        // options: {
        //   emailRedirectTo: `${window.location.origin}/`, // Redirect after email confirmation
        // }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if email confirmation is required (Supabase default)
      if (data.user && data.user.identities?.length === 0) {
         // This case might happen if email confirmation is disabled, handle accordingly
         setMessage("Sign up successful! Redirecting...");
         router.push('/'); // Or redirect to a profile setup page
      } else if (data.session === null && data.user) {
         // Standard case: Email confirmation needed
         setMessage("Sign up successful! Please check your email to confirm your account.");
         // Optionally clear form or disable it
         setEmail('');
         setPassword('');
      } else {
         // Handle other potential outcomes if necessary
         setMessage("Sign up process initiated.");
      }


    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">EcoBuddy</h1>
        </div>

        <h2 className="mt-6 text-center text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          {/* Display error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          {/* Display success/info message */}
          {message && (
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm font-medium text-blue-800">{message}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !!message} // Disable if loading or success message shown
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password" // Use new-password for sign up
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!message} // Disable if loading or success message shown
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Password"
              />
            </div>
            {/* Optional: Add Confirm Password Input here */}
            {/* <div> ... input for confirmPassword ... </div> */}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!message} // Disable if loading or success message shown
              className={`group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                (loading || !!message) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}