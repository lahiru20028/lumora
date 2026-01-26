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
    category: "Flower",
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
      category: "Flower",
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

    // Validate required fields
    if (!formData.name) {
      alert("Product name is required");
      return;
    }
    if (!formData.price) {
      alert("Price is required");
      return;
    }
    if (!formData.category) {
      alert("Category is required");
      return;
    }
    if (!formData.image) {
      alert("Product image is required. Please upload an image.");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock) || 0,
      rating: Number(formData.rating),
    };

    try {
      const response = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save product'}`);
        return;
      }

      alert(editingId ? "Product updated successfully! ✅" : "Product added successfully! ✅");
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
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
      background: "#f5f3f0",
      padding: "16px 12px"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
          borderRadius: "8px",
          padding: "20px 24px",
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          color: "#d4c9b8"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Sparkles size={32} />
            <div>
              <h1 style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                margin: "0 0 4px 0" 
              }}>
                Admin Dashboard
              </h1>
              <p style={{ 
                fontSize: "13px", 
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
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "12px",
          marginBottom: "16px"
        }}>
          
          {/* Total Products */}
          <div style={{
            background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
            borderRadius: "8px",
            padding: "16px",
            color: "#d4c9b8",
            boxShadow: "0 2px 8px rgba(74, 103, 65, 0.2)",
            transition: "transform 0.3s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ 
                  fontSize: "11px", 
                  fontWeight: "600", 
                  marginBottom: "4px", 
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Total Products
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "bold", 
                  margin: "0 0 4px 0" 
                }}>
                  {totalProducts}
                </p>
                <p style={{ 
                  fontSize: "12px", 
                  opacity: 0.8,
                  margin: 0
                }}>
                  Active in store
                </p>
              </div>
              <Package size={32} opacity={0.6} />
            </div>
          </div>

          {/* Total Stock */}
          <div style={{
            background: "linear-gradient(135deg, #6b8e6f 0%, #5a7d60 100%)",
            borderRadius: "8px",
            padding: "16px",
            color: "#d4c9b8",
            boxShadow: "0 2px 8px rgba(107, 142, 111, 0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ 
                  fontSize: "11px", 
                  fontWeight: "600", 
                  marginBottom: "4px", 
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Total Stock
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "bold", 
                  margin: "0 0 4px 0" 
                }}>
                  {totalStock}
                </p>
                <p style={{ 
                  fontSize: "12px", 
                  opacity: 0.8,
                  margin: 0
                }}>
                  Items available
                </p>
              </div>
              <TrendingUp size={32} opacity={0.6} />
            </div>
          </div>

          {/* Average Price */}
          <div style={{
            background: "linear-gradient(135deg, #8aad82 0%, #6b8e6f 100%)",
            borderRadius: "8px",
            padding: "16px",
            color: "#d4c9b8",
            boxShadow: "0 2px 8px rgba(138, 173, 130, 0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ 
                  fontSize: "11px", 
                  fontWeight: "600", 
                  marginBottom: "4px", 
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Average Price
                </p>
                <p style={{ 
                  fontSize: "28px", 
                  fontWeight: "bold", 
                  margin: "0 0 4px 0" 
                }}>
                  Rs {avgPrice}
                </p>
                <p style={{ 
                  fontSize: "12px", 
                  opacity: 0.8,
                  margin: 0
                }}>
                  Per product
                </p>
              </div>
              <DollarSign size={32} opacity={0.6} />
            </div>
          </div>
        </div>

        {/* Search & Add Button */}
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            
            {/* Search */}
            <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
              <Search style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999"
              }} size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 8px 8px 36px",
                  fontSize: "13px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
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
                gap: "6px",
                background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                color: "#d4c9b8",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(74, 103, 65, 0.3)"
              }}
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>
        </div>

        {/* Products Header */}
        <div style={{ marginBottom: "12px" }}>
          <h2 style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#4a6741",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0
          }}>
            <Package size={20} color="#4a6741" />
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
                background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                padding: "12px 16px",
                borderRadius: "8px 8px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#d4c9b8"
              }}>
                <h2 style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <Sparkles size={20} />
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={resetForm}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "4px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white"
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: "16px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  
                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>
                      🏷️ Product Name *
                    </label>
                    <input
                      name="name"
                      placeholder="e.g., Lavender Bliss"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "13px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>
                      💰 Price (Rs) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      placeholder="1500"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "13px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>
                      📂 Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "13px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        outline: "none"
                      }}
                    >
                      <option value="">-- Select Category --</option>
                      <option value="Flower">🌸 Flower</option>
                      <option value="Glass">🥃 Glass</option>
                      <option value="Seasonal">🎄 Seasonal</option>
                      <option value="Others">✨ Others</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>
                      📦 Stock
                    </label>
                    <input
                      name="stock"
                      type="number"
                      placeholder="50"
                      value={formData.stock}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "13px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "12px", marginBottom: "6px" }}>
                    🖼️ Product Image *
                  </label>
                  <div style={{
                    border: "2px dashed #4a6741",
                    borderRadius: "6px",
                    padding: "16px",
                    textAlign: "center",
                    background: "#f5f3f0"
                  }}>
                    <Upload style={{ margin: "0 auto 8px" }} size={28} color="#4a6741" />
                    <p style={{ marginBottom: "8px", fontWeight: "600", fontSize: "12px", margin: "0 0 6px 0" }}>
                      Click to upload
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files || !e.target.files[0]) {
                          alert("Please select an image file");
                          return;
                        }
                        const file = e.target.files[0];
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Image size must be less than 5MB");
                          return;
                        }
                        const url = await uploadImage(file);
                        if (url) {
                          setFormData({ ...formData, image: url });
                          alert("Image uploaded successfully! ✅");
                        } else {
                          alert("Image upload failed. Please try again.");
                        }
                      }}
                    />

                    {uploading && (
                      <p style={{ 
                        textAlign: "center", 
                        color: "#4a6741", 
                        fontWeight: "600", 
                        marginTop: "8px",
                        fontSize: "12px"
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
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginTop: "8px"
                        }}
                      />
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>
                    📝 Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontSize: "13px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      outline: "none",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                    color: "#d4c9b8",
                    padding: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(74, 103, 65, 0.3)"
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
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
          }}>
            <p style={{ fontSize: "14px", color: "#666" }}>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
          }}>
            <Package size={48} color="#ccc" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#666", marginBottom: "6px" }}>
              {searchTerm ? "No products found" : "No products yet"}
            </p>
            <p style={{ color: "#999", fontSize: "12px" }}>
              {searchTerm ? "Try a different search term" : "Add your first product to get started!"}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "12px"
          }}>
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s"
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "140px",
                      objectFit: "cover"
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: p.stock > 10 ? "#4ade80" : p.stock > 0 ? "#fbbf24" : "#ef4444",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                  }}>
                    {p.stock} in stock
                  </span>
                </div>

                <div style={{ padding: "12px" }}>
                  <span style={{
                    display: "inline-block",
                    background: "#e8f1e3",
                    color: "#4a6741",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    marginBottom: "6px"
                  }}>
                    {p.category}
                  </span>

                  <h3 style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                    color: "#333",
                    margin: "6px 0"
                  }}>
                    {p.name}
                  </h3>

                  <p style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#4a6741",
                    marginBottom: "8px",
                    margin: "6px 0"
                  }}>
                    Rs {p.price}
                  </p>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleEdit(p)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        background: "#4a6741",
                        color: "#d4c9b8",
                        padding: "6px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "11px"
                      }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        background: "#ef4444",
                        color: "white",
                        padding: "6px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "11px"
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

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

export default AdminDashboard;