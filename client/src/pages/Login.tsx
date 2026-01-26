import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Admin credentials check
      if (email.trim() === 'admin@lumora.com' && password === 'admin123') {
        const userData = { 
          email: email.trim(), 
          role: 'admin',
          name: 'Admin'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        await signIn(email.trim(), password);
        setLoading(false);
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/admin');
        }, 100);
      } else {
        // Normal user login - accept any email/password combination
        const userData = { 
          email: email.trim(), 
          role: 'user',
          name: email.trim().split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(userData));
        await signIn(email.trim(), password);
        setLoading(false);
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px'
    }}>
      {/* Main Content - Centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Login Card */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '360px',
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 2px 8px rgba(74, 103, 65, 0.2)'
          }}>
            <Sparkles size={28} color="#d4c9b8" />
          </div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Sign in to your Lumora account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  fontSize: '16px',
                  border: error && !email.trim() ? '2px solid #dc2626' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  fontSize: '16px',
                  border: error && !password.trim() ? '2px solid #dc2626' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            onClick={(e) => {
              // Ensure form submission works
              if (!email.trim() || !password.trim()) {
                e.preventDefault();
                setError('Please fill in all fields');
              }
            }}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              background: (loading || !email.trim() || !password.trim()) ? '#9ca3af' : 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
              color: (loading || !email.trim() || !password.trim()) ? 'white' : '#d4c9b8',
              border: 'none',
              borderRadius: '12px',
              cursor: (loading || !email.trim() || !password.trim()) ? 'not-allowed' : 'pointer',
              boxShadow: (loading || !email.trim() || !password.trim()) ? 'none' : '0 6px 20px rgba(74, 103, 65, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Info */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            Demo Credentials:
          </p>
          <p>👤 User: any email + any password</p>
          <p>🔐 Admin: admin@lumora.com / admin123</p>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/"
            style={{
              color: '#4a6741',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      </div>

      {/* CSS */}
      <style>{`
        input {
          box-sizing: border-box;
        }
        input:focus {
          border-color: #4a6741 !important;
        }
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(74, 103, 65, 0.5) !important;
        }
      `}</style>

      {/* Copyright Footer */}
      <footer
        style={{
          background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
          borderTop: "2px solid #3a5231",
          padding: "24px 16px",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <p style={{ fontSize: "13px", color: "#d4c9b8", margin: 0, fontWeight: "500" }}>
          © 2025 Lumora Candles. Handcrafted with love.
        </p>
      </footer>
    </div>
  );
};

export default Login;