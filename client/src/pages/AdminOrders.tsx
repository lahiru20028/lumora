import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const AdminOrders: React.FC = () => {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await API.get('/api/orders/admin/all');
        setAllOrders(response.data);
      } catch (err) {
        console.error("Error fetching admin orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  const statuses = ['Processing','Completed','Hand Over for Delivery','Finish'];
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [loadingJsonOrder, setLoadingJsonOrder] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const response = await API.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setAllOrders(prev => prev.map(o => o._id === orderId ? response.data : o));
      // show a small confirmation
      window.alert('Order status updated.');
    } catch (err: any) {
      // Show server error message if available
      const message = err?.response?.data?.message || err.message || 'Unable to update order status.';
      console.error('Failed to update status', message);
      window.alert(message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const fetchAndShowOrderJson = async (orderId: string) => {
    setLoadingJsonOrder(orderId);
    try {
      const res = await API.get(`/api/orders/${orderId}`);
      const json = JSON.stringify(res.data, null, 2);
      const w = window.open('', '_blank', 'width=800,height=900');
      if (w) {
        w.document.write(`<pre style="font-family:monospace;padding:20px;white-space:pre-wrap">${json}</pre>`);
        w.document.close();
        w.focus();
      } else {
        window.alert('Popups blocked. Please allow popups to view order JSON.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Unable to fetch order JSON.';
      console.error('Failed to fetch order JSON', message);
      window.alert(message);
    } finally {
      setLoadingJsonOrder(null);
    }
  };

  const printOrder = (order: any) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice - ${order._id}</title><style>
      body{font-family: Arial, Helvetica, sans-serif; color:#111;}
      .header{background:#4a6741;color:#d4c9b8;padding:20px;text-align:center}
      .section{padding:20px}
      table{width:100%;border-collapse:collapse}
      th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}
      .right{text-align:right}
      </style></head><body>
      <div class="header"><h2>Lumora Candles - Invoice</h2></div>
      <div class="section"><strong>Order:</strong> ${order._id}<br/>
      <strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}<br/>
      <strong>Customer:</strong> ${order.shippingDetails?.fullName || '-'}<br/>
      <strong>Email:</strong> ${order.shippingDetails?.email || order.user || '-'}<br/>
      <strong>Customer ID:</strong> ${order.user || '-'}<br/>
      <strong>Shipping:</strong> ${formatAddress(order.shippingDetails) || '-'}</div>
      <div class="section"><table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th class="right">Subtotal</th></tr></thead><tbody>
      ${order.orderItems.map((it:any)=>`<tr><td>${it.name}</td><td>${it.qty}</td><td>Rs. ${Number(it.price).toFixed(2)}</td><td class="right">Rs. ${(it.price*it.qty).toFixed(2)}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="section" style="text-align:right;font-weight:700">Total: Rs. ${Number(order.totalPrice).toFixed(2)}</div>
      <div class="section" style="text-align:center;color:#6b7280">Thank you for your purchase!</div>
      <script>setTimeout(()=>{window.print();},300)</script></body></html>`;

    const w = window.open('', '_blank', 'width=800,height=900');
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
    } else {
      window.alert('Popups blocked. Please allow popups to print invoice.');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Delete this order? This action cannot be undone.')) return;
    setUpdatingOrder(orderId);
    try {
      await API.delete(`/api/orders/${orderId}`);
      setAllOrders(prev => prev.filter(o => o._id !== orderId));
      window.alert('Order deleted.');
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Unable to delete order.';
      console.error('Failed to delete order', message);
      window.alert(message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading || authLoading) return <p style={{ padding: 40 }}>Loading all store orders...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', color: '#d4c9b8', padding: '20px', borderRadius: 8, marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard: All Orders</h1>
      </div>

      {allOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "8px", border: "1px solid #e5e0d7" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>No orders yet</h2>
          <p style={{ color: "#6b7280" }}>Your store has no orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {allOrders.map((order) => (
            <div key={order._id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 520px' }}>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>Order</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{order._id.substring(0,8).toUpperCase()}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{new Date(order.createdAt).toLocaleString()}</div>

                  <div style={{ marginTop: 12, background: '#f8faf6', padding: 12, borderRadius: 8, border: '1px solid #eef2e7' }}>
                    <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Customer</div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{order.shippingDetails?.fullName || '-'}</div>
                    <div style={{ color: '#374151', marginTop: 8 }}>{formatAddressBlock(order.shippingDetails)}</div>
                    <div style={{ color: '#6b7280', marginTop: 10 }}>
                      <strong>Email:</strong> {order.shippingDetails?.email || order.user || '-'}<br/>
                      <strong>Customer ID:</strong> {order.user || '-'}
                    </div>
                  </div>
                </div>

                <div style={{ width: 160, textAlign: 'right' }}>
                  {/* Quick actions (status + print) are shown below */}
                </div>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '10px 12px', color: '#374151' }}>Item</th>
                      <th style={{ padding: '10px 12px', color: '#374151' }}>Qty</th>
                      <th style={{ padding: '10px 12px', color: '#374151' }}>Unit Price</th>
                      <th style={{ padding: '10px 12px', color: '#374151' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems && order.orderItems.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid #e6e6e6' }} />
                            <div>
                              <div style={{ fontWeight: 700 }}>{item.name}</div>
                              <div style={{ color: '#6b7280', fontSize: 13 }}>{/* optional product details */}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{item.qty}</td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>Rs. {Number(item.price).toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', color: '#374151', fontWeight: 700 }}>Rs. {(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Total</div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>Rs. {Number(order.totalPrice ?? 0).toFixed(2)}</div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} disabled={updatingOrder === order._id} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e6e6e6', background: 'white', fontWeight: 700 }}>
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button onClick={() => printOrder(order)} disabled={updatingOrder === order._id} style={{ padding: '10px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)', color: '#d4c9b8', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: updatingOrder === order._id ? 0.7 : 1 }}>
                    Print Invoice
                  </button>

                  <button onClick={() => handleDelete(order._id)} disabled={updatingOrder === order._id} style={{ padding: '10px 14px', borderRadius: 8, background: '#ef4444', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: updatingOrder === order._id ? 0.6 : 1 }}>
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 14, color: '#374151' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'top', color: '#374151', fontSize: 14 };

function formatAddress(addr: any) {
  if (!addr) return '-';
  const parts = [];
  if (addr.address) parts.push(addr.address);
  if (addr.city) parts.push(addr.city);
  if (addr.zipCode) parts.push(addr.zipCode);
  if (addr.phone) parts.push(`Phone: ${addr.phone}`);
  return parts.join(', ');
}

function formatCurrency(n: any) {
  return `Rs. ${Number(n ?? 0).toFixed(2)}`;
}

function formatAddressBlock(addr: any) {
  if (!addr) return <span style={{ color: '#6b7280' }}>-</span>;
  const lines: string[] = [];
  if (addr.address) lines.push(addr.address);
  if (addr.city) lines.push(addr.city);
  if (addr.zipCode) lines.push(addr.zipCode);
  if (addr.phone) lines.push(`Phone: ${addr.phone}`);
  return (
    <div>
      {lines.map((line, i) => (
        <div key={i} style={{ color: '#6b7280' }}>{line}</div>
      ))}
    </div>
  );
}



export default AdminOrders;