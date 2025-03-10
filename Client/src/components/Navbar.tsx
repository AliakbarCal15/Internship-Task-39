import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { RootState } from '../store';
import clsx from 'clsx';

const categories = [
  'Electronics',
  'Fashion',
  'Home & Furniture',
  'Beauty & Personal Care',
  'Books',
  'Sports & Fitness',
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.currentUser);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-[#2874f0] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold italic">Flipkart</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full py-2 px-4 pr-10 rounded-sm text-black focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-200">
              <div className="relative">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="flex items-center space-x-1 hover:text-gray-200">
              <Heart size={22} />
              <span>Wishlist</span>
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-1 hover:text-gray-200"
              >
                <User size={22} />
                <span>Profile</span>
                <ChevronDown size={16} />
              </button>

              {/* Profile Dropdown */}
              <div
                className={clsx(
                  'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1',
                  'transition-all duration-200 ease-in-out',
                  {
                    'opacity-100 visible': isProfileDropdownOpen,
                    'opacity-0 invisible': !isProfileDropdownOpen,
                  }
                )}
              >
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {/* Implement logout */}}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Menu */}
        <div className="flex items-center space-x-8 py-2 text-sm">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase().replace(/ & /g, '-')}`}
              className="hover:text-gray-200"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}