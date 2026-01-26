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
      background: '#f5f3f0'
    }}>
      
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
        color: '#d4c9b8',
        padding: '32px 16px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Sparkles size={24} />
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              Our Collection
            </h1>
          </div>
          <p style={{
            fontSize: '12px',
            opacity: 0.95,
            margin: 0
          }}>
            Discover our handcrafted candles
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Search & Filter Bar */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '-12px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} size={16} />
              <input
                type="text"
                placeholder="Search candles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 8px 8px 36px',
                  fontSize: '13px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
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
                gap: '8px',
                marginBottom: '6px'
              }}>
                <Filter size={14} color="#4a6741" />
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#4a6741',
                  margin: 0
                }}>
                  Categories
                </h3>
              </div>

              <div style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setSearchTerm("");
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    ...(activeCategory === "all" ? {
                      background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                      color: '#d4c9b8',
                      boxShadow: '0 2px 6px rgba(74, 103, 65, 0.3)'
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
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      ...(activeCategory === cat ? {
                        background: 'linear-gradient(135deg, #6b8e6f 0%, #5a7d60 100%)',
                        color: '#d4c9b8',
                        boxShadow: '0 2px 6px rgba(107, 142, 111, 0.3)'
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
          <Package size={24} color="#4a6741" />
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#4a6741',
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
              width: '40px',
              height: '40px',
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #4a6741',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              marginTop: '12px',
              fontWeight: '600'
            }}>
              Loading...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            marginBottom: '32px'
          }}>
            <Package size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              No Products Found
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '16px'
            }}>
              {searchTerm ? "Try a different search" : "No products in this category"}
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchTerm("");
              }}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                color: '#d4c9b8',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(74, 103, 65, 0.3)'
              }}
            >
              View All
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px',
            paddingBottom: '32px'
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
          border-color: #4a6741 !important;
        }
      `}</style>

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
    </div>
  );
};

export default Products;