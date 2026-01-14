import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, MapPin, User, Phone, Mail, ArrowLeft, CheckCircle, Package, Sparkles } from "lucide-react";

const Checkout: React.FC = () => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <Package size={80} color="#d1d5db" style={{ margin: '0 auto 24px' }} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Your cart is empty
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            Add some products before checkout
          </p>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '16px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            <ArrowLeft size={20} />
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckCircle size={60} color="white" />
          </div>
          <h1 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Order Placed! 🎉
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '16px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setOrderPlaced(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <CreditCard size={40} />
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Checkout
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            opacity: 0.95,
            margin: 0
          }}>
            Complete your order
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginTop: '-30px',
          paddingBottom: '60px'
        }}>
          
          {/* Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
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
                <Package size={24} color="white" />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>
                Order Summary
              </h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px',
              maxHeight: '300px',
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 4px 0'
                    }}>
                      {item.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#667eea',
                    margin: 0
                  }}>
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '2px solid #e5e7eb',
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#6b7280', fontSize: '16px' }}>Subtotal</span>
                <span style={{ fontWeight: '600', fontSize: '16px' }}>Rs {cartTotal.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <span style={{ color: '#6b7280', fontSize: '16px' }}>Shipping</span>
                <span style={{ fontWeight: '600', fontSize: '16px', color: '#10b981' }}>FREE</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Total
                </span>
                <span style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Rs {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
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
                Shipping Details
              </h2>
            </div>

            <form onSubmit={handlePlaceOrder} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 46px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 46px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Phone *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 46px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin style={{
                    position: 'absolute',
                    left: '14px',
                    top: '14px',
                    color: '#9ca3af'
                  }} size={20} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, apartment, etc."
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 46px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* City & Zip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Colombo"
                    required
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10000"
                    required
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <CreditCard size={22} />
                Place Order
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* CSS */}
      <style>{`
        input:focus, textarea:focus {
          border-color: #667eea !important;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default Checkout;