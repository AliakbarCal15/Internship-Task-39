import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Wallet, Truck, MapPin } from 'lucide-react';
import { RootState } from '../store';
import { clearCart } from '../store/cartSlice';
import clsx from 'clsx';

interface Address {
  fullName: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  type: 'home' | 'work';
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    icon: <Wallet className="w-5 h-5" />,
    description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'All major cards accepted',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: <Truck className="w-5 h-5" />,
    description: 'Pay when your order is delivered',
  },
];

// Mock product data - Replace with API call
const products = {
  '1': {
    id: '1',
    title: 'iPhone 13 Pro',
    price: 119900,
    discountPercentage: 10,
    thumbnail: 'https://images.unsplash.com/photo-1632661674596-618d8b64d641?auto=format&fit=crop&w=400&q=80',
  },
  '2': {
    id: '2',
    title: 'Samsung Galaxy S21',
    price: 69999,
    discountPercentage: 15,
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
  },
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const couponDiscount = useSelector((state: RootState) => state.cart.discount);

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock saved addresses - Replace with API call
  const savedAddresses: Address[] = [
    {
      fullName: 'John Doe',
      phone: '9876543210',
      pincode: '400001',
      address: '123, ABC Apartments, XYZ Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'home',
    },
    {
      fullName: 'John Doe',
      phone: '9876543210',
      pincode: '400002',
      address: '456, Office Complex, Business District',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'work',
    },
  ];

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const product = products[item.productId as keyof typeof products];
      if (!product) return total;
      const discountedPrice = product.price * (1 - product.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);

    const delivery = subtotal > 500 ? 0 : 40;
    const discount = (subtotal * couponDiscount) / 100;
    return {
      subtotal,
      delivery,
      discount,
      total: subtotal + delivery - discount,
    };
  };

  const { subtotal, delivery, discount, total } = calculateTotal();

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch(clearCart());
    navigate('/order-success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow space-y-4">
          {/* Delivery Address */}
          <div className="bg-white rounded-sm shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white flex items-center justify-center">1</span>
                <h2 className="font-medium">Delivery Address</h2>
              </div>
              {step === 'payment' && selectedAddress && (
                <button
                  onClick={() => setStep('address')}
                  className="text-[#2874f0] text-sm"
                >
                  Change
                </button>
              )}
            </div>
            {step === 'address' && (
              <div className="p-4 space-y-4">
                {savedAddresses.map((address, index) => (
                  <label
                    key={index}
                    className={clsx(
                      'block border rounded-sm p-4 cursor-pointer',
                      selectedAddress === address ? 'border-[#2874f0]' : 'hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === address}
                        onChange={() => setSelectedAddress(address)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{address.fullName}</h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs uppercase rounded">
                            {address.type}
                          </span>
                          <span className="text-gray-600">{address.phone}</span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {address.address}, {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => setStep('payment')}
                  disabled={!selectedAddress}
                  className={clsx(
                    'w-full py-3 rounded-sm',
                    selectedAddress
                      ? 'bg-[#fb641b] text-white hover:bg-[#e85d19]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Deliver Here
                </button>
              </div>
            )}
            {step === 'payment' && selectedAddress && (
              <div className="p-4 flex items-start gap-4">
                <Check className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{selectedAddress.fullName}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs uppercase rounded">
                      {selectedAddress.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Options */}
          {step === 'payment' && (
            <div className="bg-white rounded-sm shadow">
              <div className="p-4 border-b flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white flex items-center justify-center">2</span>
                <h2 className="font-medium">Payment Options</h2>
              </div>
              <div className="p-4 space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={clsx(
                      'block border rounded-sm p-4 cursor-pointer',
                      selectedPayment === method.id ? 'border-[#2874f0]' : 'hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          {method.icon}
                          <h3 className="font-medium">{method.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedPayment || isProcessing}
                  className={clsx(
                    'w-full py-3 rounded-sm',
                    selectedPayment && !isProcessing
                      ? 'bg-[#fb641b] text-white hover:bg-[#e85d19]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Price Summary */}
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
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{Math.round(discount)}</span>
                </div>
              )}
              <div className="border-t pt-3 font-medium flex justify-between">
                <span>Total Amount</span>
                <span>₹{Math.round(total)}</span>
              </div>
              {discount > 0 && (
                <p className="text-green-600 text-sm">You will save ₹{Math.round(discount)} on this order</p>
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Delivery at {selectedAddress?.fullName}, {selectedAddress?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}