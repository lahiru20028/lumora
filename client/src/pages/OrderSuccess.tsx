import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed and will be shipped soon.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <p className="text-sm text-gray-600 mb-2">Order Number</p>
          <p className="text-2xl font-bold text-gray-900">#ORDER-2024</p>
          <p className="text-sm text-gray-600 mt-4">
            You will receive an email confirmation shortly with tracking information.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/products"
            className="block bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="block text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <footer
        style={{
          background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
          borderTop: "2px solid #3a5231",
          padding: "24px 16px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        <p style={{ fontSize: "13px", color: "#d4c9b8", margin: 0, fontWeight: "500" }}>
          © 2025 Lumora Candles. Handcrafted with love.
        </p>
      </footer>
};
