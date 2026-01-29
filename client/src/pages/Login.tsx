import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, UserPlus } from 'lucide-react';
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
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      if (email.trim() === 'admin@lumora.com' && password === 'admin123') {
        const userData = { email: email.trim(), role: 'admin', name: 'Admin' };
        localStorage.setItem('user', JSON.stringify(userData));
        await signIn(email.trim(), password);
        setLoading(false);
        setTimeout(() => navigate('/admin'), 100);
      } else {
        const userData = { 
          email: email.trim(), 
          role: 'user', 
          name: email.trim().split('@')[0] 
        };
        localStorage.setItem('user', JSON.stringify(userData));
        await signIn(email.trim(), password);
        setLoading(false);
        setTimeout(() => navigate('/'), 100);
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
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
              margin: '0 auto 12px'
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
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Sign in to your Lumora account
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    fontSize: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    fontSize: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                color: '#d4c9b8',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                marginTop: '10px'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* New Sign Up Button Section */}
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#4a6741', 
                fontWeight: '700', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <UserPlus size={14} /> Create Account
            </Link>
          </div>

          {/* Demo Info */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#6b7280',
            border: '1px dashed #e5e7eb'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Demo Credentials:</p>
            <p>👤 User: any email + any password</p>
            <p>🔐 Admin: admin@lumora.com / admin123</p>
          </div>

          {/* Navigation */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ color: '#4a6741', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        input:focus { border-color: #4a6741 !important; box-shadow: 0 0 0 2px rgba(74, 103, 65, 0.1); }
        button:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
        a:hover { text-decoration: underline !important; }
      `}</style>

      <footer style={{ padding: "24px 16px", textAlign: "center", marginTop: "auto" }}>
        <p style={{ fontSize: "12px", color: "#d4c9b8", margin: 0 }}>
          © 2026 Lumora Candles. Handcrafted with love.
        </p>
      </footer>
    </div>
  );
};

export default Login;