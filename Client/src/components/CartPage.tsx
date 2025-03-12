import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '../store/cartSlice';
import clsx from 'clsx';

// Mock product data - Replace with API call
const products = {
  '1': {
    id: '1',
    title: 'iPhone 13 Pro',
    price: 119900,
    discountPercentage: 10,
    thumbnail: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=400&q=80',
    seller: 'Apple Store',
  },
  '2': {
    id: '2',
    title: 'Samsung Galaxy S21',
    price: 69999,
    discountPercentage: 15,
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
    seller: 'Samsung Official',
  },
};

const coupons = {
  'FIRST50': { discount: 50, minAmount: 1000 },
  'SAVE10': { discount: 10, minAmount: 500 },
};

export function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const appliedCoupon = useSelector((state: RootState) => state.cart.couponCode);
  const couponDiscount = useSelector((state: RootState) => state.cart.discount);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId as keyof typeof products];
      if (!product) return total;
      const discountedPrice = product.price * (1 - product.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const delivery = subtotal > 500 ? 0 : 40;
  const discount = (subtotal * couponDiscount) / 100;
  const total = subtotal + delivery - discount;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: Math.max(1, newQuantity) }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleApplyCoupon = () => {
    const coupon = coupons[couponCode as keyof typeof coupons];
    if (coupon && subtotal >= coupon.minAmount) {
      dispatch(applyCoupon({ code: couponCode, discount: coupon.discount }));
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code or minimum amount not met');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
    setCouponError('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add items to your cart to continue shopping</p>
        <Link
          to="/"
          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm hover:bg-[#1c5bb7] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="bg-white rounded-sm shadow">
            <div className="p-4 border-b">
              <h1 className="text-xl font-medium">Shopping Cart ({cartItems.length} items)</h1>
            </div>
            <div className="divide-y">
              {cartItems.map((item) => {
                const product = products[item.productId as keyof typeof products];
                if (!product) return null;
                
                const discountedPrice = product.price * (1 - product.discountPercentage / 100);
                
                return (
                  <div key={item.productId} className="p-4 flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-500">Seller: {product.seller}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold">₹{Math.round(discountedPrice * item.quantity)}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.price * item.quantity}</span>
                        <span className="text-sm text-green-600">{product.discountPercentage}% off</span>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center border rounded-sm">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-[#2874f0] hover:text-[#1c5bb7] flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="lg:w-96">
          <div className="bg-white rounded-sm shadow sticky top-4">
            <div className="p-4 border-b">
              <h2 className="text-gray-500 font-medium">PRICE DETAILS</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{Math.round(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {delivery === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  <span>₹{delivery}</span>
                )}
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>- ₹{Math.round(discount)}</span>
                </div>
              )}
              <div className="border-t pt-3 font-medium flex justify-between">
                <span>Total Amount</span>
                <span>₹{Math.round(total)}</span>
              </div>
              {couponDiscount > 0 && (
                <p className="text-green-600 text-sm">You will save ₹{Math.round(discount)} on this order</p>
              )}
            </div>

            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-[#2874f0]"
                    />
                    {couponError && (
                      <p className="text-red-500 text-sm mt-1">{couponError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                    className={clsx(
                      'px-4 py-2 rounded-sm',
                      couponCode
                        ? 'bg-[#2874f0] text-white hover:bg-[#1c5bb7]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{appliedCoupon}</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[#2874f0] hover:text-[#1c5bb7]"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="p-4 border-t">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#fb641b] text-white py-3 rounded-sm hover:bg-[#e85d19] transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}