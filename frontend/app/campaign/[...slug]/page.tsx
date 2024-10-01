'use client';
import React, { useState } from 'react';
import { FaHeart, FaShare, FaStar } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/button/Button';

const SingleCampaignPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useParams();
  const { slug } = params; // slug will be an array of the URL segments

  console.log('Campaign slug:', slug);

  const product = {
    name: 'Clean Water for Rural Communities',
    price: '$50,000 Goal',
    rating: 4.9,
    reviews: 254, // Number of supporters/donors
    description:
      'Help bring clean, safe drinking water to rural communities. This campaign focuses on providing access to water through the construction of wells, water tanks, and distribution systems to improve health and reduce water-borne diseases.',
    features: [
      'Construction of 10 wells',
      'Training for local maintenance teams',
      'Access to clean water for over 5,000 people',
      'Reduction in waterborne diseases by 80%',
      'Long-term sustainability plan',
    ],
    specifications: [
      { name: 'Project Duration', value: '12 months' },
      { name: 'Cost per Well', value: '$5,000' },
      { name: 'Total Population Served', value: '5,000+ people' },
      { name: 'Region', value: 'Rural Africa' },
    ],
    images: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1517638851339-4ae9f8f52ee9',
      'https://images.unsplash.com/photo-1559696784-4e4d40d327cc',
    ],
  };

  return (
    <div>
      <div className="mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Left Column - Image */}
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <img
              src={product.images[0]}
              alt="Fundraiser Image"
              className="w-full h-auto"
            />
          </div>

          {/* Right Column - Fundraiser Details */}
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fundraiser Title
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              This is a brief description of the fundraiser, highlighting the
              key points and objectives of the campaign. It's a great way to
              provide an overview of what the fundraiser is about.
            </p>

            {/* Details */}
            <div className="text-gray-800 mb-6">
              <p className="mb-2">
                <strong>Goal:</strong> $10,000
              </p>
              <p className="mb-2">
                <strong>Raised:</strong> $7,500
              </p>
              <p className="mb-2">
                <strong>Donors:</strong> 150
              </p>
              <p>
                <strong>Location:</strong> City, Country
              </p>
            </div>

            {/* Call to Action */}
            <Button
              className="px-6 py-3 w-1/2 focus:ring-2 focus:ring-gray-800 rounded-full text-gray-700 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              size="lg"
              variant="outline"
            >
              Donate Now
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column */}
        <div className="lg:w-1/4 px-4 md:px-1 py-4 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-4">
            {product.price}
          </p>
          <p>Slug: {Array.isArray(slug) ? slug.join('/') : slug}</p>
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
        <div className="lg:w-1/2 p-4">
          <div className="mb-8">
            <img
              src={product.images[selectedImage]}
              alt={`Product image ${selectedImage + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>
              Our Premium Wireless Headphones are designed to deliver an
              exceptional audio experience. With advanced noise-cancellation
              technology, you can immerse yourself in your favorite music
              without any distractions.
            </p>
            <p>
              The over-ear design ensures comfort during long listening
              sessions, while the 40-hour battery life means you can enjoy your
              music for days without needing to recharge. Whether you're
              commuting, working, or relaxing at home, these headphones are the
              perfect companion.
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
          <div className="flex justify-around">
            <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-300">
              <FaHeart className="mr-2" /> Send Good Wishes
            </button>
            <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-300">
              <FaShare className="mr-2" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCampaignPage;
