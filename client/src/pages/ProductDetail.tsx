import React, { useEffect, useState, FormEvent, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star, ArrowLeft, ShoppingCart, User, Truck, CheckCircle, Filter } from "lucide-react";

interface Review {
  _id?: string;
  id?: string;
  rating: number;
  comment: string;
  reviewer?: string;
  image?: string; // Added image field
  createdAt?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  image?: string;
  rating: number;
  reviews?: Review[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    reviewer: "",
    image: "", // Initialize image state
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [scentType, setScentType] = useState<"Unscented" | "Scented">("Unscented");
  const [selectedScent, setSelectedScent] = useState<string>("Lavender");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "rating_desc" | "rating_asc">("relevance");
  const [filterStar, setFilterStar] = useState<number | "all">("all");

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        // Fetch Product Details
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data);

        // Fetch Reviews Separately (as requested)
        const reviewsRes = await fetch(`http://localhost:5000/api/reviews/${id}`);
        if (reviewsRes.ok) {
           const reviewsData = await reviewsRes.json();
           setReviews(reviewsData);
        } else {
           // Fallback if needed
           setReviews(data.reviews || []);
        }

        // Fetch recommended products
        const productsRes = await fetch("http://localhost:5000/api/products");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setRecommendedProducts(
            productsData
              .filter((p: Product) => p._id !== id)
              .slice(0, 6)
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndReviews();
      window.scrollTo(0, 0);
    }
  }, [id]);

  // Handle Image Upload with Compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setReviewForm((prev) => ({ ...prev, image: dataUrl }));
        };
      };
    }
  };

  const handleAddReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewForm),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        setReviews(updatedProduct.reviews || []);
        setReviewForm({ rating: 5, comment: "", reviewer: "", image: "" }); // Reset form
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Derived state for sorted and filtered reviews
  const sortedAndFilteredReviews = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (filterStar !== "all") {
      result = result.filter((r) => r.rating === filterStar);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "rating_desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "rating_asc") {
      result.sort((a, b) => a.rating - b.rating);
    }
    // relevance is default (usually no sort or backend specific, here we keep original order)

    return result;
  }, [reviews, sortBy, filterStar]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  // Calculate Star Distribution
  const starCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f5f3f0" }}
        className="flex items-center justify-center"
      >
        <div className="text-center py-20">
          <p className="text-gray-500">Loading product...</p>
          <p className="text-gray-400 text-sm">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f5f3f0" }}
        className="flex items-center justify-center"
      >
        <div className="text-center py-20 max-w-md">
          <p className="text-red-600 font-bold mb-2">Error:</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-400 text-sm mb-4">ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f5f3f0" }}
        className="flex items-center justify-center"
      >
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Product not found</p>
          <p className="text-gray-400 text-sm mb-4">ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3f0" }}>
      {/* Lightbox for Review Images */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Review Fullsize" 
              className="max-h-[90vh] rounded-lg shadow-2xl"
              style={{ objectFit: "contain" }}
            />
            <button 
              className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#4a6741",
          color: "#d4c9b8",
          padding: "10px 24px",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "30px",
          border: "2px solid #3a5231",
          cursor: "pointer",
          marginBottom: "24px",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 10px rgba(74, 103, 65, 0.2)",
          marginTop: "20px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(-4px)";
          e.currentTarget.style.boxShadow = "0 6px 15px rgba(74, 103, 65, 0.3)";
          e.currentTarget.style.background = "#3a5231";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(74, 103, 65, 0.2)";
          e.currentTarget.style.background = "#4a6741";
        }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>


        {/* Product Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 2px 12px rgba(74, 103, 65, 0.1)",
          }}
        >
          {/* Product Image and Why Choose Us */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="rounded-lg w-full object-cover"
              style={{ maxHeight: "500px", boxShadow: "0 4px 16px rgba(74, 103, 65, 0.15)" }}
            />

            {/* Product Details Card - Moved Here */}
            <div className="bg-white rounded-lg p-6" style={{ border: "2px solid #e5e0d7" }}>
              <h4 className="font-bold mb-4 text-lg" style={{ color: "#3a5231" }}>Why Choose This Product</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4a6741", fontWeight: "bold", marginTop: "2px" }}>✓</span>
                  <span style={{ color: "#555" }}>Handmade with premium quality wax</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4a6741", fontWeight: "bold", marginTop: "2px" }}>✓</span>
                  <span style={{ color: "#555" }}>Smoke-free and eco-friendly materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4a6741", fontWeight: "bold", marginTop: "2px" }}>✓</span>
                  <span style={{ color: "#555" }}>Perfect for home décor & gifting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4a6741", fontWeight: "bold", marginTop: "2px" }}>✓</span>
                  <span style={{ color: "#555" }}>Long-lasting fragrance & burn time</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Details - Right Column */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 className="text-4xl font-bold mb-6" style={{ color: "#3a5231" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8 pb-8" style={{ borderBottom: "2px solid #e5e0d7" }}>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={
                      i < (product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-semibold" style={{ color: "#4a6741" }}>
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Description */}
            <p className="leading-relaxed mb-8 text-base" style={{ color: "#555" }}>
              {product.description}
            </p>

            {/* Scent Selection Options - Modern Redesign */}
            <div style={{
              marginBottom: "40px",
              padding: "32px",
              borderRadius: "16px",
              background: "white",
              border: "1px solid #e5e0d7",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative background element */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "96px",
                height: "96px",
                background: "#4a6741",
                opacity: 0.05,
                borderBottomLeftRadius: "100%",
                pointerEvents: "none"
              }}></div>

              <h3 style={{
                fontSize: "18px",
                fontWeight: "bold",
                fontFamily: "serif",
                color: "#3a5231",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span style={{ width: "4px", height: "24px", background: "#4a6741", borderRadius: "999px" }}></span>
                Customize Your Candle
              </h3>
              
              {/* Type Selection - Interactive Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "32px"
              }}>
                {/* Unscented Card */}
                <div
                  onClick={() => setScentType("Unscented")}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    padding: "12px", // Match Add to Cart padding
                    borderRadius: "12px", // Match Add to Cart radius
                    border: scentType === "Unscented" ? "2px solid #4a6741" : "2px solid #e5e0d7",
                    background: scentType === "Unscented" ? "#4a6741" : "#fcfbf9",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    transform: scentType === "Unscented" ? "scale(1.02)" : "scale(1)",
                    boxShadow: scentType === "Unscented" ? "0 4px 12px rgba(74, 103, 65, 0.2)" : "none",
                    // Removed fixed height to let content determine size like Add to Cart
                  }}
                  onMouseEnter={(e) => {
                    if (scentType !== "Unscented") {
                      e.currentTarget.style.borderColor = "#4a6741";
                      e.currentTarget.style.background = "#f4f7f3";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (scentType !== "Unscented") {
                      e.currentTarget.style.borderColor = "#e5e0d7";
                      e.currentTarget.style.background = "#fcfbf9";
                    }
                  }}
                >
                  <span style={{
                    fontSize: "14px", // Match Add to Cart font size
                    fontWeight: "bold", // Match Add to Cart weight
                    color: scentType === "Unscented" ? "#d4c9b8" : "#5a6c55"
                  }}>
                    Unscented
                  </span>
                  <div style={{
                    height: "3px",
                    width: "24px",
                    borderRadius: "999px",
                    background: scentType === "Unscented" ? "#d4c9b8" : "transparent",
                    transition: "all 0.3s"
                  }}></div>
                </div>

                {/* Scented Card */}
                <div
                  onClick={() => setScentType("Scented")}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    padding: "12px", // Match Add to Cart padding
                    borderRadius: "12px", // Match Add to Cart radius
                    border: scentType === "Scented" ? "2px solid #4a6741" : "2px solid #e5e0d7",
                    background: scentType === "Scented" ? "#4a6741" : "#fcfbf9",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    transform: scentType === "Scented" ? "scale(1.02)" : "scale(1)",
                    boxShadow: scentType === "Scented" ? "0 4px 12px rgba(74, 103, 65, 0.2)" : "none",
                    // Removed fixed height
                  }}
                  onMouseEnter={(e) => {
                    if (scentType !== "Scented") {
                      e.currentTarget.style.borderColor = "#4a6741";
                      e.currentTarget.style.background = "#f4f7f3";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (scentType !== "Scented") {
                      e.currentTarget.style.borderColor = "#e5e0d7";
                      e.currentTarget.style.background = "#fcfbf9";
                    }
                  }}
                >
                  <span style={{
                    fontSize: "14px", // Match Add to Cart font size
                    fontWeight: "bold", // Match Add to Cart weight
                    color: scentType === "Scented" ? "#d4c9b8" : "#5a6c55"
                  }}>
                    Scented
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontFamily: "serif",
                    fontStyle: "italic",
                    color: scentType === "Scented" ? "#e8f5e9" : "#4a6741",
                    marginTop: "0px"
                  }}>
                    + Rs 100
                  </span>
                </div>
              </div>

              {/* Fragrance Dropdown (Animated) */}
              <div style={{
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                maxHeight: scentType === "Scented" ? "128px" : "0",
                opacity: scentType === "Scented" ? 1 : 0,
                marginBottom: scentType === "Scented" ? "32px" : "0",
                overflow: "hidden"
              }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#3a5231",
                  marginBottom: "12px",
                  marginLeft: "4px",
                  fontFamily: "serif"
                }}>
                  Select Fragrance
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedScent}
                    onChange={(e) => setSelectedScent(e.target.value)}
                    style={{
                      width: "100%",
                      appearance: "none",
                      padding: "16px 20px",
                      paddingRight: "40px",
                      border: "2px solid #e5e0d7",
                      borderRadius: "12px",
                      background: "#fcfbf9",
                      cursor: "pointer",
                      color: "#2d3a26",
                      fontSize: "16px",
                      fontWeight: "500",
                      outline: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#4a6741";
                      e.target.style.boxShadow = "0 0 0 1px #4a6741";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e0d7";
                      e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
                    }}
                  >
                    <option value="Lavender">Lavender</option>
                    <option value="Rose">Rose</option>
                    <option value="Cinnamon">Cinnamon</option>
                    <option value="Rani">Rani</option>
                  </select>
                  {/* Custom Arrow Icon */}
                  <div style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#4a6741"
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Price Display */}
              <div style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                paddingTop: "24px",
                borderTop: "1px solid #e5e0d7"
              }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{
                    fontSize: "14px",
                    color: "#8c9688",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px"
                  }}>Total Price</span>
                  <span style={{
                    fontSize: "36px",
                    fontFamily: "serif",
                    fontWeight: "bold",
                    color: "#2d3a26",
                    lineHeight: "1"
                  }}>
                    Rs {scentType === "Scented" ? (product.price + 100).toLocaleString() : product.price.toLocaleString()}
                  </span>
                </div>
                <div style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  background: scentType === "Scented" ? "#edf5ea" : "#f3f4f6",
                  color: scentType === "Scented" ? "#4a6741" : "#6b7280",
                  transition: "all 0.3s"
                }}>
                  {scentType === "Scented" ? "Premium Selection" : "Standard Selection"}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "32px", marginTop: "16px" }}>
  <button
    onClick={() => {
      // Construct the item name with scent details
      const itemDetails = scentType === "Scented" 
        ? `${product.name} (Scented: ${selectedScent})`
        : `${product.name} (Unscented)`;
      
      const finalPrice = scentType === "Scented" ? product.price + 100 : product.price;

      addToCart({
        productId: product._id,
        name: itemDetails, // Pass the customized name
        price: finalPrice,
        image_url: product.image_url || product.image || "",
        quantity: 1,
      });
    }}
    style={{
      flex: 1,
      background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
      color: "#d4c9b8",
      padding: "12px",
      fontSize: "14px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(74, 103, 65, 0.3)",
      transition: "all 0.3s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 103, 65, 0.4)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(74, 103, 65, 0.3)";
    }}
  >
    🛒 Add to Cart
  </button>

  <button
    onClick={() => navigate("/cart")}
    style={{
      flex: 1,
      background: "#ef4444",
      color: "white",
      padding: "12px",
      fontSize: "14px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)",
      transition: "all 0.3s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(239, 68, 68, 0.4)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(239, 68, 68, 0.3)";
    }}
  >
    ⚡ Buy Now
  </button>
