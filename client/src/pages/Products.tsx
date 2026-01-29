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

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data: Product[] = await res.json();

        setProducts(data);
        setCategories([...new Set(data.map(p => p.category))]);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= FILTER ================= */
  const filtered = products.filter(p => {
    const matchesCategory =
      activeCategory === "all" ? true : p.category === activeCategory;

    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3f0" }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
          color: "#d4c9b8",
          padding: "32px 16px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <Sparkles size={24} />
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              Our Collection
            </h1>
          </div>
          <p style={{ fontSize: "12px", opacity: 0.95, margin: 0 }}>
            Discover our handcrafted candles
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        {/* ================= SEARCH + FILTER ================= */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "-12px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                placeholder="Search candles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 8px 8px 36px",
                  fontSize: "13px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  outline: "none",
                }}
              />
            </div>

            {/* Categories */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <Filter size={14} color="#4a6741" />
                <h3
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#4a6741",
                    margin: 0,
                  }}
                >
                  Categories
                </h3>
              </div>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setSearchTerm("");
                  }}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background:
                      activeCategory === "all"
                        ? "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)"
                        : "#f3f4f6",
                    color:
                      activeCategory === "all" ? "#d4c9b8" : "#6b7280",
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
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      background:
                        activeCategory === cat
                          ? "linear-gradient(135deg, #6b8e6f 0%, #5a7d60 100%)"
                          : "#f3f4f6",
                      color:
                        activeCategory === cat ? "#d4c9b8" : "#6b7280",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RESULT COUNT ================= */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Package size={24} color="#4a6741" />
          <h2 style={{ fontSize: "24px", color: "#4a6741", margin: 0 }}>
            {filtered.length} Products
          </h2>
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            No products found
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "12px",
              padding: "32px 0",
            }}
          >
            {filtered.map(p => (
              <ProductCard
                key={p._id}
                product={{
                  ...p,
                  image_url: p.image, // ✅ FIXED
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "13px", color: "#d4c9b8", margin: 0 }}>
          © 2025 Lumora Candles. Handcrafted with love.
        </p>
      </footer>
    </div>
  );
};

export default Products;
