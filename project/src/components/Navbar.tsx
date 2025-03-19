import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, LogOut, Trophy } from 'lucide-react';
import { supabase, checkIsAdmin } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

interface NavbarProps {
  session: Session | null; // The user session from Supabase
}

export default function Navbar({ session }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session) {
      checkIsAdmin().then(setIsAdmin);
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TouRides</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">

            {/* <Link
              to="/about"
              className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/about' ? 'bg-gray-100' : ''
                }`}
            >
              About
            </Link> */}

            {/* Back to Dashboard button (now styled consistently) */}
            {session && (
              <Link
                to="/dashboard"
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-gray-100' : ''
                  }`}
              >
                Course Content
              </Link>
            )}

            {!session ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ml-3"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">

                {/* <Link
                  to="/dashboard"
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-gray-100' : ''
                    }`}
                >
                  Dashboard
                </Link> */}

                <Link
                  to="/completion"
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center ${location.pathname === '/completion' ? 'bg-gray-100' : ''
                    }`}
                >
                  <Trophy className="h-5 w-5 mr-1" />
                  Progress
                </Link>

                <Link
                  to="/payment"
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/payment' ? 'bg-gray-100' : ''
                    }`}
                >
                  Payment
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin' ? 'bg-gray-100' : ''
                      }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
