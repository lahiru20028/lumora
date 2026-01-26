import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  CreditCard,
  Sparkles,
} from "lucide-react";

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart } = useCart();

  // ✅ CORRECT TOTAL ITEM COUNT
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f3f0",
      }}
    >
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
              marginBottom: "6px",
            }}
          >
            <ShoppingBag size={28} />
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Shopping Cart
            </h1>
          </div>

          {/* ✅ FIXED TEXT */}
          <p style={{ fontSize: "13px", margin: 0, opacity: 0.9 }}>
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        {cartItems.length === 0 ? (
          /* EMPTY CART */
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
              marginTop: "-24px",
            }}
          >
            <ShoppingBag size={48} color="#d1d5db" />
            <h2 style={{ marginTop: "12px" }}>Your cart is empty</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Start adding some beautiful candles ✨
            </p>

            <Link
              to="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background:
                  "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                color: "#d4c9b8",
                padding: "12px 22px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* CART ITEMS */
          <div
            style={{
              display: "grid",
              gap: "32px",
              marginTop: "-32px",
              paddingBottom: "64px",
            }}
          >
            {/* ITEMS LIST */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#4a6741",
                  marginBottom: "24px",
                }}
              >
                <Sparkles size={22} />
                Cart Items
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "20px",
                    padding: "20px",
                    borderRadius: "16px",
                    background: "#f9fafb",
                    marginBottom: "16px",
                  }}
                >
                  {/* IMAGE */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />

                  {/* INFO */}
                  <div>
                    <h3 style={{ margin: "0 0 6px 0" }}>{item.name}</h3>
                    <p style={{ margin: 0, color: "#4a6741", fontWeight: 600 }}>
                      Rs {item.price}
                    </p>
                    <p style={{ margin: "6px 0 0 0", color: "#6b7280" }}>
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* PRICE + REMOVE */}
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                      Rs {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Order Summary</h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Subtotal</span>
                <strong>Rs {cartTotal.toFixed(2)}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span>Shipping</span>
                <strong style={{ color: "#10b981" }}>FREE</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#4a6741",
                  marginBottom: "24px",
                }}
              >
                <span>Total</span>
                <span>Rs {cartTotal.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background:
                    "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
                  color: "#d4c9b8",
                  padding: "16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: "linear-gradient(135deg, #4a6741 0%, #3a5231 100%)",
          padding: "24px",
          textAlign: "center",
          color: "#d4c9b8",
        }}
      >
        © 2025 Lumora Candles. Handcrafted with love.
      </footer>
    </div>
  );
};

export default Cart;
