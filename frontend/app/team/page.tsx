'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/button/Button';

const TeamCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface TeamMember {
    id: number;
    name: string;
    position: string;
    description: string;
    image: string;
    fullDescription: string;
    socialLinks: {
      linkedin: string;
      twitter: string;
      github: string;
    };
  }

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const teamMembers = [
    {
      id: 1,
      name: 'Nqoba Manana',
      position: 'Co-Founder & Co-CEO, COO',
      description: 'South African Region',
      image: '/Nqoba.JPG',
      fullDescription:
        'Nqoba Manana is a visionary leader with over 10 years of experience in the baking industry. As COO, Head of Corporate Functions, and Co-CEO, he leads the company’s operational strategy and corporate governance, while sharing executive leadership responsibilities as Co-CEO',
      socialLinks: {
        linkedin:
          'https://www.linkedin.com/in/nqoba-g-manana/?originalSubdomain=sz',
        twitter: 'https://x.com/maynemanana?lang=en',
        github: 'https://github.com/Nq-Manana',
      },
    },
    {
      id: 2,
      name: 'Joseph Adeabah',
      position: 'Co-Founder & Co-CEO, CTO',
      description: 'West African Region',
      image: '/abeansah.jpg',
      fullDescription:
        'Joseph Adeabah is an innovative technologist with over 6 years of experience in the tech industry. As CTO and Co-CEO, he leads the company’s technology strategy and product development, while sharing executive leadership responsibilities as Co-CEO.',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/joseph-835977a5/',
        twitter: 'https://x.com/abe_ansah',
        github: 'https://github.com/josephadeabah',
      },
    },
    {
      id: 3,
      name: 'Team Member 3',
      position: 'Team Member',
      description: 'Lorem ipsum dolor sit amet',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
      fullDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mikejohnson',
        twitter: 'https://twitter.com/mikejohnson',
        github: 'https://github.com/mikejohnson',
      },
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === teamMembers.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1,
    );
  };

  const openModal = (member: (typeof teamMembers)[0]) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    let startX: number;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (diff > 50) {
        nextSlide();
        isDragging = false;
      } else if (diff < -50) {
        prevSlide();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart);
    }
    if (carousel) {
      carousel.addEventListener('touchmove', handleTouchMove);
    }
    if (carousel) {
      carousel.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('touchstart', handleTouchStart);
      }
      if (carousel) {
        carousel.removeEventListener('touchmove', handleTouchMove);
      }
      if (carousel) {
        carousel.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-6xl h-screen mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
      <div
        ref={carouselRef}
        className="relative overflow-hidden"
        aria-live="polite"
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="w-full flex-shrink-0 px-4 py-4 sm:w-1/2 md:w-1/3"
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => openModal(member)}
                onKeyDown={(e) => e.key === 'Enter' && openModal(member)}
                tabIndex={0}
                role="button"
                aria-label={`View ${member.name}'s profile`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-[50%_30%]" // Adjust based on image needs
                />

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-50 mb-2">
                    {member.position}
                  </p>
                  <p className="text-gray-700 dark:text-gray-50">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={prevSlide}
        aria-label="Previous team member"
      >
        <FaArrowLeft className="text-gray-600" />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={nextSlide}
        aria-label="Next team member"
      >
        <FaArrowRight className="text-gray-600" />
      </button>

      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-full h-64 object-cover object-[60%_30%] rounded-lg mb-6"
              />
              <h3 className="text-2xl font-bold mb-2">{selectedMember.name}</h3>
              <p className="text-xl text-gray-600 mb-4">
                {selectedMember.position}
              </p>
              <p className="text-gray-700 mb-6">
                {selectedMember.fullDescription}
              </p>
              <div className="flex space-x-4">
                <a
                  href={selectedMember.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                    className="fill-gray-950 dark:fill-white"
                  >
                    <path d="M216 20H40a20 20 0 0 0-20 20v176a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V40a20 20 0 0 0-20-20Zm-4 192H44V44h168Zm-100-36v-56a12 12 0 0 1 21.43-7.41A40 40 0 0 1 192 148v28a12 12 0 0 1-24 0v-28a16 16 0 0 0-32 0v28a12 12 0 0 1-24 0Zm-16-56v56a12 12 0 0 1-24 0v-56a12 12 0 0 1 24 0ZM68 80a16 16 0 1 1 16 16 16 16 0 0 1-16-16Z" />
                  </svg>
                </a>
                <a
                  href={selectedMember.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-600"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                    className="fill-gray-950 dark:fill-white"
                  >
                    <path d="m218.12 209.56-61-95.8 59.72-65.69a12 12 0 0 0-17.76-16.14l-55.27 60.84-37.69-59.21A12 12 0 0 0 96 28H48a12 12 0 0 0-10.12 18.44l61 95.8-59.76 65.69a12 12 0 1 0 17.76 16.14l55.31-60.84 37.69 59.21A12 12 0 0 0 160 228h48a12 12 0 0 0 10.12-18.44ZM166.59 204 69.86 52h19.55l96.73 152Z" />
                  </svg>
                </a>
                <a
                  href={selectedMember.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-600"
                >
                  <FaGithub size={24} />
                </a>
              </div>
              <Button
                className="mt-6"
                size="lg"
                variant="outline"
                onClick={closeModal}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamCarousel;
