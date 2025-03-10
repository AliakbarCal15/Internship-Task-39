import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Product } from '../types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    description: '6.1-inch Super Retina XDR display with ProMotion. Ceramic Shield front cover.',
    price: 119900,
    discountPercentage: 10,
    rating: 4.8,
    stock: 50,
    brand: 'Apple',
    category: 'electronics',
    thumbnail: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '2',
    title: 'Samsung Galaxy S21',
    description: '6.2-inch Dynamic AMOLED 2X display. 64MP triple camera system.',
    price: 69999,
    discountPercentage: 15,
    rating: 4.5,
    stock: 30,
    brand: 'Samsung',
    category: 'electronics',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '3',
    title: 'MacBook Pro 14"',
    description: 'Apple M1 Pro chip, 16GB RAM, 512GB SSD, Liquid Retina XDR display.',
    price: 199900,
    discountPercentage: 8,
    rating: 4.9,
    stock: 15,
    brand: 'Apple',
    category: 'electronics',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '4',
    title: 'Sony WH-1000XM4',
    description: 'Industry-leading noise canceling wireless headphones.',
    price: 29990,
    discountPercentage: 20,
    rating: 4.7,
    stock: 45,
    brand: 'Sony',
    category: 'electronics',
    thumbnail: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '5',
    title: 'Nike Air Max 270',
    description: 'Men\'s Running Shoes with Air cushioning.',
    price: 12995,
    discountPercentage: 25,
    rating: 4.4,
    stock: 60,
    brand: 'Nike',
    category: 'fashion',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '6',
    title: 'Adidas Ultraboost 21',
    description: 'Running shoes with responsive Boost cushioning.',
    price: 15999,
    discountPercentage: 30,
    rating: 4.6,
    stock: 40,
    brand: 'Adidas',
    category: 'fashion',
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '7',
    title: 'LG 55" OLED TV',
    description: '4K Ultra HD Smart OLED TV with AI ThinQ.',
    price: 149990,
    discountPercentage: 12,
    rating: 4.8,
    stock: 10,
    brand: 'LG',
    category: 'electronics',
    thumbnail: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    images: []
  },
  {
    id: '8',
    title: 'Puma Running Shoes',
    description: 'Lightweight running shoes with NITRO foam.',
    price: 8999,
    discountPercentage: 40,
    rating: 4.3,
    stock: 75,
    brand: 'Puma',
    category: 'fashion',
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80',
    images: []
  }
];

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(4);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      const price = product.price * (1 - product.discountPercentage / 100);
      return (
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
        product.rating >= minRating
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <ProductFilters
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          minRating={minRating}
          setMinRating={setMinRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'px-4 py-2 rounded-md',
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}