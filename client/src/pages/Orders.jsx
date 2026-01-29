import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Using an empty array for initial state to avoid map errors
  const [dbOrders, setDbOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // If the current user is an admin, redirect them to the admin orders dashboard
      if (parsedUser.role === 'admin') {
        navigate('/admin/orders');
        return;
      }

      const fetchUserOrders = async () => {
        try {
          // Using full URL to ensure connection to your Express backend
          const response = await fetch(`http://localhost:5000/api/orders/user/${parsedUser.email}`);

          if (response.ok) {
            const data = await response.json();
            setDbOrders(data);
          } else {
            setFetchError("Could not retrieve your orders.");
          }
        } catch (err) {
          // Triggered if the backend server is not running
          setFetchError("Unable to connect to the server. (Backend is offline)");
        } finally {
          setLoading(false);
        }
      };

      fetchUserOrders();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f3f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Checking order history...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3f0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2c2c2c", marginBottom: "30px" }}>
          My Orders
        </h1>

        {fetchError && (
          <p style={{ color: "#dc2626", textAlign: "center", marginBottom: "20px" }}>{fetchError}</p>
        )}

        {dbOrders.length === 0 ? (
          <div style={{ 
            textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "8px", border: "1px solid #e5e0d7" 
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2c2c2c", marginBottom: "12px" }}>
              No orders yet
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Your order history will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          dbOrders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#fff", padding: "24px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #e5e0d7", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ 
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "15px", borderBottom: "2px solid #e5e0d7"
              }}>
                <div>
                  <strong style={{ color: "#2c2c2c" }}>Order ID:</strong>{" "}
                  <span style={{ color: "#4a6741", fontWeight: "600" }}>{order._id.substring(0, 8).toUpperCase()}</span>
                  <br />
                  <strong style={{ color: "#2c2c2c" }}>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong style={{ color: "#2c2c2c" }}>Status: </strong>
                  <span
                    style={{
                      color: order.status === "Delivered" ? "#10b981" : "#f59e0b",
                      fontWeight: "600", padding: "4px 12px", borderRadius: "4px",
                      background: order.status === "Delivered" ? "#d1fae5" : "#fef3c7",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {order.orderItems && order.orderItems.map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", borderTop: index > 0 ? "1px solid #e5e0d7" : "none", paddingTop: index > 0 ? "15px" : "0", marginTop: index > 0 ? "15px" : "0" }}>
                  <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", marginRight: "15px", border: "1px solid #e5e0d7" }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#2c2c2c" }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                      Price: Rs. {item.price.toLocaleString()} × Quantity: {item.qty}
                    </p>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#4a6741" }}>
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: "right", marginTop: "20px", padding: "15px", background: "#f9f8f6", borderRadius: "6px", fontSize: "18px", fontWeight: "700", color: "#4a6741" }}>
                Total Amount: Rs. {order.totalPrice.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;