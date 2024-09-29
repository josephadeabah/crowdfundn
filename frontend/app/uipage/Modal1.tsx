'use client';

import React, { useState } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';

const Modal1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);
  const toggleEdit = () => setIsEditing(!isEditing);

  const dummyProduct = {
    name: 'Premium Wireless Headphones',
    price: '$299.99',
    category: 'Electronics',
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={toggleModal}
        className="px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
        aria-label="Open product details"
      >
        View Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transition-all duration-300 transform"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-medium text-gray-900"
                  id="modal-headline"
                >
                  {isEditing ? 'Edit Product' : 'Product Details'}
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="product-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="product-name"
                    value={dummyProduct.name}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="product-price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    id="product-price"
                    value={dummyProduct.price}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="product-category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="product-category"
                    value={dummyProduct.category}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-100'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              <button
                onClick={toggleEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal1;
