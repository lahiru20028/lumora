import { useState } from "react";
import API from "../api";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await API.post("/api/products", {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,   // ✅ image URL
        stock: Number(form.stock),
      });

      alert("Product added successfully ✅");
      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding product ❌");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-3"
      >
        <h2 className="text-xl font-bold text-center">Add Candle</h2>

        <input
          name="name"
          placeholder="Candle Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* ✅ IMAGE URL FIELD */}
        <input
          name="image"
          placeholder="https://res.cloudinary.com/djagmseqe/image/upload/v1767580064/u5nub4bk5prpuj6ufg4d.jpg"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="stock"
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
