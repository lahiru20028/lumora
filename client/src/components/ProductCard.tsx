import React from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    }}
    className="product-card">
      
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '240px',
            objectFit: 'cover'
          }}
        />
        
        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '12px',
          minHeight: '48px'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Rs {product.price}
        </p>

        <button
          onClick={() =>
            addToCart({
              productId: product._id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              quantity: 1,
            })
          }
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          className="add-to-cart-btn"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;