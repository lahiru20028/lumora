import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Star, ArrowLeft, ShoppingCart } from "lucide-react";

interface Product {
  _id: string;  // Changed from 'id' to '_id'
  name: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
}

export const ProductDetail = () => {  // Removed React.FC
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔴 TEMP DATA (backend connect කරගත්තට පස්සේ remove කරන්න)
    const tempProduct: Product = {
      _id: id || "1",  // Changed from 'id' to '_id'
      name: "Luxury Vanilla Candle",
      description: "Hand-poured soy wax candle with vanilla fragrance.",
      price: 29.99,
      image_url: "https://via.placeholder.com/500",
      rating: 4,
    };

    setProduct(tempProduct);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image_url}
          alt={product.name}
          className="rounded-xl w-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < product.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <p className="text-2xl font-bold text-orange-600 mb-6">
            ${product.price}
          </p>

          {/* ✅ FIXED addToCart */}
          <button
            onClick={() =>
              addToCart({
                productId: product._id,  // Changed from product.id
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: 1,  // Added quantity property
              })
            }
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};