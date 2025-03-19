import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { courseModules } from '../lib/courseData';
import { CheckCircle, Lock } from 'lucide-react';

export default function Dashboard() {
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Tracks payment status for product #1
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'paid' | 'unpaid'>('loading');

  useEffect(() => {
    fetchUserProgress();
    checkPaymentStatus();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*');

      const progressMap = {};
      progress?.forEach(p => {
        progressMap[p.module_id] = p.completed;
      });

      setUserProgress(progressMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const canAccessModule = (moduleIndex) => {
    if (moduleIndex === 0) return true;
    const previousModule = courseModules[moduleIndex - 1];
    return userProgress[previousModule.id];
  };

  // 2. Check if user paid for product #1 in 'user_payments'
  const checkPaymentStatus = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        setPaymentStatus('unpaid');
        return;
      }
      if (!user) {
        // No user => not paid
        setPaymentStatus('unpaid');
        return;
      }

      const { data, error } = await supabase
        .from('user_payments') // your table name
        .select('paid')
        .eq('id', user.id)      // matching user’s UUID
        .eq('product_id', '1')  // or your product
        .single();

      if (error) {
        console.error('Error fetching payment record:', error);
        setPaymentStatus('unpaid');
      } else {
        setPaymentStatus(data?.paid ? 'paid' : 'unpaid');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setPaymentStatus('unpaid');
    }
  };

  // 3. Show spinner while loading
  if (loading || paymentStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          TouRide Module Payment Unsuccessful
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Learning Journey</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courseModules.map((module, index) => {
          const isCompleted = userProgress[module.id];
          const isAccessible = canAccessModule(index);

          return (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : !isAccessible ? (
                    <Lock className="h-6 w-6 text-gray-400" />
                  ) : null}
                </div>
                <p className="text-gray-600 mb-4">{module.content}</p>
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
                    Complete Previous Module First
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}