import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, Truck, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { RootState } from '../store';
import { Order, OrderStatus } from '../types';
import clsx from 'clsx';

// Mock products data - Replace with API call
const products = {
  '1': {
    id: '1',
    title: 'iPhone 13 Pro',
    thumbnail: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=400&q=80',
  },
  '2': {
    id: '2',
    title: 'Samsung Galaxy S21',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
  },
};

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; label: string }> = {
  placed: {
    icon: <Clock className="w-6 h-6" />,
    color: 'text-blue-600',
    label: 'Order Placed',
  },
  confirmed: {
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-green-600',
    label: 'Order Confirmed',
  },
  shipped: {
    icon: <Package className="w-6 h-6" />,
    color: 'text-purple-600',
    label: 'Shipped',
  },
  out_for_delivery: {
    icon: <Truck className="w-6 h-6" />,
    color: 'text-orange-600',
    label: 'Out for Delivery',
  },
  delivered: {
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-green-600',
    label: 'Delivered',
  },
};

const statusOrder: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = useSelector((state: RootState) => 
    state.orders.orders.find(o => o.id === orderId)
  );

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist</p>
        <Link
          to="/orders"
          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm hover:bg-[#1c5bb7] transition-colors"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Order Status */}
      <div className="bg-white rounded-sm shadow mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium">Order Status</h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.placedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {statusOrder.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const config = statusConfig[status];
                const update = order.statusUpdates.find(u => u.status === status);

                return (
                  <div key={status} className="flex items-start gap-4">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        isCompleted ? config.color : 'text-gray-400',
                        isCompleted ? 'bg-white ring-2 ring-current' : 'bg-gray-100'
                      )}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-grow pt-1">
                      <div className="flex items-baseline justify-between">
                        <h3 className={clsx(
                          'font-medium',
                          isCompleted ? config.color : 'text-gray-400'
                        )}>
                          {config.label}
                        </h3>
                        {update && (
                          <span className="text-sm text-gray-500">
                            {new Date(update.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {update && (
                        <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                      )}
                      {isCurrent && status !== 'delivered' && (
                        <p className="text-sm text-gray-600 mt-1">
                          Estimated delivery by {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-sm shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="divide-y">
            {order.items.map((item) => {
              const product = products[item.productId as keyof typeof products];
              return (
                <div key={item.productId} className="py-4 flex gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-sm"
                  />
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-gray-500">₹{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white rounded-sm shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Delivery Details</h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium">{order.deliveryAddress.fullName}</h3>
              <p className="text-gray-600">
                {order.deliveryAddress.address}, {order.deliveryAddress.city},
                {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
              <p className="text-gray-600">Phone: {order.deliveryAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}