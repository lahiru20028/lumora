import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Sparkles } from "lucide-react";

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart } = useCart();

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
            <ShoppingBag size={40} />
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Shopping Cart
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            opacity: 0.95,
            margin: 0
          }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {cartItems.length === 0 ? (
          
          /* Empty Cart */
          <div style={{
            background: 'white',
            borderRadius: '30px',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginTop: '-30px',
            marginBottom: '60px'
          }}>
            <ShoppingBag size={80} color="#d1d5db" style={{ margin: '0 auto 24px' }} />
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '32px'
            }}>
              Start adding some beautiful candles!
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
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>

        ) : (
          
          /* Cart Items */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            marginTop: '-30px',
            paddingBottom: '60px'
          }}>
            
            {/* Cart Items List */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Sparkles size={24} color="#667eea" />
                Cart Items
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cartItems.map(item => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '20px',
                      padding: '20px',
                      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                      borderRadius: '16px',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px'
                      }}>
                        {item.name}
                      </h3>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                      }}>
                        Rs {item.price}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* Price & Remove */}
                    <div style={{
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      alignItems: 'flex-end'
                    }}>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1f2937'
                      }}>
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Order Summary
              </h2>

              {/* Summary Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>Rs {cartTotal.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  <span>Shipping</span>
                  <span style={{ 
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    FREE
                  </span>
                </div>
              </div>

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
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

              {/* Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <Link
                  to="/checkout"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '18px',
                    fontSize: '18px',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s'
                  }}
                >
                  <CreditCard size={22} />
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    background: '#f3f4f6',
                    color: '#1f2937',
                    padding: '18px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <ArrowLeft size={20} />
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CSS */}
      <style>{`
        a:hover, button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default Cart;