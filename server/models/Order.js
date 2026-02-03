import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String, // Storing user email to link the order
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'bank', 'stripe'],
      default: 'cod',
    },
    // Optional shipping details provided at checkout
    shippingDetails: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      zipCode: { type: String },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      default: "Processing", // Initial status for every new order
    },
  },
  {
    timestamps: true, // This automatically adds 'createdAt' and 'updatedAt'
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;