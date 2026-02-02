import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders for admin dashboard
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get orders for a specific user (by email)
export const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const orders = await Order.find({ user: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders" });
  }
};

// Get a single order by id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length < 6) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findById(id);
    if (!order) {
      console.warn(`Order not found for id: ${id}`);
      return res.status(404).json({ message: `Order not found (id: ${id})` });
    }

    res.json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    console.log('updateOrderStatus called with', { id, status });

    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'Status is required and must be a string' });
    }

    status = status.trim();

    const allowed = [
      'Processing',
      'Completed',
      'Hand Over for Delivery',
      'Finish',
      // keep backward compatible values
      'Delivered',
    ];

    // Normalize case-insensitively
    const normalized = allowed.find((s) => s.toLowerCase() === status.toLowerCase());
    if (!normalized) {
      return res.status(400).json({ message: `Invalid status value. Allowed: ${allowed.join(', ')}` });
    }

    // Validate id format before DB lookup
    if (!id || id.length < 6) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findById(id);
    if (!order) {
      console.warn(`Order not found for id: ${id}`);
      return res.status(404).json({ message: `Order not found (id: ${id})` });
    }

    console.log(`Updating order ${id} status from '${order.status}' to '${normalized}'`);

    order.status = normalized;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Delete an order (admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length < 6) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      console.warn(`Order not found for id: ${id}`);
      return res.status(404).json({ message: `Order not found (id: ${id})` });
    }

    console.log(`Order deleted: ${id}`);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
};