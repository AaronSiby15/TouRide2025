import React, { useState } from 'react';
import { Car } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    icon?: React.ReactNode;
}

export default function PaymentPage() {
    const [cartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'TouRide Module',
            price: 20.0,
            quantity: 1,
            icon: <Car className="h-8 w-8 text-blue-600" />,
        },
    ]);

    const subTotal = cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const total = subTotal; // does not include tax

    const handleCheckout = async () => {
        // get the current Supabase user
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
            return alert('You must be signed in to pay');
        }
        const userId = session.user.id;

        try {
            // strip out any non-serializable props
            const items = cartItems.map(({ name, price, quantity }) => ({
                name,
                price,
                quantity,
            }));

            const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, userId }),
            });

            const { url, error } = await res.json();
            if (error) {
                console.error('Stripe error:', error);
                return alert(error);
            }
            // redirect into hosted Checkout
            window.location.href = url;
        } catch (err) {
            console.error(err);
            alert('Could not start checkout. Check console for details.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Your Order</h1>

            <table className="w-full border-collapse mb-6">
                <thead>
                    <tr className="border-b">
                        <th className="py-2 text-left">Product</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => {
                        const lineTotal = item.price * item.quantity;
                        return (
                            <tr key={item.id} className="border-b">
                                <td className="py-2 flex items-center space-x-2">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </td>
                                <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">${lineTotal.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-lg">Total:</span>
                <span className="font-bold text-2xl">${total.toFixed(2)}</span>
            </div>

            <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
                Pay ${total.toFixed(2)}
            </button>
        </div>
    );
}
