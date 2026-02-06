import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

const ProductCard = ({ product, compact = false }: { product: Product; compact?: boolean }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'white',
      borderRadius: compact ? '12px' : '20px',
      overflow: 'hidden',
      boxShadow: compact ? '0 1px 3px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.1)',
      border: compact ? '1px solid #e5e7eb' : 'none',
      transition: 'all 0.3s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%' // Ensure full width
    }}
    className="product-card">
      
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: compact ? '160px' : '240px', // max-h-40 equivalent
            objectFit: 'cover'
          }}
        />
        
        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
          color: '#d4c9b8',
          padding: compact ? '4px 8px' : '8px 16px',
          borderRadius: '20px',
          fontSize: compact ? '10px' : '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(74, 103, 65, 0.4)'
        }}>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: compact ? '16px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <h3 
          onClick={() => navigate(`/products/${product._id}`)}
          style={{
            fontSize: compact ? '15px' : '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '4px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: compact ? 1 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#4a6741';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#1f2937';
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '12px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {product.description || "Handcrafted with premium natural ingredients for a warm, soothing glow."}
        </p>

        <p style={{
          fontSize: compact ? '16px' : '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: compact ? '0' : '20px',
          marginTop: 'auto'
        }}>
          Rs {product.price}
        </p>

        {!compact && (
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
              background: 'linear-gradient(135deg, #4a6741 0%, #3a5231 100%)',
              color: '#d4c9b8',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(74, 103, 65, 0.4)'
            }}
            className="add-to-cart-btn"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        )}
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74, 103, 65, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;