import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const destinations = [
  {
    id: 1,
    name: 'Paris',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 2,
    name: 'Tokyo',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 3,
    name: 'New York',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 4,
    name: 'Bali',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000',
  },
];

const NewsletterComponent = () => {
  const [email, setEmail] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<number[]>(
    [],
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDestinationChange = (destId: number) => {
    setSelectedDestinations((prev) =>
      prev.includes(destId)
        ? prev.filter((id) => id !== destId)
        : [...prev, destId],
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDestinations.length === 0) {
      setError('Please select at least one destination');
      return;
    }
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setSuccess(true);
    // Here you would typically send the data to your backend
    console.log('Submitted:', { email, selectedDestinations });
  };

  return (
    <div className="bg-theme-color-base p-6 md:p-10 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-theme-color-primary mb-6 text-center">
        Subscribe to Our Travel Newsletter
      </h2>
      <p className="text-theme-color-neutral-content text-center mb-8">
        Stay updated with the latest travel deals and destination highlights!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destinations.map((dest) => (
            <label
              key={dest.id}
              className={`flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
                selectedDestinations.includes(dest.id)
                  ? 'ring-2 ring-theme-color-primary'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedDestinations.includes(dest.id)}
                onChange={() => handleDestinationChange(dest.id)}
                aria-label={`Select ${dest.name}`}
              />
              <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden mr-4">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-theme-color-primary-content">
                  {dest.name}
                </p>
              </div>
              <div className="flex-shrink-0 ml-2">
                <FaCheckCircle
                  className={`text-theme-color-primary text-2xl transition-opacity ${
                    selectedDestinations.includes(dest.id)
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 rounded-md border border-theme-color-neutral focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
            required
            aria-label="Email address"
          />
          <button
            type="submit"
            className="bg-theme-color-primary text-white px-6 py-2 rounded-md hover:bg-theme-color-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-offset-2"
          >
            Subscribe
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
            role="alert"
          >
            <div className="flex items-center">
              <FaExclamationCircle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
            role="alert"
          >
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              <p>Thank you for subscribing!</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsletterComponent;
