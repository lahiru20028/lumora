import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "ORD-1001",
    date: "2026-01-15",
    status: "Delivered",
    total: 2500,
    items: [
      {
        name: "Rose Flower Candle",
        price: 800,
        qty: 2,
        image:
          "https://via.placeholder.com/80",
      },
      {
        name: "Lotus Flower Candle",
        price: 900,
        qty: 1,
        image:
          "https://via.placeholder.com/80",
      },
    ],
  },
  {
    id: "ORD-1002",
    date: "2026-01-18",
    status: "Processing",
    total: 1200,
    items: [
      {
        name: "Daisy Flower Candle",
        price: 600,
        qty: 2,
        image:
          "https://via.placeholder.com/80",
      },
    ],
  },
];

function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Ensure role is set - default to 'user' if missing
      if (!parsedUser.role) {
        parsedUser.role = 'user';
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
      
      // Check if user is admin
      if (parsedUser.role !== 'admin') {
        // Redirect non-admin users to home page
        navigate('/');
      }
    } else {
      // Redirect to login if not logged in
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // Show loading state or nothing while checking
  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f3f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3f0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2c2c2c", marginBottom: "30px" }}>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e5e0d7"
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2c2c2c", marginBottom: "12px" }}>
              No orders yet
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Your order history will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#fff",
                padding: "24px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #e5e0d7",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Order Header */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "2px solid #e5e0d7"
              }}>
                <div>
                  <strong style={{ color: "#2c2c2c" }}>Order ID:</strong>{" "}
                  <span style={{ color: "#4a6741", fontWeight: "600" }}>{order.id}</span>
                  <br />
                  <strong style={{ color: "#2c2c2c" }}>Date:</strong> {order.date}
                </div>
                <div>
                  <strong style={{ color: "#2c2c2c" }}>Status: </strong>
                  <span
                    style={{
                      color: order.status === "Delivered" ? "#10b981" : "#f59e0b",
                      fontWeight: "600",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      background: order.status === "Delivered" ? "#d1fae5" : "#fef3c7",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderTop: index > 0 ? "1px solid #e5e0d7" : "none",
                    paddingTop: index > 0 ? "15px" : "0",
                    marginTop: index > 0 ? "15px" : "0",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginRight: "15px",
                      border: "1px solid #e5e0d7",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#2c2c2c" }}>
                      {item.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                      Price: Rs. {item.price.toLocaleString()} × Quantity: {item.qty}
                    </p>
                  </div>

                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#4a6741" }}>
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Order Total */}
              <div
                style={{
                  textAlign: "right",
                  marginTop: "20px",
                  paddingTop: "15px",
                  borderTop: "2px solid #e5e0d7",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#4a6741",
                }}
              >
                Total: Rs. {order.total.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

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
}

export default Orders;
