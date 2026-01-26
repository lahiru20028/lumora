import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import Product from "./models/Product.js"; // ✅ REQUIRED for migration

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/products", productRoutes);

// Get reviews for a product
app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.reviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= TEMP MIGRATION ROUTE ================= */
/* ⚠️ VISIT ONCE THEN REMOVE */
app.get("/api/migrate-categories", async (req, res) => {
  try {
    const result1 = await Product.updateMany(
      { category: "Luxury" },
      { $set: { category: "Flower" } }
    );

    const result2 = await Product.updateMany(
      { category: "Jar" },
      { $set: { category: "Glass" } }
    );

    const result3 = await Product.updateMany(
      { category: "Shaped" },
      { $set: { category: "Others" } }
    );

    res.json({
      success: true,
      message: "Categories migrated successfully!",
      updated: {
        Luxury_to_Flower: result1.modifiedCount,
        Jar_to_Glass: result2.modifiedCount,
        Shaped_to_Others: result3.modifiedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Lumora Candles API Running");
});

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
