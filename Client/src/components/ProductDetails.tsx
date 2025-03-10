import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Truck, Shield, RefreshCcw, MapPin, ChevronDown, Check, ShoppingCart, CreditCard } from 'lucide-react';
import { addToCart } from '../store/cartSlice';
import clsx from 'clsx';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  images?: string[];
}

export function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [showEmiOptions, setShowEmiOptions] = useState(false);

  // Mock product data - Replace with API call
  const product = {
    id: '1',
    title: 'iPhone 13 Pro',
    description: '6.1-inch Super Retina XDR display with ProMotion. Ceramic Shield front cover. A15 Bionic chip. Pro camera system. Up to 1TB storage.',
    price: 119900,
    discountPercentage: 10,
    rating: 4.8,
    stock: 50,
    brand: 'Apple',
    category: 'electronics',
    thumbnail: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80',
    ],
    seller: {
      name: 'Apple Authorized Reseller',
      rating: 4.7,
      location: 'Mumbai, Maharashtra',
    },
    emiOptions: [
      { months: 3, amount: 3663 },
      { months: 6, amount: 1899 },
      { months: 12, amount: 999 },
      { months: 24, amount: 499 },
    ],
    warranty: '1 Year Manufacturer Warranty',
    returnPolicy: '7 Days Replacement',
    exchangeOffer: 2000,
  };

  const reviews: Review[] = [
    {
      id: '1',
      user: 'John Doe',
      rating: 5,
      comment: 'Excellent phone! The camera quality is outstanding and the battery life is impressive.',
      date: '2024-03-15',
      isVerified: true,
      images: [
        'https://images.unsplash.com/photo-1590661636248-3de2bf646834?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=400&q=80',
      ],
    },
    {
      id: '2',
      user: 'Jane Smith',
      rating: 4,
      comment: 'Great device but a bit pricey. The ProMotion display is amazing!',
      date: '2024-03-10',
      isVerified: true,
    },
  ];

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const checkDelivery = () => {
    // Mock delivery check - Replace with API call
    return pincode.length === 6;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover transform hover:scale-150 transition-transform duration-300 cursor-zoom-in"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={clsx(
                  'aspect-square rounded-lg overflow-hidden',
                  selectedImage === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                )}
              >
                <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-2 text-gray-600">{product.description}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-4 h-4 ml-0.5 fill-current" />
              </div>
              <span className="text-gray-500 text-sm ml-2">Based on 1,234 ratings</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">₹{Math.round(discountedPrice)}</span>
              <span className="text-lg text-gray-500 line-through ml-2">₹{product.price}</span>
              <span className="text-green-600 text-lg ml-2">{Math.round(product.discountPercentage)}% off</span>
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* EMI Options */}
          <div className="border rounded-lg p-4">
            <button
              onClick={() => setShowEmiOptions(!showEmiOptions)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium">EMI from ₹499/month</span>
              </div>
              <ChevronDown className={clsx('w-5 h-5 transition-transform', showEmiOptions && 'transform rotate-180')} />
            </button>
            {showEmiOptions && (
              <div className="mt-4 space-y-2">
                {product.emiOptions.map((option) => (
                  <div key={option.months} className="flex justify-between text-sm">
                    <span>{option.months} months</span>
                    <span>₹{option.amount}/month</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exchange Offer */}
          <div className="flex items-start space-x-2 text-gray-600">
            <RefreshCcw className="w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">Exchange offer up to ₹{product.exchangeOffer} off</p>
              <p className="text-sm">Exchange your old device for additional discount</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t border-b py-4">
            <div className="flex items-start space-x-2">
              <div>
                <p className="font-medium">Sold by {product.seller.name}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                    <span>{product.seller.rating}</span>
                    <Star className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                  <MapPin className="w-4 h-4 text-gray-500 ml-2" />
                  <span className="text-sm text-gray-500 ml-1">{product.seller.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Check */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter delivery pincode"
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
              <button
                onClick={checkDelivery}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check
              </button>
            </div>
            {pincode.length === 6 && (
              <div className="flex items-center text-green-600">
                <Check className="w-5 h-5 mr-2" />
                <span>Delivery available in 2-3 days</span>
              </div>
            )}
          </div>

          {/* Warranty & Returns */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span>{product.warranty}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <RefreshCcw className="w-5 h-5" />
              <span>{product.returnPolicy}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Truck className="w-5 h-5" />
              <span>Free Delivery</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#ff9f00] hover:bg-[#ff9000] text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button className="flex-1 bg-[#fb641b] hover:bg-[#e85d19] text-white py-3 px-6 rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded">
                  <span>{review.rating}</span>
                  <Star className="w-4 h-4 ml-0.5 fill-current" />
                </div>
                {review.isVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
              {review.images && (
                <div className="mt-3 flex space-x-2">
                  {review.images.map((image, index) => (
                    <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                      <img src={image} alt={`Review ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{review.user}</span>
                <span className="mx-2">•</span>
                <span>{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}