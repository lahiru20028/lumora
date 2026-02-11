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
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, "helpful" | "unhelpful" | null>>({});

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
                      padding: "16px 20px",
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
          {/* Section Header with Controls */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#3a5231]">Product Reviews</h2>
              <p className="text-sm text-gray-500 mt-1">{reviews.length} verified reviews from real customers</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center group cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-gray-500 text-sm mr-2">Sort:</span>
                <div className="relative">
                  <select 
                    className="bg-white border border-gray-300 text-gray-900 text-sm font-semibold px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#4a6741] focus:border-transparent cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="rating_desc">Highest Rating</option>
                    <option value="rating_asc">Lowest Rating</option>
                  </select>
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center group cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-gray-500 text-sm mr-2">Rating:</span>
                <div className="relative">
                  <select 
                    className="bg-white border border-gray-300 text-gray-900 text-sm font-semibold px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#4a6741] focus:border-transparent cursor-pointer"
                    value={filterStar}
                    onChange={(e) => setFilterStar(e.target.value === "all" ? "all" : Number(e.target.value))}
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ (4+)</option>
                    <option value="3">⭐⭐⭐ (3+)</option>
                    <option value="2">⭐⭐ (2+)</option>
                    <option value="1">⭐ (1+)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Rating Summary & Histogram */}
            <div className="flex-shrink-0 w-full lg:w-72">
              <div className="bg-gradient-to-br from-[#f4f7f3] to-white rounded-xl p-8 border border-[#e5e0d7] sticky top-24">
                {/* Average Rating Card */}
                <div className="flex flex-col mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#3a5231]">{averageRating}</span>
                    <span className="text-xs text-gray-500 font-medium">out of 5</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                      ))}
                  </div>
                </div>
                
                {/* Star Distribution Histogram */}
                <div className="space-y-3.5 mb-8 pb-8 border-b border-gray-200">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = starCounts[star] || 0;
                    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div 
                        key={star} 
                        className="flex items-center gap-3 text-xs cursor-pointer hover:opacity-70 transition-opacity group"
                        onClick={() => setFilterStar(star)}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="w-6 text-gray-600 font-semibold whitespace-nowrap">{star}★</span>
                        <div className="flex-grow h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#4a6741] to-[#5a7c52] rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-right text-gray-400 font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Write Review Button */}
                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#4a6741] to-[#3a5231] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-sm shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <span>✏️</span> Write a Review
                  </button>
                )}
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className="flex-grow">
              
              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="bg-gradient-to-br from-[#f9f8f7] to-white rounded-xl p-6 mb-8 border-2 border-[#4a6741] animate-in fade-in slide-in-from-top-4 duration-300"
                >
                  <div className="flex justify-between items-center mb-6">
                     <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                       <span>✍️</span> Share Your Experience
                     </h4>
                     <button type="button" onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah J."
                        value={reviewForm.reviewer}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewer: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a6741] focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setReviewForm(prev => ({ ...prev, rating: star }));
                            }}
                            className="focus:outline-none transition-all hover:scale-125 active:scale-95"
                          >
                            <Star
                              size={36}
                              className={star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-gray-700">Your Review</label>
                    <textarea
                      placeholder="What did you like or dislike? Share helpful details..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a6741] focus:border-transparent bg-white resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-gray-700">📸 Add Photos (Optional)</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-[#4a6741] hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200">
                        Choose File
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {reviewForm.image && (
                        <div className="relative inline-block group">
                           <img src={reviewForm.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-[#4a6741] shadow-md" />
                           <button type="button" onClick={() => setReviewForm(prev => ({...prev, image: ""}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg font-bold">✕</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-gradient-to-r from-[#4a6741] to-[#3a5231] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                    >
                      {submittingReview ? "⏳ Submitting..." : "✓ Submit Review"}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {sortedAndFilteredReviews.length > 0 ? (
                  sortedAndFilteredReviews.map((review) => {
                    const reviewId = review._id || review.id || "";
                    const helpfulStatus = helpfulReviews[reviewId];
                    
                    return (
                      <div
                        key={reviewId}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#f9f8f7]"
                      >
                        <div className="flex gap-4 items-start">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a6741] to-[#3a5231] flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {review.reviewer?.charAt(0).toUpperCase() || "A"}
                            </div>
                          </div>
                          
                          <div className="flex-grow">
                            {/* Header Line: Rating | Name | Verification | Date */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                               {/* Stars */}
                               <div className="flex gap-0.5">
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
                              
                              <span className="font-bold text-gray-900 text-sm">{review.reviewer || "Anonymous"}</span>
                              
                              {/* Verified Badge */}
                              <div className="flex items-center text-[#4a6741] text-xs font-semibold gap-1 bg-green-50 px-2.5 py-1 rounded-full">
                                 <CheckCircle size={13} className="fill-current" />
                                 <span>Verified Purchase</span>
                              </div>

                              {/* Date */}
                              <span className="text-xs text-gray-400 ml-auto">
                                {review.createdAt 
                                  ? new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                  : "Recent"}
                              </span>
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.comment}</p>
                            
                            {/* Review Images */}
                            {review.image && (
                              <div className="flex gap-3 mb-4">
                                <div 
                                  className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg border border-gray-300 hover:border-[#4a6741] transition-all hover:shadow-lg hover:-translate-y-1"
                                  onClick={() => setSelectedImage(review.image || null)}
                                >
                                  <img 
                                    src={review.image} 
                                    alt="Review attachment" 
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold">👁️ View</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Helpful Section */}
                            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500">Was this helpful?</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setHelpfulReviews(prev => ({
                                      ...prev,
                                      [reviewId]: helpfulStatus === "helpful" ? null : "helpful"
                                    }));
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                    helpfulStatus === "helpful"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  👍 Yes
                                </button>
                                <button
                                  onClick={() => {
                                    setHelpfulReviews(prev => ({
                                      ...prev,
                                      [reviewId]: helpfulStatus === "unhelpful" ? null : "unhelpful"
                                    }));
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                    helpfulStatus === "unhelpful"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  👎 No
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
                    <span className="text-4xl mb-3 block">📝</span>
                    <p className="text-gray-600 font-semibold mb-2">No reviews match your filter.</p>
                    <p className="text-gray-400 text-sm mb-4">Try adjusting your criteria or be the first to review!</p>
                    <button 
                      onClick={() => {
                        setFilterStar("all");
                        setShowReviewForm(true);
                      }}
                      className="text-[#4a6741] font-bold hover:underline text-sm inline-flex items-center gap-2"
                    >
                      <span>✍️</span> Write First Review
                    </button>
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
