import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Car, Clipboard, FileText } from 'lucide-react';
import VisaLogo from '../images/visa-logo.png';
import MasterCardLogo from '../images/mastercard-logo.png';

// 1. Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    icon?: React.ReactNode;
}

interface CardErrors {
    cardNumber?: string;
    expiration?: string;
    securityCode?: string;
    nameOnCard?: string;
}

export default function PaymentPage() {
    // Cart items
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

    // Payment method tabs
    const [paymentMethod, setPaymentMethod] = useState<'applepay' | 'paypal' | 'card'>('card');

    // Form fields for card details
    const [cardNumber, setCardNumber] = useState('');
    const [expiration, setExpiration] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    // Errors for each field
    const [errors, setErrors] = useState<CardErrors>({});

    // Totals
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = 0;
    const total = subTotal + tax;

    // Handle Stripe checkout (if paying by card, for example)
    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe could not be loaded.');
            }

            const response = await fetch('http://localhost:3000/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned from server.', data);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // remove non-digits
        if (val.length > 16) {
            val = val.slice(0, 16);
        }
        setCardNumber(val);
    };

    const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // remove non-digits
        let val = e.target.value.replace(/\D/g, '');
        // max length 4 digits
        if (val.length > 6) {
            val = val.slice(0, 4);
        }
        // insert slash after first 2 digits => "MM/YY"
        if (val.length > 2) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        setExpiration(val);
    };

    const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 3) {
            val = val.slice(0, 3);
        }
        setSecurityCode(val);
    };

    // Validate fields before processing payment
    const handlePayClick = () => {
        const newErrors: CardErrors = {};

        // Card Number must be 16 digits
        if (cardNumber.length < 16) {
            newErrors.cardNumber = 'Please enter a 16-digit card number.';
        }

        // Expiration must be "MM/YY" => total length 5
        if (expiration.length < 5) {
            newErrors.expiration = 'Please enter an expiration date in MM/YY format.';
        }

        // Security code must be 3 digits
        if (securityCode.length < 3) {
            newErrors.securityCode = 'Please enter a 3-digit security code.';
        }

        // Name on card cannot be empty
        if (!nameOnCard.trim()) {
            newErrors.nameOnCard = 'Please enter the name on the card.';
        }

        setErrors(newErrors);

        // If no errors, proceed to Stripe
        if (Object.keys(newErrors).length === 0) {
            handleCheckout();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
            <h3 className="text-lg text-gray-700 mb-8">
                Unlock Course Content &amp; Achieve TouRide Certificate!
            </h3>

            {/* 2-column layout: Order summary on the left, Payment details on the right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column: Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Your order</h2>

                    {/* Big total at top */}
                    <div className="text-2xl font-bold mb-2">
                        US${total.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Billed once (no monthly fee)</p>

                    {/* Cart Items */}
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-4 text-left">Product</th>
                                    <th className="py-3 px-4 text-left">Price</th>
                                    <th className="py-3 px-4 text-left">Qty</th>
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

                    {/* Subtotal / Tax / Total */}
                    <div className="space-y-2 text-sm border-t pt-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                            <span>Total Due</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-1">Payment</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        All transactions are secure and encrypted.
                    </p>

                    {/* Payment Method Radios */}
                    <div className="space-y-4">
                        {/* Credit Card Option */}
                        <label className="flex items-center justify-between w-full cursor-pointer py-2">
                            {/* Left side: Radio + "Credit card" text */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">Credit card</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <img src={VisaLogo} alt="Visa" className="h-7 object-contain" />
                                <img src={MasterCardLogo} alt="MasterCard" className="h-7 object-contain" />
                                <span className="text-xs text-gray-500">and more...</span>
                            </div>
                        </label>

                        {/* PayPal Option */}
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={() => setPaymentMethod('paypal')}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 font-medium">PayPal</span>
                        </label>
                    </div>

                    {paymentMethod === 'paypal' && (
                        <div className="text-gray-700">
                            PayPal integration goes here.
                            <p className="mt-4 text-sm">
                                (You could redirect to a PayPal link or embed a PayPal button.)
                            </p>
                        </div>
                    )}

                    {paymentMethod === 'card' && (
                        <div className="mt-4">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Card number</label>
                                    <input
                                        type="text"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        className={`w-full mt-1 p-2 rounded border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.cardNumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Expiration date</label>
                                        <input
                                            type="text"
                                            placeholder="MM / YYYY"
                                            value={expiration}
                                            onChange={handleExpirationChange}
                                            maxLength={7}
                                            className={`w-full mt-1 p-2 rounded border ${errors.expiration ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.expiration && (
                                            <p className="text-red-500 text-sm mt-1">{errors.expiration}</p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Security code</label>
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            value={securityCode}
                                            onChange={handleSecurityCodeChange}
                                            maxLength={3}
                                            className={`w-full mt-1 p-2 rounded border ${errors.securityCode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.securityCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.securityCode}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name on card</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                        className={`w-full mt-1 p-2 rounded border ${errors.nameOnCard ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.nameOnCard && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePayClick}
                                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Pay ${total.toFixed(2)}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
