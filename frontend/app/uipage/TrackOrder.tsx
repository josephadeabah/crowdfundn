import React, { useState, useEffect } from 'react';
import { FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TrackOrder = () => {
  const [orderStatus, setOrderStatus] = useState('processing');
  const [progress, setProgress] = useState(0);

  const stages = [
    { name: 'Processing', icon: FaBox },
    { name: 'Shipped', icon: FaTruck },
    { name: 'Out for Delivery', icon: FaShippingFast },
    { name: 'Delivered', icon: FaCheckCircle },
  ];

  useEffect(() => {
    // Simulating real-time updates
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress < 25) setOrderStatus('processing');
    else if (progress < 50) setOrderStatus('shipped');
    else if (progress < 75) setOrderStatus('out for delivery');
    else setOrderStatus('delivered');
  }, [progress]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-theme-color-primary mb-6">
        Track Your Order
      </h2>
      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-theme-color-primary bg-theme-color-primary-content">
                Order Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-theme-color-primary text-gray-800">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <motion.div
            className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-theme-color-primary-content bg-red-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-gray-800 justify-center bg-theme-color-primary"
            ></div>
          </motion.div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-8">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className={`flex flex-col items-center ${
              index <=
              stages.findIndex((s) => s.name.toLowerCase() === orderStatus)
                ? 'text-theme-color-primary'
                : 'text-gray-400'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-theme-color-primary-content flex items-center justify-center mb-2 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`View details for ${stage.name} stage`}
            >
              <stage.icon className="text-2xl" />
            </motion.div>
            <span className="text-sm font-medium">{stage.name}</span>
          </div>
        ))}
      </div>
      <div className="bg-theme-color-primary-content p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-theme-color-primary">
          Current Status
        </h3>
        <p className="text-lg text-gray-700 capitalize">{orderStatus}</p>
        <p className="text-sm text-gray-500 mt-2">
          Your order is currently {orderStatus}. We'll update you when the
          status changes.
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;
