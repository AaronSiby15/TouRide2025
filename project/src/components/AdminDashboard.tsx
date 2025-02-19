import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, BookOpen, Settings } from 'lucide-react';

interface UserStats {
  total_users: number;
  active_users: number;
  completed_users: number;
}

interface ModuleStats {
  module_id: string;
  title: string;
  completion_count: number;
}

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user statistics
      const { data: { users }, error: usersError } = await supabase.rpc('get_user_stats');
      if (usersError) throw usersError;

      // Fetch module completion statistics
      const { data: moduleData, error: moduleError } = await supabase.rpc('get_module_stats');
      if (moduleError) throw moduleError;

      setUserStats(users[0]);
      setModuleStats(moduleData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.total_users}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Learners</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.active_users}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Course Completions</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.completed_users}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Completion Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Module Completion Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {moduleStats.map((module) => (
                <tr key={module.module_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {module.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {module.completion_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}