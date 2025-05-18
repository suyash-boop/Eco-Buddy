import { FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default async function DashboardPage() {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/chatbot');
  }

  return (
    <div className="space-y-6 p-4"> {/* Added p-4 for consistent padding */}

      {/* Welcome Message with User Email */}
      <div className="text-sm text-gray-600">
        Welcome, <span className="font-medium">{session.user.email}</span>
      </div>

      {/* Top Row: Total Emissions & Scope Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Total Emissions Card (Dark Green) */}
        <div className="lg:col-span-1 bg-green-800 text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-medium text-green-200 mb-1">Total Emissions</h2>
            <p className="text-3xl font-bold">3,403,293t <span className="text-2xl font-semibold">CO2e</span></p>
          </div>
          <div className="flex items-center text-sm text-green-300 mt-3">
            <FaCheckCircle className="mr-1.5 text-lime-400" />
            <span>5% Lower to previous year</span>
          </div>
        </div>

        {/* Scope Breakdown Card (Light Background) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Scope Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Scope 1 */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Scope 1 - Direct Emissions</h3>
              <p className="text-2xl font-bold text-gray-800">359,942t <span className="text-xl font-semibold">CO2e</span></p>
            </div>
            {/* Scope 2 */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Scope 2 - Indirect Emissions</h3>
              <p className="text-2xl font-bold text-gray-800">499,923t <span className="text-xl font-semibold">CO2e</span></p>
            </div>
            {/* Scope 3 */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Scope 3 - Other Indirect Emissions</h3>
              <p className="text-2xl font-bold text-gray-800">2,359,942t <span className="text-xl font-semibold">CO2e</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Carbon Footprint Chart Card */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
          <div>
            <h3 className="text-xs font-medium text-gray-500">Monthly Emissions</h3>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Carbon Footprint</h2>
            <p className="text-2xl font-bold text-gray-800">2,332,483t <span className="text-xl font-semibold">CO2e</span></p>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md mt-3 sm:mt-0">
            <FaCalendarAlt />
            <span>January 2024 - August 2024</span>
          </button>
        </div>

        {/* Chart Placeholder */}
        <div className="h-72 bg-gray-50 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
          Chart Area Placeholder
        </div>

        {/* Chart Legend */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-gray-600">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400"></span>Technology</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-lime-500"></span>Industries</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500"></span>Vehicles</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-600"></span>Miscellaneous</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-800"></span>Buildings</div>
        </div>
      </div>

    </div>
  );
}