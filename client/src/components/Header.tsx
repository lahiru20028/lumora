import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../LOGO.png';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#4a6741',
      borderBottom: '2px solid #3a5231',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>

          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <img 
              src={logo} 
              alt="Lumora Candles" 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #d4c9b8'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#d4c9b8',
                letterSpacing: '1px',
                lineHeight: '1.2'
              }}>
                Lumora Candles
              </span>
              <span style={{
                fontSize: '11px',
                color: '#d4c9b8',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                opacity: 0.9
              }}>
                Light + Aura
              </span>
            </div>
          </Link>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

            {/* Account Section - Conditional Rendering */}
            {user ? (
              // Logged In - Show Account Dropdown
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#d4c9b8'
                  }}
                >
                  <User size={22} />
                  <ChevronDown size={16} />
                </button>

                {accountDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '260px',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                  }}>

                    {/* User Info */}
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <strong style={{ display: 'block' }}>Logged In</strong>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {user.email}
                      </span>
                    </div>

                    {/* My Profile Link */}
                    <Link
                      to="/profile"
                      onClick={() => setAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        fontSize: '14px',
                        color: '#374151',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                    >
                      <User size={18} color="#4a6741" />
                      My Profile
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={async () => {
                        await signOut();
                        setAccountDropdown(false);
                        navigate('/');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444'
                      }}
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not Logged In - Show Login Button
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  color: '#4a6741',
                  fontWeight: '600',
                  background: '#d4c9b8',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <User size={20} />
                Please Login
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                color: '#4a6741',
                fontWeight: '600',
                background: '#d4c9b8'
              }}>
                <ShoppingCart size={20} />
                Cart
                {cartCount > 0 && (
                  <span style={{
                    background: '#6b8e6f',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: '#d4c9b8'
                  }}>
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{ background: 'none', border: 'none', color: '#d4c9b8', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mobile-menu">
            {user && (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ color: '#d4c9b8', textDecoration: 'none' }}>My Profile</Link>
                <button
                  onClick={async () => {
                    await signOut();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '16px',
                    borderBottom: '1px solid #3a5231',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#d4c9b8', textDecoration: 'none', display: 'block', padding: '16px', borderBottom: '1px solid #3a5231' }}>Please Login</Link>
            )}
          </nav>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: block !important; }
          .mobile-menu a {
            display: block;
            padding: 16px;
            border-bottom: 1px solid #eee;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
