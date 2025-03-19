import { useNavigate } from 'react-router-dom';

export default function PaymentFail() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
                <p className="text-gray-700 mb-6">
                    Oops! Your payment could not be completed. Please try again or use a different method.
                </p>
                <button
                    onClick={() => navigate('/payment')}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Retry Payment
                </button>
            </div>
        </div>
    );
}
