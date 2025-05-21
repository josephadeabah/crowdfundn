import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'The Growth plan support team helped us exceed our funding goal by 240%. Their marketing insights were invaluable!',
      author: 'Sarah J.',
      role: 'Tech Entrepreneur',
      rating: 5,
    },
    {
      quote:
        'Within minutes of contacting Pro+ support, we had solutions to technical issues that would have otherwise derailed our campaign launch.',
      author: 'Michael T.',
      role: 'Game Developer',
      rating: 5,
    },
    {
      quote:
        'Even on the Starter plan, the guidance we received helped us structure a campaign that stood out from the crowd.',
      author: 'Elena R.',
      role: 'Small Business Owner',
      rating: 4,
    },
  ];

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={18}
          className={
            i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }
        />
      ));
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Creators Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
              <blockquote className="text-lg mb-4 italic text-gray-700">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
