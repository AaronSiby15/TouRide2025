import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Car, Clipboard, FileText } from 'lucide-react';

// 1. Load your Stripe publishable key (from .env or however you prefer)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    icon?: React.ReactNode;
}

export default function PaymentPage() {
    // 2. Define your cart items
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'TouRide Module',
            price: 20.0,
            quantity: 1,
            icon: <Car className="h-8 w-8 text-blue-600" />
        },
        {
            id: 2,
            name: 'TouRide Module Premium I',
            price: 40.0,
            quantity: 1,
            icon: <Clipboard className="h-8 w-8 text-blue-600" />
        },
        {
            id: 3,
            name: 'TouRide Module Premium II',
            price: 60.0,
            quantity: 1,
            icon: <FileText className="h-8 w-8 text-blue-600" />
        }
    ]);

    // 3. Calculate totals
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = 0; // or calculate if needed
    const total = subTotal + tax;

    // 4. Handle Stripe checkout
    const handleCheckout = async () => {
        try {
            // a) Load Stripe
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe could not be loaded.');
            }

            // b) Call your Express backend to create a checkout session
            //    This example assumes your server is at http://localhost:3000
            //    and has a POST route /api/create-checkout-session
            const response = await fetch('http://localhost:3000/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems }),
            });

            const data = await response.json();

            // c) If you get back a Stripe Checkout URL, redirect
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned from server.', data);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Page</h1>

            {/* Cart Items */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6 mb-8">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 px-4 text-left">Product</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-left">Quantity</th>
                            <th className="py-3 px-4 text-left">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => {
                            const itemTotal = item.price * item.quantity;
                            return (
                                <tr key={item.id} className="border-b">
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </td>
                                    <td className="py-3 px-4">${item.price.toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                        {/* If you want the user to change quantity, you can keep this input */}
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value, 10);
                                                setCartItems((prev) =>
                                                    prev.map((ci) =>
                                                        ci.id === item.id ? { ...ci, quantity: newQuantity } : ci
                                                    )
                                                );
                                            }}
                                            className="w-16 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-4">${itemTotal.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 max-w-sm ml-auto">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">Sub Total</span>
                    <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 border-t pt-2">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Pay ${total.toFixed(2)}
                </button>
            </div>
        </div>
    );
}
