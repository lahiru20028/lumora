import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star, ArrowLeft, ShoppingCart, User } from "lucide-react";

interface Review {
  _id?: string;
  id?: string;
  rating: number;
  comment: string;
  reviewer?: string;
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
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching product ID:", id);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Product data:", data);

        setProduct(data);
        setReviews(data.reviews || []);

        // Fetch recommended products from the same category
        try {
          const allProductsRes = await fetch(
            "http://localhost:5000/api/products"
          );
          if (allProductsRes.ok) {
            const allProducts = await allProductsRes.json();
            // Filter products from the same category, excluding current product
            const recommended = allProducts
              .filter(
                (p: Product) => p.category === data.category && p._id !== id
              )
              .slice(0, 4);
            setRecommendedProducts(recommended);
          }
        } catch (err) {
          console.error("Error fetching recommended products:", err);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

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
        setReviewForm({ rating: 5, comment: "", reviewer: "" });
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

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
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
      <button
  onClick={() => navigate("/products")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f3f4f6",
    color: "#374151",
    padding: "6px 12px",
    fontSize: "12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    marginBottom: "12px"
  }}
>
  <ArrowLeft size={14} /> Back to Products
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
          {/* Product Image */}
          <div>
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="rounded-lg w-full object-cover"
              style={{ maxHeight: "500px", boxShadow: "0 4px 16px rgba(74, 103, 65, 0.15)" }}
            />
          </div>

          {/* Product Details */}
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

            {/* Price Box */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-8 border border-orange-200">
              <p className="text-sm font-semibold mb-2" style={{ color: "#4a6741" }}>Price</p>
              <p className="text-4xl font-bold" style={{ color: "#ea580c" }}>
                Rs {product.price}
              </p>
            </div>

            {/* Add to Cart Button */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
  <button
    onClick={() =>
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || product.image || "",
        quantity: 1,
      })
    }
    style={{
      flex: 1,
      background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
      color: "#d4c9b8",
      padding: "10px",
      fontSize: "13px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(74, 103, 65, 0.3)"
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
      padding: "10px",
      fontSize: "13px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)"
    }}
  >
    ⚡ Buy Now
  </button>
</div>

            {/* Product Details Card */}
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
        </div>

        {/* Reviews Section */}
        <div className="mt-12 pt-12" style={{ borderTop: "2px solid #e5e0d7" }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: "#3a5231" }}>Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="font-bold px-6 py-3 rounded-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                color: "#d4c9b8",
                boxShadow: "0 4px 15px rgba(74, 103, 65, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(74, 103, 65, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(74, 103, 65, 0.4)";
              }}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleAddReview}
              className="rounded-lg p-8 mb-12"
              style={{ background: "white", border: "2px solid #e5e0d7" }}
            >
              <div className="mb-6">
                <label className="block font-bold mb-3" style={{ color: "#3a5231" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewForm.reviewer}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, reviewer: e.target.value })
                  }
                  placeholder="Enter your name (optional)"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e5e0d7", focusRing: "#4a6741" }}
                />
              </div>

              <div className="mb-6">
                <label className="block font-bold mb-3" style={{ color: "#3a5231" }}>
                  Rating
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= reviewForm.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-bold mb-3" style={{ color: "#3a5231" }}>
                  Your Review
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Share your experience with this product..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e5e0d7" }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="font-bold px-8 py-3 rounded-lg text-white transition-all"
                style={{
                  background: submittingReview 
                    ? "#9ca3af" 
                    : "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                  color: "#d4c9b8",
                  boxShadow: submittingReview ? "none" : "0 4px 15px rgba(74, 103, 65, 0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!submittingReview) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(74, 103, 65, 0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submittingReview) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(74, 103, 65, 0.4)";
                  }
                }}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="rounded-lg p-6 border"
                  style={{ background: "white", borderColor: "#e5e0d7" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: "#4a6741" }}
                      >
                        {review.reviewer?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "#3a5231" }}>
                          {review.reviewer || "Anonymous"}
                        </p>
                        {review.createdAt && (
                          <p className="text-xs" style={{ color: "#999" }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
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
                  </div>
                  <p style={{ color: "#555", lineHeight: "1.6" }}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg p-12 text-center" style={{ background: "white", border: "2px solid #e5e0d7" }}>
              <p className="text-lg" style={{ color: "#999" }}>
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
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
