import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

// Mock data - Replace with API call
const mockProducts = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    category: 'electronics',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=64&q=80',
  },
  {
    id: '2',
    title: 'Samsung Galaxy S21',
    category: 'electronics',
    brand: 'Samsung',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=64&q=80',
  },
  {
    id: '3',
    title: 'MacBook Pro 14"',
    category: 'electronics',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=64&q=80',
  },
  {
    id: '4',
    title: 'Nike Air Max 270',
    category: 'fashion',
    brand: 'Nike',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=64&q=80',
  },
];

const trendingSearches = [
  'iPhone 13 Pro',
  'Samsung Galaxy S21',
  'Nike Air Max',
  'MacBook Pro',
  'Gaming Laptops',
];

interface SearchResult {
  id: string;
  title: string;
  category: string;
  brand: string;
  thumbnail: string;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'trending';
  text: string;
  data?: SearchResult;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchProducts(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const results: SearchSuggestion[] = [];

      // Search in products
      const productMatches = mockProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Add product suggestions
      productMatches.forEach(product => {
        results.push({
          type: 'product',
          text: product.title,
          data: product,
        });
      });

      // Add category suggestions
      const categories = Array.from(new Set(productMatches.map(p => p.category)));
      categories.forEach(category => {
        results.push({
          type: 'category',
          text: category,
        });
      });

      // Add brand suggestions
      const brands = Array.from(new Set(productMatches.map(p => p.brand)));
      brands.forEach(brand => {
        results.push({
          type: 'brand',
          text: brand,
        });
      });

      // Add trending searches
      if (searchQuery.length < 3) {
        trendingSearches.forEach(trend => {
          results.push({
            type: 'trending',
            text: trend,
          });
        });
      }

      setSuggestions(results);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'product':
        navigate(`/product/${suggestion.data?.id}`);
        break;
      case 'category':
        navigate(`/category/${suggestion.text.toLowerCase()}`);
        break;
      case 'brand':
        navigate(`/brand/${suggestion.text.toLowerCase()}`);
        break;
      case 'trending':
        setQuery(suggestion.text);
        handleSearch(suggestion.text);
        break;
    }
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for products, brands and more"
          className="w-full py-2 px-4 pr-10 rounded-sm text-black focus:outline-none"
        />
        <div className="absolute right-3 top-2.5">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search
              className="w-5 h-5 text-gray-400 cursor-pointer"
              onClick={() => handleSearch(query)}
            />
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || query.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-0.5 bg-white rounded-sm shadow-lg z-50 max-h-[70vh] overflow-y-auto">
          {suggestions.length === 0 && query.length > 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                >
                  {suggestion.type === 'product' && suggestion.data && (
                    <img
                      src={suggestion.data.thumbnail}
                      alt={suggestion.text}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  {suggestion.type === 'trending' && (
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="text-gray-900">{suggestion.text}</div>
                    {suggestion.type === 'product' && suggestion.data && (
                      <div className="text-sm text-gray-500">
                        in {suggestion.data.category}
                      </div>
                    )}
                    {suggestion.type === 'category' && (
                      <div className="text-sm text-gray-500">
                        in Categories
                      </div>
                    )}
                    {suggestion.type === 'brand' && (
                      <div className="text-sm text-gray-500">
                        in Brands
                      </div>
                    )}
                    {suggestion.type === 'trending' && (
                      <div className="text-sm text-gray-500">
                        Trending Search
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}