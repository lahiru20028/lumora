import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, MapPin, User, Phone, Mail, ArrowLeft, CheckCircle, Package, Sparkles } from "lucide-react";

const Checkout: React.FC = () => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // State for handling order status and errors
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Redirect if cart is empty and order isn't placed
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '40px 20px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Package size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
          <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Your cart is empty</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Add some products before checkout</p>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', color: '#d4c9b8', padding: '10px 20px', fontSize: '12px', fontWeight: '600', borderRadius: '4px', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  // 2. Success View after placing order
  if (orderPlaced) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '40px 20px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={60} color="white" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#4a6741', marginBottom: '16px' }}>Order Placed! 🎉</h1>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>Thank you for your order. Your candles are being prepared!</p>
          <Link to="/" style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', color: '#d4c9b8', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // 3. Database Save Logic
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;

    if (!parsedUser) {
      setError('Please login to complete your purchase.');
      setLoading(false);
      return;
    }

    const orderPayload = {
      user: parsedUser.email, // Link to account
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        // Use image_url from CartContext so backend gets a valid image
        image: (item as any).image_url,
        price: item.price
      })),
      totalPrice: cartTotal,
      shippingDetails: formData // Optional: save address info too
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        clearCart();
        setOrderPlaced(true);
      } else {
        setError('Server rejected the order. Please try again.');
      }
    } catch (err) {
      setError('Connection to server failed. Is your backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3f0' }}>
      <div style={{ background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', color: '#d4c9b8', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>Checkout</h1>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '-20px', paddingBottom: '60px' }}>
          
          {/* Summary Box */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span>{item.name} (x{item.quantity})</span>
                <span style={{ fontWeight: 'bold' }}>Rs {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '2px solid #4a6741', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>Rs {cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Form Box */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Shipping Details</h2>
            
            {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} style={inputStyle} />
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} style={inputStyle} />
              <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} style={inputStyle} />
              <textarea name="address" placeholder="Shipping Address" required value={formData.address} onChange={handleChange} rows={3} style={inputStyle} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} style={inputStyle} />
                <input type="text" name="zipCode" placeholder="Zip" required value={formData.zipCode} onChange={handleChange} style={inputStyle} />
              </div>

              <button type="submit" disabled={loading} style={{ 
                width: '100%', padding: '16px', fontSize: '18px', fontWeight: 'bold', 
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', 
                color: '#d4c9b8', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer' 
              }}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as 'border-box'
};

export default Checkout;