import express from "express";
const router = express.Router();
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

// Create order
router.post("/", createOrder);

// Get orders for logged-in user (by email)
router.get("/user/:email", getUserOrders);

// Admin: get all orders
router.get("/admin/all", getAllOrders);

// Get single order by id
router.get("/:id", getOrderById);

// Admin: update an order status
router.patch("/:id/status", updateOrderStatus);

export default router;