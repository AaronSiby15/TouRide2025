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

  async function fetchUserProgress() {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('module_id, completed');
      if (error) throw error;
      const map: Record<string, boolean> = {};
      progress?.forEach((p: any) => { map[p.module_id] = !!p.completed });
      setUserProgress(map);
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  }

  async function checkPaymentStatus() {
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setPaymentStatus('unpaid');
        return;
      }
      const { data, error } = await supabase
        .from('user_payments')
        .select('paid')
        .eq('id', user.id)
        .eq('product_id', '1')
        .single();
      if (error || !data?.paid) setPaymentStatus('unpaid');
      else setPaymentStatus('paid');
    } catch (err) {
      console.error('Error checking payment status:', err);
      setPaymentStatus('unpaid');
    }
  }

  function canAccessModule(idx: number) {
    if (idx === 0) return true;
    if (paymentStatus !== 'paid') return false;
    const prev = courseModules[idx - 1].id;
    return !!userProgress[prev];
  }

  function isCourseCompleted() {
    return courseModules.every(m => userProgress[m.id]);
  }

  if (loading || paymentStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Payment Alert */}
      {paymentStatus === 'paid' ? (
        <div className="p-4 bg-green-100 text-green-700 rounded mb-6">
          TouRide Module Payment Successful
        </div>
      ) : (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-6">
          Please purchase{' '}
          <Link
            to="/payment"
            className="font-semibold text-blue-600 underline hover:text-blue-800"
          >
            TouRide Module
          </Link>{' '}
          to unlock further content (Module 2–9).
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Learning Journey</h1>

      <div className="relative">
        {/* Lock overlay when not paid */}
        {paymentStatus !== 'paid' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className="flex flex-col items-center p-6 rounded-2xl shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200"
              style={{ minWidth: 280 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 17v2m6-6V9a6 6 0 10-12 0v4M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"
                />
              </svg>
              <p className="text-center text-lg font-semibold text-gray-800 mb-4">
                Unlock all modules by purchasing the{' '}
                <span className="text-blue-600 font-bold">TouRide Module</span>.
              </p>
              <Link
                to="/payment"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition"
                style={{ pointerEvents: 'auto' }}
              >
                Pay to Access All
              </Link>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courseModules.map((mod, idx) => {
            const accessible = canAccessModule(idx);
            const completed = !!userProgress[mod.id];
            return (
              <div
                key={mod.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition ${!accessible ? 'blur-sm' : ''
                  }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{mod.title}</h2>
                    {completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : !accessible ? (
                      <Lock className="h-6 w-6 text-gray-400" />
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Duration: {mod.duration} minutes
                  </p>
                  {accessible ? (
                    <Link
                      to={`/module/${mod.id}`}
                      className={`block text-center py-2 px-4 rounded-md font-medium transition ${completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {completed ? 'Review Module' : 'Start Module'}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-4 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      {idx === 0 ? 'Start Module' : 'Locked'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* If fully completed, show certificate CTA */}
      {isCourseCompleted() && (
        <section className="mt-12 p-6 bg-green-50 rounded-lg shadow-lg border border-green-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-gray-700">
                You’ve completed all modules. Your certificate is ready.
              </p>
            </div>
            <Link
              to="/completion"
              className="mt-4 md:mt-0 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              View Certificate
            </Link>
          </div>
        </section>
      )}

      {/* Embedded AI Chat Bot */}
      <div className="mt-12">
        <ChatBot />
      </div>
    </div>
  );
}
