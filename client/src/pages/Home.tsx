import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Award, Truck, Phone, Mail, MapPin, Facebook, Video, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

const Home: React.FC = () => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: Product[] = await res.json();
        
        const targetNames = [
          "two color glass candle",
          "peony flower candle",
          "rose candle",
          "cup candle"
        ];

        // 1. Find specific popular items
        let finalProducts = data.filter(p => 
          targetNames.some(name => p.name.toLowerCase().trim() === name.toLowerCase().trim())
        );

        // 2. If fewer than 4, fill with other available products from API
        if (finalProducts.length < 4) {
          const others = data.filter(p => !finalProducts.includes(p));
          finalProducts = [...finalProducts, ...others];
        }

        // 3. If still fewer than 4 (e.g. empty DB), fill with defaults
        if (finalProducts.length < 4) {
           // Filter defaults to avoid duplicates if any match (though unlikely with IDs)
           const needed = 4 - finalProducts.length;
           finalProducts = [...finalProducts, ...defaultPopularProducts.slice(0, needed)];
        }

        // 4. Ensure exactly 4 items (original logic)
        // setPopularProducts(finalProducts.slice(0, 4)); 

        // UPDATED LOGIC: Ensure enough items for smooth looping (at least 8)
        let displayProducts = finalProducts.slice(0, 4);
        // Duplicate them to create a longer list for smooth infinite scrolling
        displayProducts = [...displayProducts, ...displayProducts]; 
        
        setPopularProducts(displayProducts);

      } catch (error) {
        console.error("Error fetching popular products, using defaults:", error);
        // Duplicate defaults too
        setPopularProducts([...defaultPopularProducts, ...defaultPopularProducts]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const defaultPopularProducts: Product[] = [
    {
      _id: 'default_1',
      name: 'Two Color Glass Candle',
      price: 1250,
      category: 'Glass',
      image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800',
      description: 'Elegant dual-tone glass candle that adds a modern touch to your decor.'
    },
    {
      _id: 'default_2',
      name: 'Peony Flower Candle',
      price: 1450,
      category: 'Flower',
      image: 'https://plus.unsplash.com/premium_photo-1670355464165-2767096e23b6?auto=format&fit=crop&q=80&w=800',
      description: 'Intricately designed peony shape with a soft, floral fragrance.'
    },
    {
      _id: 'default_3',
      name: 'Rose Candle',
      price: 1350,
      category: 'Flower',
      image: 'https://images.unsplash.com/photo-1596436579997-7501b44cb587?auto=format&fit=crop&q=80&w=800',
      description: 'Classic rose design that brings romance and elegance to any room.'
    },
    {
      _id: 'default_4',
      name: 'Cup Candle',
      price: 950,
      category: 'Glass',
      image: 'https://images.unsplash.com/photo-1543365067-fa127a3c3f91?auto=format&fit=crop&q=80&w=800',
      description: 'Simple and versatile cup candle, perfect for daily use.'
    }
  ];

  return (
    <div style={{ background: '#f5f3f0' }}>
      
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
        color: '#d4c9b8',
        padding: '40px 16px 60px',
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
            <Sparkles size={32} style={{ animation: 'pulse 2s infinite' }} />
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              Lumora Candles
            </h1>
          </div>
          
          <p style={{
            fontSize: '14px',
            marginBottom: '32px',
            opacity: 0.95
          }}>
            ✨ Handcrafted candles that brighten your life and space ✨
          </p>
          
          {/* Popular Items Carousel */}
          {loading ? (
             <div style={{ color: '#d4c9b8' }}>Loading popular items...</div>
          ) : (
            <>
              <style>{`
                .swiper-pagination-bullet {
                  background: #d4c9b8 !important;
                  opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                  background: #4a6741 !important; /* Green active dot */
                  opacity: 1;
                }
                .popular-swiper {
                  padding-bottom: 40px !important; /* Space for pagination */
                  padding-left: 4px;
                  padding-right: 4px;
                }
              `}</style>
              
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', position: 'relative' }}>
                
                {/* Custom Navigation Buttons */}
                <button 
                  className="custom-prev-btn"
                  onClick={() => swiperRef.current?.slidePrev()}
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '40%',
                    zIndex: 20,
                    transform: 'translateY(-50%) translate(-20px, 0)',
                    background: 'rgba(74, 103, 65, 0.9)',
                    color: '#d4c9b8',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <ChevronLeft size={24} />
                </button>

                <button 
                  className="custom-next-btn"
                  onClick={() => swiperRef.current?.slideNext()}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '40%',
                    zIndex: 20,
                    transform: 'translateY(-50%) translate(20px, 0)',
                    background: 'rgba(74, 103, 65, 0.9)',
                    color: '#d4c9b8',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <ChevronRight size={24} />
                </button>

                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  pagination={{ clickable: true }}
                  loop={true}
                  grabCursor={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  className="popular-swiper"
                >
                  {popularProducts.map((product, index) => (
                    <SwiperSlide key={`${product._id}-${index}`}>
                      <div style={{ textAlign: 'left', height: '100%' }}>
                        <ProductCard 
                          product={{
                            ...product,
                            image_url: product.image
                          }} 
                          compact={true}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us - Stats Cards */}
      <section style={{
        maxWidth: '1200px',
        margin: '-20px auto 0',
        padding: '0 16px 32px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #6b8e6f 0%, #4a6741 100%)',
            borderRadius: '8px',
            padding: '16px',
            color: '#d4c9b8',
            boxShadow: '0 2px 8px rgba(106, 142, 111, 0.2)',
            textAlign: 'center'
          }}>
            <Heart size={28} style={{ marginBottom: '8px', margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              Handmade
            </h3>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>With Love & Care</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #5a7d60 0%, #3a5231 100%)',
            borderRadius: '8px',
            padding: '16px',
            color: '#d4c9b8',
            boxShadow: '0 2px 8px rgba(74, 103, 65, 0.2)',
            textAlign: 'center'
          }}>
            <Award size={28} style={{ marginBottom: '8px', margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              Premium
            </h3>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>Quality Materials</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #7a9a7b 0%, #5a7d60 100%)',
            borderRadius: '8px',
            padding: '16px',
            color: '#d4c9b8',
            boxShadow: '0 2px 8px rgba(90, 125, 96, 0.2)',
            textAlign: 'center'
          }}>
            <Truck size={28} style={{ marginBottom: '8px', margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              Fast
            </h3>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>Free Delivery</p>
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
        padding: '0 16px 32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4a6741 0%, #6b8e6f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              About Lumora Candles
            </h2>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(135deg, #4a6741 0%, #6b8e6f 100%)',
              margin: '0 auto',
              borderRadius: '1px'
            }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                🕯️ Our Story
              </h3>
              <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#6b7280'
              }}>
                Lumora Candles was born from a passion for creating beautiful, handcrafted candles that bring warmth and light into every home. Each candle is carefully made with premium natural ingredients.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                🌿 Our Values
              </h3>
              <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#6b7280'
              }}>
                We believe in sustainability, quality, and craftsmanship. Every candle is made with eco-friendly materials and packaged with care for the environment. Your satisfaction is our priority.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                ✨ Our Promise
              </h3>
              <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
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
        padding: '0 16px 32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(74, 103, 65, 0.15)',
          color: '#d4c9b8'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              📞 Contact Us
            </h2>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>
              We'd love to hear from you!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            
            {/* Phone */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <Phone size={20} />
              </div>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                Phone
              </h3>
              <a href="tel:+94703527374" style={{ color: 'inherit', textDecoration: 'none', fontSize: '11px', opacity: 0.9 }}>
                +94 70 352 7374
              </a>
            </div>

            {/* Email */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <Mail size={20} />
              </div>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                Email
              </h3>
              <a href="mailto:lumora20250909@gmail.com" style={{ color: 'inherit', textDecoration: 'none', fontSize: '11px', opacity: 0.9, wordBreak: 'break-all' }}>
                lumora20250909@gmail.com
              </a>
            </div>

            {/* WhatsApp */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <MessageCircle size={20} />
              </div>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                WhatsApp
              </h3>
              <a href="https://wa.me/94703527374" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontSize: '11px', opacity: 0.9 }}>
                +94 70 352 7374
              </a>
            </div>

            {/* Facebook */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <Facebook size={20} />
              </div>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                Facebook
              </h3>
              <a href="https://web.facebook.com/profile.php?id=61581403703247" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontSize: '11px', opacity: 0.9 }}>
                Lumora candles
              </a>
            </div>

            {/* TikTok */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <Video size={20} />
              </div>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                TikTok
              </h3>
              <a href="https://tiktok.com/@lumora.candles7" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontSize: '11px', opacity: 0.9 }}>
                lumora.candles7
              </a>
            </div>

            {/* Location */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            className="contact-card">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <MapPin size={20} />
              </div>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                Location
              </h3>
              <p style={{
                fontSize: '11px',
                opacity: 0.9,
                margin: 0
              }}>
                Horana, Sri Lanka
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Copyright Footer */}
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
          transform: translateY(-4px);
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