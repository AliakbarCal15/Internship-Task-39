export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  statusUpdates: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}