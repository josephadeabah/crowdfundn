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
import AboutBantuHivePage from '../molecules/AboutBantuHivePage ';

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
      position: 'Co-Founder & CEO',
      description: 'South African Region',
      image: '/Nqoba.JPG',
      fullDescription:
        'Nqoba Manana is a visionary leader with over 10 years of experience in the baking industry. As CEO, Nqoba leads the company’s executive leadership',
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
      position: 'Co-Founder & CTO',
      description: 'West African Region',
      image: '/abeansah.png',
      fullDescription:
        'Joseph Adeabah is an innovative technologist with over 6 years of experience in the tech industry. As CTO, he leads the company’s technology strategy and product development.',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/joseph-835977a5/',
        twitter: 'https://x.com/abe_ansah',
        github: 'https://github.com/josephadeabah',
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
    <div className="relative w-full max-w-7xl h-full mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        Welcome to BantuHive
      </h1>
      <section className="mb-16 bg-white p-12">
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Bantuhive is an innovative crowdfunding platform aimed at empowering
          individuals, organizations, and communities across Africa and its
          global diaspora. Our mission is to harness the collective strength of
          people ("Bantu") and create impactful, lasting change across Africa.
          By bridging the gap between ideas and the financial support they need
          to flourish, Bantu Hive is enabling individuals and organizations to
          fund their dreams.
        </p>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Our focus is on addressing the unique challenges faced by Africans. We
          aim to drive meaningful change by fostering a culture of giving,
          collaboration, and support within our communities. Whether you're
          funding a business idea, supporting a charitable cause, or making
          someone's education possible, Bantuhive is here to amplify your
          efforts.
        </p>

        {/* Our Mission Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Empowering communities to fund dreams, transform lives, and drive
          Africa’s growth.
        </p>

        {/* Our Vision Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          To be Africa’s leading crowdfunding platform, driving a thriving
          continent through innovation, collaboration, and shared prosperity.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What is Crowdfunding?
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Crowdfunding is an online method of obtaining funds for your
          initiatives through small contributions from a large crowd of people.
          It is an alternative financing for projects, ideas or causes by
          reaching out to a huge number of people via an online platform. Rather
          than depending on traditional funding sources such as loans or
          personal savings, crowdfunding allows individuals to exhibit their
          projects and causes, and gain support from a community of backers.
          <p className="text-lg leading-8 text-gray-700 mb-6 mt-6">
            Bantu Hive operates a reward-based and gamified crowdfunding model.
            It currently operates in Ghana, with plans for future expansion
            across Africa.
          </p>
          <p>
            The term <strong>"gamified"</strong> refers to the process of adding
            game-like elements or mechanics to activities like donating or
            supporting a campaign. These elements are designed to make the
            experience more engaging, fun, and motivating by incorporating
            features commonly found in games, such as:
          </p>
          <ul>
            <li>
              <strong>Points or Scores</strong>: Earning points for donating to
              campaigns or completing support tasks.
            </li>
            <li>
              <strong>Badges or Achievements</strong>: Receiving rewards for
              reaching donation milestones or supporting multiple campaigns.
            </li>
            <li>
              <strong>Leaderboards</strong>: Competing with others by ranking on
              a leaderboard for top supporters or most active contributors.
            </li>
            <li>
              <strong>Challenges or Quests</strong>: Completing specific tasks,
              like sharing a campaign or donating a certain amount, to unlock
              rewards.
            </li>
            <li>
              <strong>Progress Tracking</strong>: Visualizing your impact
              through progress bars, showing how close a campaign is to its goal
              or how much you've contributed.
            </li>
          </ul>
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          The idea for Bantuhive was born out of personal experience. One of our
          cofounders, on the verge of fulfilling a lifelong dream to study
          abroad, found himself needing to raise 30% of his tuition despite
          already securing a 70% scholarship. His attempts to fundraise on
          foreign platforms, like GoFundMe, fell short due to the lack of
          familiarity and participation from the African community.
        </p>
        <p className="text-lg leading-8 text-gray-700">
          This challenge inspired a question:{' '}
          <em>
            Why isn’t there a crowdfunding platform tailored to Africa’s unique
            needs?
          </em>{' '}
          A platform where Africans can support each other and invest in their
          collective growth. With this vision, Bantuhive was created. The
          cofounders met through YCombinator and united their skills to build a
          platform dedicated to empowering African dreams, businesses, and
          causes.
        </p>
      </section>
      <AboutBantuHivePage />
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
                <div className="w-full h-48 overflow-hidden">
                  {' '}
                  {/* Container for the image */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain" // Ensure the full image fits without cropping
                  />
                </div>
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
        {/* Updated button styles */}
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
          onClick={prevSlide}
          aria-label="Previous team member"
          style={{ width: '40px', height: '40px' }} // Ensures the button size
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
          onClick={nextSlide}
          aria-label="Next team member"
          style={{ width: '40px', height: '40px' }} // Ensures the button size
        >
          <FaArrowRight className="text-gray-600" />
        </button>
      </div>

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
