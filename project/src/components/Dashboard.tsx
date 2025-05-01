import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { courseModules } from '../lib/courseData';
import { CheckCircle, Lock } from 'lucide-react';
import ChatBot from './ChatBot';

export default function Dashboard() {
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'paid' | 'unpaid'>('loading');

  useEffect(() => {
    fetchUserProgress();
    checkPaymentStatus();
  }, []);

  // Fetch which modules the user has completed
  const fetchUserProgress = async () => {
    try {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('module_id, completed');

      const progressMap: Record<string, boolean> = {};
      progress?.forEach(p => {
        if (p.module_id) progressMap[p.module_id] = !!p.completed;
      });

      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setPaymentStatus('unpaid');
        return;
      }

      const { data, error } = await supabase
        .from('user_payments')
        .select('paid')
        .eq('id', user.id)
        .eq('product_id', '1')
        .single();

      if (error || data?.paid !== true) {
        setPaymentStatus('unpaid');
      } else {
        setPaymentStatus('paid');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setPaymentStatus('unpaid');
    }
  };

  // Module 1 (index 0) is always open and  Modules 2+ require payment, then sequential completion
  const canAccessModule = (moduleIndex: number) => {
    if (moduleIndex === 0) {
      return true;
    }
    if (paymentStatus !== 'paid') {
      return false;
    }
    // after paying, must complete previous
    const prevId = courseModules[moduleIndex - 1].id;
    return !!userProgress[prevId];
  };

  // show spinner until both progress & paymentStatus have loaded
  if (loading || paymentStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Payment Status Alert */}
      {paymentStatus === 'paid' ? (
        <div className="p-4 bg-green-100 text-green-700 rounded mb-6">
          TouRide Module Payment Successful
        </div>
      ) : (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-6">
          Please purchase {' '}
          <Link to="/payment" className="font-semibold text-blue-600 underline hover:text-blue-800">
            TouRide Module
          </Link>{' '} TouRide Module to unlock further content (Module 2-9)
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Learning Journey</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courseModules.map((module, index) => {
          const isCompleted = !!userProgress[module.id];
          const isAccessible = canAccessModule(index);

          return (
            <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : !isAccessible ? (
                    <Lock className="h-6 w-6 text-gray-400" />
                  ) : null}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Duration: {module.duration} minutes
                </div>
                {isAccessible ? (
                  <Link
                    to={`/module/${module.id}`}
                    className={`block text-center py-2 px-4 rounded-md ${isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {isCompleted ? 'Review Module' : 'Start Module'}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full py-2 px-4 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    {index === 0 ? 'Start Module' : 'Locked'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
