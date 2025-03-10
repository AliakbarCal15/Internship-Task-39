import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center mb-2">
            <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm">
              <span>{product.rating}</span>
              <Star className="w-4 h-4 ml-0.5 fill-current" />
            </div>
            <span className="text-gray-500 text-sm ml-2">{product.brand}</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">₹{Math.round(discountedPrice)}</span>
            <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
            <span className="text-green-600 text-sm ml-2">{Math.round(product.discountPercentage)}% off</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-[#ff9f00] hover:bg-[#ff9000] text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}