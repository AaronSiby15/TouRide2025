import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PaymentSuccess() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function markAsPaid() {
            try {
                // 1. Get the currently logged-in user
                const {
                    data: { user },
                    error: userError
                } = await supabase.auth.getUser();

                if (userError) {
                    console.error('Error fetching user:', userError);
                    setLoading(false);
                    return;
                }

                if (!user) {
                    // If no user, cannot mark as paid
                    console.error('No user found; cannot mark as paid');
                    setLoading(false);
                    return;
                }

                // 2. Upsert payment record for product #1
                const { error: upsertError } = await supabase
                    .from('user_payments') // user_payment created in supabase SQL editor
                    .upsert({
                        id: user.id,        // storing user.id in "id" column
                        product_id: '1',    // product #1 (TouRide Module)
                        paid: true
                    });

                if (upsertError) {
                    console.error('Error marking payment as paid:', upsertError);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                // 3. Done loading (success or fail)
                setLoading(false);
            }
        }

        markAsPaid();
    }, []);

    // Spinner while processing payment record
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-gray-700 mb-6">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Go Back to Home
                </button>
            </div>
        </div>
    );
}
