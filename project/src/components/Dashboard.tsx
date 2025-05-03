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

<<<<<<< HEAD
  // Check if all modules are completed
  const isCourseCompleted = () => {
    return courseModules.every(module => userProgress[module.id]);
  };

  // show spinner until both progress & paymentStatus have loaded
=======
>>>>>>> 92ca750c24f921bab02e1cb41f7511e99b7dc2e2
  if (loading || paymentStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Learning Journey</h1>

<<<<<<< HEAD
      {/* Course Completion Message */}
      {isCourseCompleted() && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Congratulations! 🎉</h2>
              <p className="text-lg text-gray-700">
                You have successfully completed all TouRide modules! Your certificate is ready.
              </p>
            </div>
            <Link
              to="/completion"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Certificate
            </Link>
          </div>
        </div>
      )}

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
=======
      <div className="relative">
        {/* Overlay and grid for all modules */}
        {paymentStatus !== 'paid' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="flex flex-col items-center pointer-events-auto px-6 py-6 rounded-2xl shadow-2xl border border-gray-200" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)', minWidth: 280 }}>
              <div className="flex flex-col items-center mb-3">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-blue-500 mb-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 17v2m6-6V9a6 6 0 10-12 0v4M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z' /></svg>
                <div className="text-center text-lg font-semibold text-gray-800">
                  Unlock all modules by purchasing the <span className="text-blue-600 font-bold">TouRide Modules</span>.
>>>>>>> 92ca750c24f921bab02e1cb41f7511e99b7dc2e2
                </div>
              </div>
              <Link
                to="/payment"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-base transition-all duration-200 mt-2 shadow-lg"
                style={{ pointerEvents: 'auto' }}
              >
                Pay to Access All
              </Link>
            </div>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courseModules.map((module, index) => {
            const isCompleted = !!userProgress[module.id];
            const isAccessible = canAccessModule(index);
            const shouldBlur = paymentStatus !== 'paid' && index !== 0 && !isAccessible;
            return (
              <div
                key={module.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${shouldBlur ? 'blur-[8px]' : ''}`}
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
      </div>
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
