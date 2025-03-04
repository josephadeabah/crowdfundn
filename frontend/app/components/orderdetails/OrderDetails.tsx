import React, { useState } from 'react';
import { FaPrint, FaShare, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

const OrderDetailsPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    orderItems: true,
    deliveryInfo: true,
    paymentInfo: true,
  });
  const [error, setError] = useState<string | null>(null);

  const orderDetails = {
    orderNumber: 'ORD-12345',
    items: [
      { id: 1, name: 'Product A', quantity: 2, price: 29.99 },
      { id: 2, name: 'Product B', quantity: 1, price: 49.99 },
      { id: 3, name: 'Product C', quantity: 3, price: 19.99 },
    ],
    totalCost: 169.94,
    estimatedDeliveryDate: '2023-06-15',
    status: 'Processing',
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Order Details - ${orderDetails.orderNumber}`,
          text: `Check out my order details for ${orderDetails.orderNumber}`,
          url: window.location.href,
        })
        .catch((error) => setError('Error sharing order details'));
    } else {
      setError('Sharing is not supported on this device');
    }
  };

  const orderStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = orderStatuses.indexOf(orderDetails.status);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order Details
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Order Number: {orderDetails.orderNumber}
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <div className="flex items-center">
              <MdError className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="px-4 py-5 sm:p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Order Progress
            </h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                {orderStatuses.map((status, index) => (
                  <div
                    key={status}
                    className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                      index <= currentStatusIndex
                        ? 'text-green-600 bg-green-200'
                        : 'text-gray-600 bg-gray-200'
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{
                    width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%`,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <button
              onClick={() => toggleSection('orderItems')}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={expandedSections.orderItems}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Order Items
              </h2>
              {expandedSections.orderItems ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            {expandedSections.orderItems && (
              <div className="mt-4 space-y-4">
                {orderDetails.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <p className="font-semibold">Total</p>
                  <p className="font-semibold">
                    ${orderDetails.totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <button
              onClick={() => toggleSection('deliveryInfo')}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={expandedSections.deliveryInfo}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Delivery Information
              </h2>
              {expandedSections.deliveryInfo ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            {expandedSections.deliveryInfo && (
              <div className="mt-4">
                <p>
                  Estimated Delivery Date:{' '}
                  <span className="font-medium">
                    {orderDetails.estimatedDeliveryDate}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <button
              onClick={() => toggleSection('paymentInfo')}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={expandedSections.paymentInfo}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Information
              </h2>
              {expandedSections.paymentInfo ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            {expandedSections.paymentInfo && (
              <div className="mt-4">
                <p>
                  Payment Method:{' '}
                  <span className="font-medium">
                    Credit Card (ending in 1234)
                  </span>
                </p>
                <p>
                  Total Paid:{' '}
                  <span className="font-medium">
                    ${orderDetails.totalCost.toFixed(2)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              aria-label="Print order details"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
            <button
              onClick={handleShare}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              aria-label="Share order details"
            >
              <FaShare className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
