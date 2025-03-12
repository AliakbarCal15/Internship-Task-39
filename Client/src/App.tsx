import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductList } from './components/ProductList';
import { ProductDetails } from './components/ProductDetails';
import { WishlistPage } from './components/WishlistPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/category/:category" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/:orderId" element={<OrderTrackingPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;