import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Upload, Package, DollarSign, TrendingUp, Sparkles, Search } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  description: string;
  rating: number;
}

const API_URL = "http://localhost:5000/api/products";
const CLOUD_NAME = "djagmseqe";
const UPLOAD_PRESET = "lumora_products";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    description: "",
    rating: "4.5",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const avgPrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)
    : 0;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uploadImage = async (file: File) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      setUploading(false);
      return json.secure_url;
    } catch {
      setUploading(false);
      alert("Image upload failed");
      return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      image: "",
      stock: "",
      description: "",
      rating: "4.5",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
    };

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      fetchProducts();
      resetForm();
    } catch {
      alert("Save failed ❌");
    }
  };

  const handleEdit = (p: Product) => {
    setFormData({
      name: p.name || "",
      price: p.price ? p.price.toString() : "",
      category: p.category || "",
      image: p.image || "",
      stock: p.stock ? p.stock.toString() : "",
      description: p.description || "",
      rating: p.rating ? p.rating.toString() : "4.5",
    });

    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "32px 16px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Sparkles size={48} />
            <div>
              <h1 style={{ 
                fontSize: "48px", 
                fontWeight: "bold", 
                margin: "0 0 8px 0" 
              }}>
                Admin Dashboard
              </h1>
              <p style={{ 
                fontSize: "20px", 
                opacity: 0.9, 
                margin: 0 
              }}>
                Manage your Lumora Candles inventory
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "32px"
        }}>
          
          {/* Total Products */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "20px",
            padding: "32px",
            color: "white",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
            transition: "transform 0.3s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ 
                  fontSize: "12px", 
                  fontWeight: "600", 
                  marginBottom: "8px", 
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  Total Products
                </p>
                <p style={{ 
                  fontSize: "56px", 
                  fontWeight: "bold", 
                  margin: "0 0 8px 0" 
                }}>
                  {totalProducts}
                </p>
                <p style={{ 
                  fontSize: "14px", 
                  opacity: 0.8 
                }}>
                  Active in store
                </p>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                padding: "20px"
              }}>
                <Package size={48} />
              </div>
            </div>
          </div>

          {/* Total Stock */}
          <div style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: "20px",
            padding: "32px",
            color: "white",
            boxShadow: "0 10px 30px rgba(240, 147, 251, 0.4)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ 
                  fontSize: "12px", 
                  fontWeight: "600", 
                  marginBottom: "8px", 
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  Total Stock
                </p>
                <p style={{ 
                  fontSize: "56px", 
                  fontWeight: "bold", 
                  margin: "0 0 8px 0" 
                }}>
                  {totalStock}
                </p>
                <p style={{ 
                  fontSize: "14px", 
                  opacity: 0.8 
                }}>
                  Items available
                </p>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                padding: "20px"
              }}>
                <TrendingUp size={48} />
              </div>
            </div>
          </div>

          {/* Average Price */}
          <div style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: "20px",
            padding: "32px",
            color: "white",
            boxShadow: "0 10px 30px rgba(79, 172, 254, 0.4)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ 
                  fontSize: "12px", 
                  fontWeight: "600", 
                  marginBottom: "8px", 
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  Average Price
                </p>
                <p style={{ 
                  fontSize: "56px", 
                  fontWeight: "bold", 
                  margin: "0 0 8px 0" 
                }}>
                  Rs {avgPrice}
                </p>
                <p style={{ 
                  fontSize: "14px", 
                  opacity: 0.8 
                }}>
                  Per product
                </p>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                padding: "20px"
              }}>
                <DollarSign size={48} />
              </div>
            </div>
          </div>

        </div>

        {/* Search & Add Button */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            
            {/* Search */}
            <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
              <Search style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999"
              }} size={20} />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 48px",
                  fontSize: "16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  outline: "none"
                }}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "16px 32px",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
              }}
            >
              <Plus size={20} /> Add New Product
            </button>
          </div>
        </div>

        {/* Products Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <Package size={32} color="#667eea" />
            Your Products ({filteredProducts.length})
          </h2>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              borderRadius: "24px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              
              {/* Modal Header */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px 32px",
                borderRadius: "24px 24px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white"
              }}>
                <h2 style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <Sparkles size={28} />
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={resetForm}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white"
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginBottom: "20px"
                }}>
                  
                  <div>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                      🏷️ Product Name *
                    </label>
                    <input
                      name="name"
                      placeholder="e.g., Lavender Bliss Candle"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "10px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                      💰 Price (Rs) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "10px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                      📂 Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "10px",
                        outline: "none"
                      }}
                    >
                      <option value="Flower">🌸 Flower</option>
                      <option value="Glass">🥃 Glass</option>
                      <option value="Seasonal">🎄 Seasonal</option>
                      <option value="Others">✨ Others</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                      📦 Stock
                    </label>
                    <input
                      name="stock"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.stock}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "10px",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                    🖼️ Product Image
                  </label>
                  <div style={{
                    border: "2px dashed #667eea",
                    borderRadius: "16px",
                    padding: "32px",
                    textAlign: "center",
                    background: "#f8f9ff"
                  }}>
                    <Upload style={{ margin: "0 auto 12px" }} size={40} color="#667eea" />
                    <p style={{ marginBottom: "12px", fontWeight: "600" }}>
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files) return;
                        const url = await uploadImage(e.target.files[0]);
                        if (url) setFormData({ ...formData, image: url });
                      }}
                    />
                  </div>

                  {uploading && (
                    <p style={{ 
                      textAlign: "center", 
                      color: "#667eea", 
                      fontWeight: "600", 
                      marginTop: "12px" 
                    }}>
                      Uploading image...
                    </p>
                  )}

                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "16px",
                        marginTop: "16px"
                      }}
                    />
                  )}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                    📝 Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Tell us about this amazing product..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "10px",
                      outline: "none",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    padding: "16px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  {editingId ? "✅ Update Product" : "➕ Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Products Display */}
        {loading ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "80px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}>
            <p style={{ fontSize: "18px", color: "#666" }}>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "80px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}>
            <Package size={80} color="#ccc" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "20px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>
              {searchTerm ? "No products found" : "No products yet"}
            </p>
            <p style={{ color: "#999" }}>
              {searchTerm ? "Try a different search term" : "Add your first product to get started!"}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s"
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover"
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: p.stock > 10 ? "#4ade80" : p.stock > 0 ? "#fbbf24" : "#ef4444",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                  }}>
                    {p.stock} in stock
                  </span>
                </div>

                <div style={{ padding: "20px" }}>
                  <span style={{
                    display: "inline-block",
                    background: "#e0e7ff",
                    color: "#667eea",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "12px"
                  }}>
                    {p.category}
                  </span>

                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#333"
                  }}>
                    {p.name}
                  </h3>

                  <p style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#667eea",
                    marginBottom: "16px"
                  }}>
                    Rs {p.price}
                  </p>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleEdit(p)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px"
                      }}
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#ef4444",
                        color: "white",
                        padding: "12px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px"
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;