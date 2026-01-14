import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Star, TrendingUp, Phone, Mail, MapPin, Heart, Award, Truck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div style={{ background: '#f5f3f0' }}>
      
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
        color: '#d4c9b8',
        padding: '100px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <Sparkles size={48} style={{ animation: 'pulse 2s infinite' }} />
            <h1 style={{
              fontSize: '64px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Lumora Candles
            </h1>
          </div>
          
          <p style={{
            fontSize: '24px',
            marginBottom: '40px',
            opacity: 0.95
          }}>
            ✨ Handcrafted candles that brighten your life and space ✨
          </p>
          
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#d4c9b8',
              color: '#4a6741',
              fontWeight: 'bold',
              fontSize: '20px',
              padding: '20px 48px',
              borderRadius: '16px',
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
          >
            <ShoppingBag size={24} />
            Shop Now
          </Link>
        </div>
      </section>

      {/* Why Choose Us - Stats Cards */}
      <section style={{
        maxWidth: '1200px',
        margin: '-60px auto 0',
        padding: '0 24px 80px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #6b8e6f 0%, #4a6741 100%)',
            borderRadius: '20px',
            padding: '32px',
            color: '#d4c9b8',
            boxShadow: '0 10px 40px rgba(106, 142, 111, 0.4)',
            textAlign: 'center'
          }}>
            <Heart size={48} style={{ marginBottom: '16px', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Handmade
            </h3>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>With Love & Care</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #5a7d60 0%, #3a5231 100%)',
            borderRadius: '20px',
            padding: '32px',
            color: '#d4c9b8',
            boxShadow: '0 10px 40px rgba(74, 103, 65, 0.4)',
            textAlign: 'center'
          }}>
            <Award size={48} style={{ marginBottom: '16px', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Premium
            </h3>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>Quality Materials</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #7a9a7b 0%, #5a7d60 100%)',
            borderRadius: '20px',
            padding: '32px',
            color: '#d4c9b8',
            boxShadow: '0 10px 40px rgba(90, 125, 96, 0.4)',
            textAlign: 'center'
          }}>
            <Truck size={48} style={{ marginBottom: '16px', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Fast
            </h3>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>Free Delivery</p>
          </div>

        </div>
      </section>

      {/* Categories Section - NEW EMOJIS */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#4a6741',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          🎨 Shop by Category
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {[
            { name: 'Flower', emoji: '🌸', gradient: 'linear-gradient(135deg, #6b8e6f 0%, #4a6741 100%)' },
            { name: 'Glass', emoji: '🥃', gradient: 'linear-gradient(135deg, #5a7d60 0%, #3a5231 100%)' },
            { name: 'Seasonal', emoji: '🎄', gradient: 'linear-gradient(135deg, #7a9a7b 0%, #5a7d60 100%)' },
            { name: 'Others', emoji: '✨', gradient: 'linear-gradient(135deg, #8aad82 0%, #6b8e6f 100%)' }
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              style={{
                background: category.gradient,
                borderRadius: '20px',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              className="category-card"
            >
              <div style={{
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                {category.emoji}
              </div>
              <div style={{
                padding: '20px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '60px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4a6741 0%, #6b8e6f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px'
            }}>
              About Lumora Candles
            </h2>
            <div style={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(135deg, #4a6741 0%, #6b8e6f 100%)',
              margin: '0 auto',
              borderRadius: '2px'
            }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                🕯️ Our Story
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#6b7280'
              }}>
                Lumora Candles was born from a passion for creating beautiful, handcrafted candles that bring warmth and light into every home. Each candle is carefully made with premium natural ingredients.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                🌿 Our Values
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#6b7280'
              }}>
                We believe in sustainability, quality, and craftsmanship. Every candle is made with eco-friendly materials and packaged with care for the environment. Your satisfaction is our priority.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                ✨ Our Promise
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#6b7280'
              }}>
                We promise to deliver exceptional quality, unique fragrances, and a warm glow that transforms your space. Each candle is tested to ensure the perfect burn every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
          borderRadius: '30px',
          padding: '60px',
          boxShadow: '0 20px 60px rgba(74, 103, 65, 0.3)',
          color: '#d4c9b8'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              📞 Contact Us
            </h2>
            <p style={{ fontSize: '20px', opacity: 0.9 }}>
              We'd love to hear from you!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            
            {/* Phone */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Phone size={40} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                Phone
              </h3>
              <p style={{
                fontSize: '18px',
                opacity: 0.9
              }}>
                +94 77 123 4567
              </p>
            </div>

            {/* Email */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Mail size={40} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                Email
              </h3>
              <p style={{
                fontSize: '18px',
                opacity: 0.9
              }}>
                hello@lumora.com
              </p>
            </div>

            {/* Location */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <MapPin size={40} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                Location
              </h3>
              <p style={{
                fontSize: '18px',
                opacity: 0.9
              }}>
                Colombo, Sri Lanka
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '30px',
          padding: '60px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px'
          }}>
            Ready to Light Up Your Space? ✨
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            Discover our collection of handcrafted candles
          </p>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#d4c9b8',
              color: '#4a6741',
              fontWeight: 'bold',
              fontSize: '20px',
              padding: '20px 48px',
              borderRadius: '16px',
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(212, 201, 184, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
          >
            <ShoppingBag size={24} />
            Browse Collection
          </Link>
        </div>
      </section>

      {/* CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        .category-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.25) !important;
        }

        .contact-card:hover {
          transform: translateY(-8px);
        }
        
        a:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 35px rgba(74, 103, 65, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;