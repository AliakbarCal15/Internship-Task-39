import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1920&q=80',
    title: 'Summer Fashion Sale',
    description: 'Up to 70% off on trending styles',
    link: '/category/fashion'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1920&q=80',
    title: 'Electronics Mega Deal',
    description: 'Latest gadgets at best prices',
    link: '/category/electronics'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=80',
    title: 'Home Decor Festival',
    description: 'Transform your space',
    link: '/category/home-furniture'
  }
];

const promotionalCards = [
  {
    id: 1,
    title: 'Electronics Sale',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    discount: 'Up to 40% Off',
    link: '/category/electronics'
  },
  {
    id: 2,
    title: 'Fashion Trends',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    discount: 'Min 50% Off',
    link: '/category/fashion'
  },
  {
    id: 3,
    title: 'Best Deals',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80',
    discount: '70% Off',
    link: '/deals'
  },
  {
    id: 4,
    title: 'Home Essentials',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    discount: 'From ₹299',
    link: '/category/home-furniture'
  }
];

export function HeroSection() {
  return (
    <div className="space-y-8">
      {/* Banner Carousel */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
          className="aspect-[21/9] rounded-lg overflow-hidden"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link to={banner.link} className="relative block w-full h-full">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                  <div className="text-white p-8 md:p-12 max-w-xl">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                    <p className="text-lg md:text-xl mb-4">{banner.description}</p>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                      Shop Now
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Promotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {promotionalCards.map((card) => (
          <Link
            key={card.id}
            to={card.link}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="aspect-[16/9]">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold mb-1">{card.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-semibold">{card.discount}</span>
                  <ArrowRight className="text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}