import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Search, Filter, Sparkles, Package } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setCategories([...new Set(data.map((p: Product) => p.category))]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "all" ? true : p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      
      {/* Hero Header */}
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
            <Sparkles size={36} />
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Our Collection
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            opacity: 0.95,
            margin: 0
          }}>
            Discover our handcrafted candles
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Search & Filter Bar */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          marginTop: '-30px',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} size={20} />
              <input
                type="text"
                placeholder="Search candles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <Filter size={18} color="#667eea" />
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Categories
                </h3>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setSearchTerm("");
                  }}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    ...(activeCategory === "all" ? {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    } : {
                      background: '#f3f4f6',
                      color: '#6b7280'
                    })
                  }}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchParams({ category: cat });
                      setSearchTerm("");
                    }}
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      ...(activeCategory === cat ? {
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)'
                      } : {
                        background: '#f3f4f6',
                        color: '#6b7280'
                      })
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <Package size={24} color="#667eea" />
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            {filtered.length} Products
          </h2>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            marginBottom: '60px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid #f3f4f6',
              borderTop: '5px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginTop: '20px',
              fontWeight: '600'
            }}>
              Loading...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            marginBottom: '60px'
          }}>
            <Package size={64} color="#d1d5db" style={{ margin: '0 auto 20px' }} />
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#6b7280',
              marginBottom: '10px'
            }}>
              No Products Found
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#9ca3af',
              marginBottom: '24px'
            }}>
              {searchTerm ? "Try a different search" : "No products in this category"}
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchTerm("");
              }}
              style={{
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              View All
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
            paddingBottom: '60px'
          }}>
            {filtered.map(p => (
              <ProductCard
                key={p._id}
                product={{
                  _id: p._id,
                  name: p.name,
                  price: p.price,
                  image_url: p.image,
                  category: p.category,
                }}
              />
            ))}
          </div>
        )}

      </div>

      {/* CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        button:hover {
          transform: translateY(-2px);
        }

        input:focus {
          border-color: #667eea !important;
        }
      `}</style>
    </div>
  );
};

export default Products;