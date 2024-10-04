import React, { useState, useEffect, useRef } from 'react';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaTimes,
  FaExpand,
  FaCompress,
  FaComments,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for the API response
interface ApiResponse {
  message: string;
  options: string[];
}

// Define a mapping for the API data
interface ApiData {
  [key: string]: ApiResponse;
}

// Mock API response data with stricter types
const apiData: ApiData = {
  welcome: {
    message:
      'Welcome to Bantuhive! How can I assist you with our crowdfunding platform today?',
    options: [
      'Tell me about fundraising',
      'How do donations work?',
      'What are the rewards?',
      'Explain transfers',
      'Pricing information',
      'FAQ',
    ],
  },
  fundraising: {
    message:
      'Bantuhive provides a platform for individuals and organizations to raise funds for various causes. You can create a campaign, share your story, and receive support from donors worldwide. What specific aspect of fundraising would you like to know more about?',
    options: [
      'How to start a campaign',
      'Campaign promotion tips',
      'Fundraising best practices',
    ],
  },
  donations: {
    message:
      'Donations on Bantuhive are easy and secure. Donors can contribute to campaigns using various payment methods. We ensure that the funds reach the campaign creators efficiently. Would you like to know about donation processes or donor benefits?',
    options: ['Donation process', 'Donor benefits', 'Tax deductions'],
  },
  rewards: {
    message:
      'Bantuhive allows campaign creators to offer rewards to donors as a token of appreciation. These can range from thank-you notes to exclusive merchandise. What would you like to know about our reward system?',
    options: ['Types of rewards', 'Setting up rewards', 'Reward fulfillment'],
  },
  transfers: {
    message:
      "Fund transfers on Bantuhive are handled securely. Once a campaign reaches its goal or a specified time, funds are transferred to the creator's account after deducting our service fee. Do you need more information about the transfer process?",
    options: [
      'Transfer timeline',
      'Required documentation',
      'International transfers',
    ],
  },
  pricing: {
    message:
      'Bantuhive charges a small percentage fee on the funds raised. This fee helps us maintain and improve our platform. The exact percentage may vary based on the type of campaign. Would you like to know more about our pricing structure?',
    options: [
      'Fee percentages',
      'Additional costs',
      'Compare with other platforms',
    ],
  },
  faq: {
    message:
      'Our FAQ section covers a wide range of topics. What specific area would you like to explore?',
    options: [
      'Account-related FAQs',
      'Campaign-related FAQs',
      'Donation-related FAQs',
    ],
  },
  default: {
    message:
      "I'm sorry, I didn't quite understand that. Could you please choose one of the following options?",
    options: [
      'Tell me about fundraising',
      'How do donations work?',
      'What are the rewards?',
      'Explain transfers',
      'Pricing information',
      'FAQ',
    ],
  },
};

// Mock API call function
const fetchApiResponse = async (userMessage: string): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerCaseMessage = userMessage.toLowerCase();
      let response = apiData.default;

      if (lowerCaseMessage.includes('fundraising')) {
        response = apiData.fundraising;
      } else if (lowerCaseMessage.includes('donations')) {
        response = apiData.donations;
      } else if (lowerCaseMessage.includes('rewards')) {
        response = apiData.rewards;
      } else if (lowerCaseMessage.includes('transfers')) {
        response = apiData.transfers;
      } else if (lowerCaseMessage.includes('pricing')) {
        response = apiData.pricing;
      } else if (lowerCaseMessage.includes('faq')) {
        response = apiData.faq;
      }

      resolve(response);
    }, 1000); // Simulating API delay
  });
};

const ChatbotComponent: React.FC = () => {
  interface Message {
    type: 'user' | 'bot';
    text: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isExpanded) {
      handleBotResponse('welcome');
    }
  }, [isExpanded]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const addUserMessage = (text: string) => {
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text }]);
  };

  const addBotMessage = (text: string, responseOptions: string[] = []) => {
    setMessages((prevMessages) => [...prevMessages, { type: 'bot', text }]);
    setOptions(responseOptions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      addUserMessage(inputMessage);
      setInputMessage('');
      handleBotResponse(inputMessage);
    }
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    handleBotResponse(option);
  };

  const handleBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const response = await fetchApiResponse(userMessage);
      setIsTyping(false);
      addBotMessage(response.message, response.options);
    } catch (error) {
      console.error('Error fetching API response:', error);
      setIsTyping(false);
      addBotMessage(
        "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
      );
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${
        isExpanded
          ? 'w-96 h-[500px] rounded-lg shadow-lg'
          : 'w-8 h-8 rounded-full'
      } bg-white transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {isExpanded ? (
        <>
          <div className="flex items-center justify-between bg-gradient-to-r from-red-800 to-black text-white p-4">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h6 className="font-semibold">Bantuhive Assistant</h6>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleExpand}
                className="mr-2 focus:outline-none"
                aria-label="Minimize chat window"
              >
                <FaCompress />
              </button>
              <button
                onClick={() => setMessages([])}
                className="focus:outline-none"
                aria-label="Close chat window"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <div
            ref={chatWindowRef}
            className="h-[calc(100%-120px)] overflow-y-auto p-4"
            role="log"
            aria-live="polite"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white'
                        : 'bg-gray-800 text-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.type === 'user' ? (
                        <FaUser className="mr-2" />
                      ) : (
                        <FaRobot className="mr-2" />
                      )}
                      <span className="font-semibold">
                        {message.type === 'user'
                          ? 'You'
                          : 'Bantuhive Assistant'}
                      </span>
                    </div>
                    <p>{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FaRobot className="mr-2" />
                    <span className="font-semibold">Bantuhive Assistant</span>
                  </div>
                  <div className="mt-2 flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {options.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col space-y-2 mt-4"
              >
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="flex items-center gap-2 px-4">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-grow p-2 rounded-lg border text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                aria-label="Type your message"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white p-2 rounded-lg hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </>
      ) : (
        <button
          onClick={toggleExpand}
          className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-red-800 to-black text-white rounded-full p-1 hover:from-red-900 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Open chat window"
        >
          <FaComments className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default ChatbotComponent;
