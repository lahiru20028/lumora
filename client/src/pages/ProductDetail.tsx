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
  const [selectedScent, setSelectedScent] = useState<string>("Lavender");
  const [scentedQty, setScentedQty] = useState(0);
  const [unscentedQty, setUnscentedQty] = useState(0);
  const totalQty = scentedQty + unscentedQty;
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
                    style={
                      i < (product.rating || 0)
                        ? { color: '#c9972b', fill: '#c9972b' }
                        : { color: '#d4c9b8', fill: 'none' }
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

            {/* Quantity Selection Section */}
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
                Customize Your Order
              </h3>

              {/* Unscented Quantity */}
              <div style={{
                padding: "20px",
                borderRadius: "14px",
                border: unscentedQty > 0 ? "2px solid #4a6741" : "2px solid #e5e0d7",
                background: unscentedQty > 0 ? "#f4f7f3" : "#fcfbf9",
                marginBottom: "16px",
                transition: "all 0.3s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#3a5231", marginBottom: "4px" }}>🕯️ Unscented Candles</div>
                    <div style={{ fontSize: "13px", color: "#8c9688", fontWeight: "500" }}>Rs {product.price.toLocaleString()} per candle</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                    <button
                      onClick={() => setUnscentedQty(Math.max(0, unscentedQty - 1))}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px 0 0 10px",
                        border: "1.5px solid #e5e0d7",
                        borderRight: "none",
                        background: "#fff",
                        color: "#4a6741",
                        fontSize: "20px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4ed'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >−</button>
                    <div style={{
                      width: "48px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#3a5231",
                      borderTop: "1.5px solid #e5e0d7",
                      borderBottom: "1.5px solid #e5e0d7",
                      background: "#faf9f6",
                    }}>{unscentedQty}</div>
                    <button
                      onClick={() => setUnscentedQty(unscentedQty + 1)}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "0 10px 10px 0",
                        border: "1.5px solid #e5e0d7",
                        borderLeft: "none",
                        background: "#fff",
                        color: "#4a6741",
                        fontSize: "20px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4ed'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Scented Quantity */}
              <div style={{
                padding: "20px",
                borderRadius: "14px",
                border: scentedQty > 0 ? "2px solid #4a6741" : "2px solid #e5e0d7",
                background: scentedQty > 0 ? "#f4f7f3" : "#fcfbf9",
                marginBottom: "16px",
                transition: "all 0.3s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#3a5231", marginBottom: "4px" }}>🌸 Scented Candles</div>
                    <div style={{ fontSize: "13px", color: "#8c9688", fontWeight: "500" }}>Rs {(product.price + 100).toLocaleString()} per candle</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                    <button
                      onClick={() => setScentedQty(Math.max(0, scentedQty - 1))}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px 0 0 10px",
                        border: "1.5px solid #e5e0d7",
                        borderRight: "none",
                        background: "#fff",
                        color: "#4a6741",
                        fontSize: "20px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4ed'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >−</button>
                    <div style={{
                      width: "48px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#3a5231",
                      borderTop: "1.5px solid #e5e0d7",
                      borderBottom: "1.5px solid #e5e0d7",
                      background: "#faf9f6",
                    }}>{scentedQty}</div>
                    <button
                      onClick={() => setScentedQty(scentedQty + 1)}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "0 10px 10px 0",
                        border: "1.5px solid #e5e0d7",
                        borderLeft: "none",
                        background: "#fff",
                        color: "#4a6741",
                        fontSize: "20px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4ed'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >+</button>
                  </div>
                </div>

                {/* Fragrance Dropdown (Animated, shown when scentedQty > 0) */}
                <div style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  maxHeight: scentedQty > 0 ? "100px" : "0",
                  opacity: scentedQty > 0 ? 1 : 0,
                  marginTop: scentedQty > 0 ? "16px" : "0",
                  overflow: "hidden",
                }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#3a5231", marginBottom: "8px" }}>
                    Select Fragrance
                  </label>
                  <select
                    value={selectedScent}
                    onChange={(e) => setSelectedScent(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid #e5e0d7",
                      borderRadius: "10px",
                      background: "#fff",
                      cursor: "pointer",
                      color: "#2d3a26",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#4a6741"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e5e0d7"; }}
                  >
                    <option value="Lavender">🪻 Lavender</option>
                    <option value="Rose">🌹 Rose</option>
                    <option value="Cinnamon">🫚 Cinnamon</option>
                    <option value="Rani">🌺 Rani</option>
                  </select>
                </div>
              </div>

              {/* Total Candles Summary */}
              <div style={{
                padding: "16px 20px",
                borderRadius: "14px",
                background: totalQty > 0 ? "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)" : "#f0ece5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                transition: "all 0.3s ease",
              }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: totalQty > 0 ? "rgba(212,201,184,0.7)" : "#8c9688", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Candles</div>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: totalQty > 0 ? "#d4c9b8" : "#3a5231", lineHeight: 1.2 }}>{totalQty}</div>
                </div>
                {totalQty > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: "rgba(212,201,184,0.6)", fontWeight: "500", marginBottom: "2px" }}>
                      {unscentedQty > 0 && `${unscentedQty} unscented`}
                      {unscentedQty > 0 && scentedQty > 0 && " · "}
                      {scentedQty > 0 && `${scentedQty} scented`}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(212,201,184,0.6)", fontWeight: "500" }}>
                      {scentedQty > 0 && `Fragrance: ${selectedScent}`}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Price Display */}
              <div style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                paddingTop: "20px",
                borderTop: "1px solid #e5e0d7"
              }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{
                    fontSize: "13px",
                    color: "#8c9688",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px"
                  }}>Total Price</span>
                  <span style={{
                    fontSize: "32px",
                    fontFamily: "serif",
                    fontWeight: "bold",
                    color: "#2d3a26",
                    lineHeight: "1"
                  }}>
                    Rs {((unscentedQty * product.price) + (scentedQty * (product.price + 100))).toLocaleString()}
                  </span>
                </div>
                {totalQty > 0 && (
                  <div style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background: "#edf5ea",
                    color: "#4a6741",
                  }}>
                    {totalQty} {totalQty === 1 ? 'candle' : 'candles'}
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "32px", marginTop: "16px" }}>
              <button
                onClick={() => {
                  if (totalQty === 0) return;
                  // Add unscented candles to cart
                  if (unscentedQty > 0) {
                    addToCart({
                      productId: product._id,
                      name: `${product.name} (Unscented)`,
                      price: product.price,
                      image_url: product.image_url || product.image || "",
                      quantity: unscentedQty,
                    });
                  }
                  // Add scented candles to cart
                  if (scentedQty > 0) {
                    addToCart({
                      productId: product._id + `-scented-${selectedScent.toLowerCase()}`,
                      name: `${product.name} (Scented: ${selectedScent})`,
                      price: product.price + 100,
                      image_url: product.image_url || product.image || "",
                      quantity: scentedQty,
                    });
                  }
                }}
                style={{
                  flex: 1,
                  background: totalQty === 0 ? "#e5e0d7" : "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                  color: totalQty === 0 ? "#8c9688" : "#d4c9b8",
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "12px",
                  cursor: totalQty === 0 ? "not-allowed" : "pointer",
                  boxShadow: totalQty === 0 ? "none" : "0 4px 10px rgba(74, 103, 65, 0.3)",
                  transition: "all 0.3s ease",
                  opacity: totalQty === 0 ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (totalQty > 0) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 103, 65, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = totalQty === 0 ? "none" : "0 4px 10px rgba(74, 103, 65, 0.3)";
                }}
              >
                🛒 {totalQty === 0 ? 'Select Quantity' : `Add ${totalQty} ${totalQty === 1 ? 'Candle' : 'Candles'} to Cart`}
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

        {/* Reviews Section - Modern Premium Design */}
        <div style={{
          marginTop: '80px',
          background: 'linear-gradient(135deg, #faf9f6 0%, #f5f2ed 100%)',
          borderRadius: '24px',
          padding: '0',
          boxShadow: '0 4px 24px rgba(26, 71, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e0d7',
          overflow: 'hidden',
        }}>

          {/* Section Header */}
          <div style={{
            background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
            padding: '24px 36px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-40px', right: '-20px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(212, 201, 184, 0.08)' }}></div>
            <div style={{ position: 'absolute', bottom: '-60px', right: '100px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(212, 201, 184, 0.06)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#d4c9b8', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Customer Reviews</h2>
                <p style={{ fontSize: '13px', color: 'rgba(212, 201, 184, 0.65)', margin: 0, fontWeight: '500' }}>
                  See what our customers have to say
                </p>
              </div>
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  style={{
                    background: 'rgba(212, 201, 184, 0.15)',
                    backdropFilter: 'blur(12px)',
                    color: '#d4c9b8',
                    padding: '14px 32px',
                    borderRadius: '14px',
                    fontWeight: '700',
                    fontSize: '15px',
                    border: '1px solid rgba(212, 201, 184, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 201, 184, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(58, 82, 49, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 201, 184, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>✍️</span> Write a Review
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div style={{ padding: '40px 48px' }}>

            {/* Rating Overview - Two Column */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr',
              gap: '40px',
              marginBottom: '40px',
              padding: '32px',
              background: '#fff',
              borderRadius: '20px',
              border: '1px solid #e5e0d7',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}>
              {/* Left - Average Score */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid #e5e0d7',
                paddingRight: '40px',
              }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: '#4a6741', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {averageRating}
                </div>
                <div style={{ display: 'flex', gap: '3px', margin: '12px 0 8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} style={i < Math.round(Number(averageRating)) ? { color: '#c9972b', fill: '#c9972b' } : { color: '#d4c9b8', fill: 'none' }} />
                  ))}
                </div>
                <span style={{ fontSize: '14px', color: '#8c9688', fontWeight: '600' }}>
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>

              {/* Right - Star Distribution */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starCounts[star] || 0;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div
                      key={star}
                      onClick={() => setFilterStar(star === filterStar ? "all" : star)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 44px',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        transition: 'background 0.2s',
                        background: filterStar === star ? '#f0fdf4' : 'transparent',
                      }}
                      onMouseEnter={(e) => { if (filterStar !== star) e.currentTarget.style.background = '#faf9f6'; }}
                      onMouseLeave={(e) => { if (filterStar !== star) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600', color: '#1a472a' }}>
                        {star} <Star size={14} style={{ color: '#c9972b', fill: '#c9972b' }} />
                      </div>
                      <div style={{ height: '10px', borderRadius: '999px', background: '#f0ece5', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          borderRadius: '999px',
                          background: 'linear-gradient(90deg, #4a6741, #6b8e6f)',
                          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                          minWidth: percentage > 0 ? '8px' : '0',
                        }}></div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#8c9688', textAlign: 'right' }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter & Sort Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {/* Star Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setFilterStar("all")}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: filterStar === "all" ? '#4a6741' : '#fff',
                    color: filterStar === "all" ? '#d4c9b8' : '#5a6c55',
                    boxShadow: filterStar === "all" ? '0 4px 12px rgba(74, 103, 65, 0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFilterStar(star === filterStar ? "all" : star)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      background: filterStar === star ? '#4a6741' : '#fff',
                      color: filterStar === star ? '#d4c9b8' : '#5a6c55',
                      boxShadow: filterStar === star ? '0 4px 12px rgba(74, 103, 65, 0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {star} <Star size={13} style={filterStar === star ? { color: '#d4c9b8', fill: '#d4c9b8' } : { color: '#c9972b', fill: '#c9972b' }} />
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={{
                  padding: '10px 36px 10px 16px',
                  borderRadius: '12px',
                  border: '1px solid #e5e0d7',
                  background: '#fff',
                  color: '#1a472a',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231a472a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="rating_asc">Lowest Rated</option>
              </select>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf9f6 100%)',
                padding: '36px',
                borderRadius: '20px',
                border: '1px solid #e5e0d7',
                marginBottom: '40px',
                boxShadow: '0 8px 32px rgba(26, 71, 42, 0.08)',
                animation: 'reviewFormSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a472a', margin: '0' }}>Share Your Experience</h3>
                    <p style={{ fontSize: '14px', color: '#8c9688', margin: '4px 0 0 0' }}>Your review helps others make better choices</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      border: '1px solid #e5e0d7',
                      background: '#faf9f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: '#8c9688',
                      fontSize: '18px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e0d7'; e.currentTarget.style.color = '#3a5231'; e.currentTarget.style.borderColor = '#c4d3b9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#faf9f6'; e.currentTarget.style.color = '#8c9688'; e.currentTarget.style.borderColor = '#e5e0d7'; }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddReview}>
                  {/* Rating Selection */}
                  <div style={{ marginBottom: '28px', textAlign: 'center', padding: '24px', background: '#faf9f6', borderRadius: '16px', border: '1px solid #f0ece5' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1a472a', marginBottom: '12px' }}>How would you rate this product?</label>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'transform 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          <Star
                            size={36}
                            style={star <= reviewForm.rating ? { color: '#c9972b', fill: '#c9972b' } : { color: '#d4c9b8', fill: 'none' }}
                          />
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', color: '#8c9688', marginTop: '8px', display: 'block' }}>
                      {reviewForm.rating === 5 ? '🌟 Excellent!' : reviewForm.rating === 4 ? '😊 Very Good' : reviewForm.rating === 3 ? '😐 Average' : reviewForm.rating === 2 ? '😕 Below Average' : '😞 Poor'}
                    </span>
                  </div>

                  {/* Name & Comment */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a472a', marginBottom: '8px' }}>Your Name</label>
                      <input
                        type="text"
                        value={reviewForm.reviewer}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewer: e.target.value })}
                        placeholder="Enter your name"
                        style={{
                          width: '100%',
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: '1px solid #e5e0d7',
                          background: '#fff',
                          fontSize: '14px',
                          color: '#1a472a',
                          outline: 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#4a6741'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 103, 65, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e0d7'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a472a', marginBottom: '8px' }}>Photo (Optional)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{
                          cursor: 'pointer',
                          padding: '14px 22px',
                          borderRadius: '12px',
                          border: '1px dashed #c4d3b9',
                          background: '#f8faf7',
                          color: '#4a6741',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                          justifyContent: 'center',
                        }}>
                          📸 Upload Photo
                          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                        {reviewForm.image && (
                          <div style={{ position: 'relative' }}>
                            <img src={reviewForm.image} alt="Preview" style={{ height: '48px', width: '48px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e5e0d7' }} />
                            <button
                              type="button"
                              onClick={() => setReviewForm(prev => ({ ...prev, image: "" }))}
                              style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >✕</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a472a', marginBottom: '8px' }}>Your Review</label>
                    <textarea
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Tell us about your experience with this product..."
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: '1px solid #e5e0d7',
                        background: '#fff',
                        fontSize: '14px',
                        color: '#1a472a',
                        outline: 'none',
                        resize: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        lineHeight: '1.6',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#4a6741'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 103, 65, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e0d7'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Form Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f0ece5' }}>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '12px',
                        border: '1px solid #e5e0d7',
                        background: '#fff',
                        color: '#8c9688',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#faf9f6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      style={{
                        padding: '12px 36px',
                        borderRadius: '12px',
                        border: 'none',
                        background: submittingReview ? '#8c9688' : 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: submittingReview ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 12px rgba(74, 103, 65, 0.25)',
                      }}
                      onMouseEnter={(e) => { if (!submittingReview) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 103, 65, 0.35)'; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 103, 65, 0.25)'; }}
                    >
                      {submittingReview ? "Posting..." : "✨ Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sortedAndFilteredReviews.length > 0 ? (
                sortedAndFilteredReviews.map((review) => {
                  const reviewId = review._id || review.id || "";
                  const helpfulStatus = helpfulReviews[reviewId];
                  return (
                    <div
                      key={reviewId}
                      style={{
                        background: '#fff',
                        borderRadius: '18px',
                        border: '1px solid #e5e0d7',
                        padding: '28px 32px',
                        transition: 'all 0.3s ease',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(26, 71, 42, 0.08)';
                        e.currentTarget.style.borderColor = '#c4d3b9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e5e0d7';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Review Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #4a6741 0%, #6b8e6f 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '18px',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(74, 103, 65, 0.2)',
                        }}>
                          {review.reviewer?.charAt(0).toUpperCase() || "A"}
                        </div>

                        <div style={{ flex: 1 }}>
                          {/* Name + Rating Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1a472a', margin: '0 0 4px 0' }}>
                                {review.reviewer || "Anonymous"}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={15} style={i < review.rating ? { color: '#c9972b', fill: '#c9972b' } : { color: '#d4c9b8', fill: 'none' }} />
                                  ))}
                                </div>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ccc', display: 'inline-block' }}></span>
                                <span style={{ fontSize: '13px', color: '#a0a8a0', fontWeight: '500' }}>
                                  {review.createdAt
                                    ? new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : "Recent"}
                                </span>
                              </div>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: 'linear-gradient(135deg, #f0f4ed 0%, #dde5d4 100%)',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#3a5231',
                              border: '1px solid #c4d3b9',
                            }}>
                              <CheckCircle size={12} /> Verified
                            </div>
                          </div>

                          {/* Comment */}
                          <p style={{
                            marginTop: '16px',
                            fontSize: '15px',
                            color: '#5a6c55',
                            lineHeight: '1.7',
                            marginBottom: 0,
                          }}>
                            {review.comment}
                          </p>

                          {/* Review Image */}
                          {review.image && (
                            <div style={{ marginTop: '16px' }}>
                              <img
                                src={review.image}
                                alt="Review"
                                onClick={() => setSelectedImage(review.image || null)}
                                style={{
                                  height: '120px',
                                  width: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '14px',
                                  border: '1px solid #e5e0d7',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
                              />
                            </div>
                          )}

                          {/* Helpful Actions */}
                          <div style={{
                            marginTop: '20px',
                            paddingTop: '16px',
                            borderTop: '1px solid #f0ece5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <span style={{ fontSize: '13px', color: '#a0a8a0', fontWeight: '500', marginRight: '4px' }}>Was this helpful?</span>
                            <button
                              onClick={() => setHelpfulReviews(prev => ({ ...prev, [reviewId]: helpfulStatus === "helpful" ? null : "helpful" }))}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: helpfulStatus === "helpful" ? '#f0f4ed' : '#f8f8f6',
                                color: helpfulStatus === "helpful" ? '#3a5231' : '#8c9688',
                              }}
                              onMouseEnter={(e) => { if (helpfulStatus !== "helpful") e.currentTarget.style.background = '#f0f4ed'; }}
                              onMouseLeave={(e) => { if (helpfulStatus !== "helpful") e.currentTarget.style.background = '#f8f8f6'; }}
                            >
                              👍 Yes {helpfulStatus === "helpful" ? "(1)" : ""}
                            </button>
                            <button
                              onClick={() => setHelpfulReviews(prev => ({ ...prev, [reviewId]: helpfulStatus === "unhelpful" ? null : "unhelpful" }))}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: helpfulStatus === "unhelpful" ? '#e5e0d7' : '#f8f8f6',
                                color: helpfulStatus === "unhelpful" ? '#3a5231' : '#8c9688',
                              }}
                              onMouseEnter={(e) => { if (helpfulStatus !== "unhelpful") e.currentTarget.style.background = '#f0ece5'; }}
                              onMouseLeave={(e) => { if (helpfulStatus !== "unhelpful") e.currentTarget.style.background = '#f8f8f6'; }}
                            >
                              👎 No
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '64px 32px',
                  background: '#fff',
                  borderRadius: '20px',
                  border: '2px dashed #e5e0d7',
                }}>
                  <div style={{ fontSize: '52px', marginBottom: '16px', opacity: 0.4 }}>💬</div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a472a', margin: '0 0 8px 0' }}>No reviews yet</h3>
                  <p style={{ fontSize: '15px', color: '#8c9688', margin: '0 0 24px 0' }}>Be the first to share your experience with this candle.</p>
                  <button
                    onClick={() => { setFilterStar("all"); setShowReviewForm(true); }}
                    style={{
                      background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                      color: '#fff',
                      padding: '12px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(74, 103, 65, 0.25)',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 103, 65, 0.35)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 103, 65, 0.25)'; }}
                  >
                    ✍️ Write the First Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Like Section – Premium Redesign */}
      {recommendedProducts.length > 0 && (
        <div style={{
          marginTop: '60px',
          padding: '0 0 48px 0',
        }}>
          {/* Section Header */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(74, 103, 65, 0.25)',
              }}>
                ✨
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#3a5231', margin: 0, letterSpacing: '-0.02em' }}>
                  You May Also Like
                </h2>
                <p style={{ fontSize: '13px', color: '#8c9688', margin: '2px 0 0 0', fontWeight: '500' }}>
                  Handpicked recommendations for you
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: '1px solid #e5e0d7',
                background: '#fff',
                color: '#4a6741',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4a6741';
                e.currentTarget.style.color = '#d4c9b8';
                e.currentTarget.style.borderColor = '#4a6741';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 103, 65, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#4a6741';
                e.currentTarget.style.borderColor = '#e5e0d7';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View All →
            </button>
          </div>

          {/* Product Cards Grid */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            {recommendedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/products/${item._id}`)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#fff',
                  border: '1px solid #e5e0d7',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(74, 103, 65, 0.15)';
                  e.currentTarget.style.borderColor = '#c4d3b9';
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e0d7';
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Image */}
                <div style={{
                  height: '180px',
                  overflow: 'hidden',
                  background: '#f5f2ed',
                  position: 'relative',
                }}>
                  <img
                    src={item.image_url || item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x180?text=No+Image';
                    }}
                  />
                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
                    color: '#d4c9b8',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(58, 82, 49, 0.35)',
                    backdropFilter: 'blur(8px)',
                  }}>
                    Rs {item.price?.toLocaleString()}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3a5231',
                    margin: '0 0 8px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          style={i < (item.rating || 0) ? { color: '#c9972b', fill: '#c9972b' } : { color: '#d4c9b8', fill: 'none' }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: '#8c9688', fontWeight: '600' }}>
                      {item.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        productId: item._id,
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url || item.image || "",
                        quantity: 1,
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1.5px solid #4a6741',
                      background: 'transparent',
                      color: '#4a6741',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)';
                      e.currentTarget.style.color = '#d4c9b8';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 103, 65, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4a6741';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
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
