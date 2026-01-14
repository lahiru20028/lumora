import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Admin credentials check
    if (email === 'admin@lumora.com' && password === 'admin123') {
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        role: 'admin',
        name: 'Admin'
      }));
      navigate('/admin');
    } else {
      // Normal user login
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        role: 'user',
        name: email.split('@')[0]
      }));
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      
      {/* Login Card */}
      <div style={{
        background: 'white',
        borderRadius: '30px',
        padding: '48px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <Sparkles size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
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
              color: '#667eea',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        input:focus {
          border-color: #667eea !important;
        }
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;