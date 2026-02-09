import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ➕ Add product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📦 Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PRODUCT (needed for edit test)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ⭐ GET REVIEWS FOR A PRODUCT
router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.reviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ⭐ ADD REVIEW TO PRODUCT
router.post("/:id/reviews", async (req, res) => {
  try {
    const { rating, comment, reviewer, image } = req.body;

    // Validate input
    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid review data" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add new review
    const newReview = {
      rating,
      comment,
      reviewer: reviewer || "Anonymous",
      image,
    };

    product.reviews.push(newReview);

    // Update product rating (average of all reviews)
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    const updated = await product.save();
    res.status(201).json(updated);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete products
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
