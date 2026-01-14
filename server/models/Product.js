import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["Flower", "Glass", "Seasonal", "Others"],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
