import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Award, ShoppingBag, LogOut, Edit2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      await signOut();
      navigate('/');
    }
  };

  const handleSwitchAccount = async () => {
    localStorage.removeItem('user');
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 24px 40px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            border: '4px solid rgba(255,255,255,0.3)'
          }}>
            <User size={50} />
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            textShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {user.name}
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.95,
            margin: 0
          }}>
            {user.email}
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: '16px',
            padding: '8px 20px',
            background: user.role === 'admin' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(96, 165, 250, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {user.role === 'admin' ? '👑 Admin Account' : '👤 User Account'}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Profile Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '-30px',
          marginBottom: '60px'
        }}>
          
          {/* Account Information Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={24} color="white" />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>
                Account Info
              </h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <Mail size={20} color="#667eea" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    Email Address
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: '#1f2937',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <Award size={20} color="#667eea" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    Account Type
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: '#1f2937',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <Calendar size={20} color="#667eea" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    Member Since
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: '#1f2937',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    January 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={24} color="white" />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>
                Quick Actions
              </h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s'
                  }}
                >
                  <ShoppingBag size={20} />
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#f3f4f6',
                  color: '#1f2937',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                <ShoppingBag size={20} />
                Browse Products
              </Link>

              <button
                onClick={handleSwitchAccount}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#f3f4f6',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  width: '100%',
                  fontSize: '16px'
                }}
              >
                <Edit2 size={20} />
                Switch Account
              </button>

              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: '#f3f4f6',
                  color: '#1f2937',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                <User size={20} />
                Add New Account
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s',
                  width: '100%',
                  fontSize: '16px'
                }}
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* CSS */}
      <style>{`
        a:hover, button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Profile;