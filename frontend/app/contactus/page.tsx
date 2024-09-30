'use client';
import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });

  interface Errors {
    email?: string;
  }

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'email') {
      validateEmail(value);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Form submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-color-primary-dark to-theme-color-secondary-dark p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-sm shadow p-6 sm:p-8 md:p-10 w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-theme-color-primary mb-6 text-center dark:text-white">
          Contact Us
        </h1>
        <p className="text-neutral-600 dark:text-gray-300 mb-8 text-center">
          We'd love to hear from you! Please fill out the form below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-theme-color-primary-dark mb-1 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-theme-color-primary focus:border-transparent transition"
                aria-label="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-theme-color-primary-dark mb-1 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-theme-color-primary focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                aria-label="Your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-theme-color-primary-dark mb-1 dark:text-gray-300"
              >
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-theme-color-primary focus:border-transparent transition"
                aria-label="Your phone number (optional)"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-theme-color-primary-dark mb-1 dark:text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-theme-color-primary focus:border-transparent transition"
                aria-label="Select inquiry category"
              >
                <option value="">Select a category</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-theme-color-primary-dark mb-1 dark:text-gray-300"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-theme-color-primary focus:border-transparent transition"
              aria-label="Message subject"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-theme-color-primary-dark mb-1 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-theme-color-primary focus:border-transparent transition"
              aria-label="Your message"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`px-6 py-3 bg-theme-color-primary w-1/2 text-gray-800 dark:text-white font-semibold rounded-md shadow hover:bg-theme-color-primary-dark focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-opacity-50 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block mr-2">
                    &#9696;
                  </span>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-theme-color-primary mb-4 dark:text-white">
            Our Office
          </h2>
          <div className="flex items-start space-x-4">
            <FiMapPin className="text-theme-color-primary text-xl flex-shrink-0 mt-1" />
            <p className="text-neutral-600 dark:text-gray-300">
              123 Rivonia Road, Suite 200
              <br />
              Sandton, 2196
              <br />
              South Africa
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <FiPhone className="text-theme-color-primary text-xl" />
            <p className="text-neutral-600 dark:text-gray-300">
              (555) 123-4567
            </p>
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <FiMail className="text-theme-color-primary text-xl" />
            <p className="text-neutral-600 dark:text-gray-300">
              info@bantuhive.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
