import React, { useEffect, useState } from 'react';
import { FaHeart, FaShare, FaStar, FaShareAlt } from 'react-icons/fa';

const SingleProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: 'Premium Wireless Headphones',
    price: '$299.99',
    rating: 4.8,
    reviews: 1024,
    description:
      'Experience crystal-clear sound with our Premium Wireless Headphones. Featuring advanced noise-cancellation technology, these headphones deliver an immersive audio experience like no other.',
    features: [
      '40-hour battery life',
      'Active noise cancellation',
      'Bluetooth 5.0 connectivity',
      'Comfortable over-ear design',
      'Voice assistant support',
    ],
    specifications: [
      { name: 'Driver Size', value: '40mm' },
      { name: 'Frequency Response', value: '20Hz - 20kHz' },
      { name: 'Impedance', value: '32 Ohms' },
      { name: 'Weight', value: '250g' },
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944',
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left Column */}
      <div className="lg:w-1/4 p-6 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl font-semibold text-indigo-600 mb-4">
          {product.price}
        </p>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-gray-600">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <div className="grid grid-cols-2 gap-4">
          {product.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-sm font-medium text-gray-800">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column */}
      <div className="lg:w-1/2 p-6">
        <div className="mb-8">
          <img
            src={product.images[selectedImage]}
            alt={`Product image ${selectedImage + 1}`}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${index === selectedImage ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <p>
            Our Premium Wireless Headphones are designed to deliver an
            exceptional audio experience. With advanced noise-cancellation
            technology, you can immerse yourself in your favorite music without
            any distractions.
          </p>
          <p>
            The over-ear design ensures comfort during long listening sessions,
            while the 40-hour battery life means you can enjoy your music for
            days without needing to recharge. Whether you're commuting, working,
            or relaxing at home, these headphones are the perfect companion.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
          <ul>
            <li>Active noise cancellation for immersive listening</li>
            <li>
              Bluetooth 5.0 for stable and long-range wireless connectivity
            </li>
            <li>40mm drivers for rich, detailed sound</li>
            <li>Comfortable over-ear design with premium materials</li>
            <li>Voice assistant support for hands-free control</li>
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:w-1/4 p-6 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <table className="w-full">
            <tbody>
              {product.specifications.map((spec, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2 font-medium text-gray-600">
                    {spec.name}
                  </td>
                  <td className="py-2 text-right text-gray-800">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add to Cart</h2>
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
        <div className="flex justify-around">
          <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300">
            <FaHeart className="mr-2" /> Add to Wishlist
          </button>
          <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300">
            <FaShare className="mr-2" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;

export const SingleItemPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const productData = {
    name: 'Premium Smartwatch',
    price: '$299.99',
    features: [
      'Heart Rate Monitor',
      'Sleep Tracking',
      'Water Resistant',
      'GPS Enabled',
    ],
    description:
      'Experience the future of wearable technology with our Premium Smartwatch. This cutting-edge device combines style with functionality, offering a range of features to enhance your daily life. From tracking your fitness goals to staying connected on the go, our smartwatch is the perfect companion for the modern, active individual.',
    images: [
      'images.unsplash.com/photo-1546868871-7041f2a55e12',
      'images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
      'images.unsplash.com/photo-1523275335684-37898b6baf30',
    ],
    relatedProducts: [
      { name: 'Fitness Tracker', price: '$79.99' },
      { name: 'Wireless Earbuds', price: '$129.99' },
      { name: 'Power Bank', price: '$49.99' },
    ],
    reviews: [
      {
        user: 'John D.',
        rating: 5,
        comment: 'Amazing product! Exceeded my expectations.',
      },
      {
        user: 'Sarah M.',
        rating: 4,
        comment: 'Great features, but battery life could be better.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* First Column (Sticky) */}
          <div className="lg:w-1/4">
            <div
              className={`bg-white rounded-lg shadow-md p-6 ${scrollPosition > 100 ? 'lg:sticky lg:top-4' : ''}`}
            >
              <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>
              <p className="text-2xl text-blue-600 font-semibold mb-6">
                {productData.price}
              </p>
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {productData.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Middle Column (Non-Sticky) */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {productData.images.map((image, index) => (
                  <img
                    key={index}
                    src={`https://${image}`}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                  />
                ))}
              </div>
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  Product Description
                </h2>
                <p>{productData.description}</p>
              </div>
            </div>
          </div>

          {/* Third Column (Sticky) */}
          <div className="lg:w-1/4">
            <div
              className={`bg-white rounded-lg shadow-md p-6 ${scrollPosition > 100 ? 'lg:sticky lg:top-4' : ''}`}
            >
              <h2 className="text-xl font-semibold mb-4">Related Products</h2>
              <div className="space-y-4">
                {productData.relatedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    <span>{product.name}</span>
                    <span className="font-semibold">{product.price}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {productData.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">{review.user}</span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                  <FaShareAlt className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
