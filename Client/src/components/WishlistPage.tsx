import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { RootState } from '../store';
import { removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';

export function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Save items you love to your wishlist and review them anytime.</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({wishlistItems.length} items)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const discountedPrice = product.price * (1 - product.discountPercentage / 100);
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/product/${product.id}`} className="block relative aspect-square">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </button>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                      <span>{product.rating}</span>
                      <Star className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                    <span className="text-gray-500 text-sm ml-2">{product.brand}</span>
                  </div>
                </Link>
                <div className="flex items-baseline mb-3">
                  <span className="text-xl font-bold text-gray-900">₹{Math.round(discountedPrice)}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
                  <span className="text-green-600 text-sm ml-2">
                    {Math.round(product.discountPercentage)}% off
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full bg-[#ff9f00] hover:bg-[#ff9000] text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}