</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-[#e5e0d7] p-8">
          <div className="flex flex-col lg:flex-row gap-12 border-b border-gray-100 pb-10 mb-10">
            {/* Left: Rating Summary */}
            <div className="flex-shrink-0 w-full lg:w-64">
              <h2 className="text-2xl font-bold text-[#3a5231] mb-6">Customer Reviews</h2>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">{averageRating}</span>
                <span className="text-lg text-gray-500 font-medium">out of 5</span>
              </div>
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(Number(averageRating)) ? "fill-current" : "text-gray-200"}
                    />
                ))}
              </div>
              <p className="text-gray-500 text-sm mb-6">{reviews.length} global ratings</p>
              
              {/* Star Distribution Histogram */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starCounts[star] || 0;
                  const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm hover:opacity-80 cursor-pointer" onClick={() => setFilterStar(star)}>
                      <span className="w-12 text-blue-600 hover:underline hover:text-orange-700 font-medium">{star} star</span>
                      <div className="flex-grow h-5 bg-gray-100 rounded-sm overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-yellow-400 border-r border-yellow-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right text-gray-500">{Math.round(percent)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Reviews List & Controls */}
            <div className="flex-grow">
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="font-bold text-lg text-gray-800">Top reviews from customers</h3>
                <div className="flex gap-3">
                   <select 
                    className="bg-white border border-gray-300 text-gray-700 text-sm py-2 px-3 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4a6741] focus:border-[#4a6741]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="newest">Sort by: Newest</option>
                    <option value="rating_desc">Sort by: Highest Rating</option>
                    <option value="rating_asc">Sort by: Lowest Rating</option>
                  </select>
                  
                   {filterStar !== "all" && (
                     <button 
                       onClick={() => setFilterStar("all")}
                       className="text-sm text-red-600 hover:text-red-800 font-medium"
                     >
                       Clear Filter
                     </button>
                   )}
                </div>
              </div>

              {/* Write Review Toggle */}
              {!showReviewForm && (
                <div className="mb-8">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-sm font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded shadow-sm w-full text-left flex items-center justify-between group transition-colors"
                  >
                    <span>Write a customer review</span>
                    <span className="text-gray-400 group-hover:text-gray-600">✎</span>
                  </button>
                </div>
              )}

              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="font-bold text-gray-800">Create Review</h4>
                     <button type="button" onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Your Name</label>
                      <input
                        type="text"
                        value={reviewForm.reviewer}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewer: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setReviewForm(prev => ({ ...prev, rating: star }));
                            }}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700">Add a Photo</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500" />
                    {reviewForm.image && (
                      <div className="mt-2 relative inline-block">
                         <img src={reviewForm.image} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                         <button type="button" onClick={() => setReviewForm(prev => ({...prev, image: ""}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✕</button>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700">Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                      rows={3}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-[#4a6741] text-white font-bold py-2 px-6 rounded hover:bg-[#3a5231] transition-colors text-sm shadow-sm"
                  >
                    {submittingReview ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}

          <div className="space-y-6">
            {sortedAndFilteredReviews.length > 0 ? (
              sortedAndFilteredReviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                        {review.reviewer?.charAt(0).toUpperCase() || "A"}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-gray-900 text-sm">{review.reviewer || "Anonymous"}</p>
                        {review.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                         {/* Verified Badge */}
                         <div className="flex items-center text-green-700 text-xs font-bold gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                           <CheckCircle size={12} fill="currentColor" className="text-green-700" />
                           Verified Purchase
                         </div>
                      </div>

                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.comment}</p>
                      
                      {/* Review Images Row */}
                      {review.image && (
                        <div className="flex gap-2 mt-3">
                          <div 
                            className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border border-gray-200 hover:border-[#4a6741] transition-colors"
                            onClick={() => setSelectedImage(review.image || null)}
                          >
                            <img 
                              src={review.image} 
                              alt="Review thumbnail" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reviews found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

{/* You May Like Section – Modern Horizontal Cards */}
{recommendedProducts.length > 0 && (
  <div className="bg-gradient-to-r from-gray-50 to-white mt-12 py-6">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="w-1 h-5 bg-green-600 rounded-full"></span>
        You May Like
      </h2>
      <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-3">
          {recommendedProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/products/${item._id}`)}
              className="flex-shrink-0 cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              style={{ width: '140px' }}
            >
              {/* Image with hover zoom */}
              <div className="bg-gray-100 overflow-hidden" style={{ height: '90px' }}>
                <img
                  src={item.image_url || item.image}
                  alt={item.name}
                  loading="lazy"
                  className="group-hover:scale-105 transition-transform duration-300"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/140x90?text=No+Image';
                  }}
                />
              </div>
              {/* Name + Price */}
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate font-medium">{item.name}</p>
                <p className="text-sm font-bold text-green-700 mt-1">Rs {item.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

      {/* Footer */}
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

export default ProductDetail;
