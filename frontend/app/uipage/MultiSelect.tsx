import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

const MultiSelectSkills = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setError('Skill already selected');
      setTimeout(() => setError(''), 3000);
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      setError('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleClearAll = () => {
    setSelectedSkills([]);
  };

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative"
        ref={dropdownRef}
        aria-labelledby="skills-label"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        role="combobox"
      >
        <label
          id="skills-label"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Skills
        </label>
        <div
          className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 flex items-center justify-between cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="flex flex-wrap gap-2">
            {selectedSkills.length > 0 ? (
              selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center"
                >
                  {skill}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill(skill);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">Select skills...</span>
            )}
          </div>
          <FiChevronDown
            className={`transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search skills"
                />
              </div>
            </div>
            <ul
              className="max-h-60 overflow-auto py-1"
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredSkills.map((skill) => (
                <li
                  key={skill}
                  className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
                    selectedSkills.includes(skill) ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleSkillSelect(skill)}
                  role="option"
                  aria-selected={selectedSkills.includes(skill)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => {}}
                      aria-label={`Select ${skill}`}
                    />
                    <span className="ml-2">{skill}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {selectedSkills.length > 0 && (
        <button
          onClick={handleClearAll}
          className="mt-2 text-sm text-red-600 hover:text-red-800 focus:outline-none"
          aria-label="Clear all selected skills"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default MultiSelectSkills;

const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'PHP',
  'Swift',
  'Go',
  'Rust',
  'TypeScript',
  'SQL',
  'MongoDB',
  'GraphQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
];

export const MultiSelect = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedSkills.length === 0) {
      setError('At least one skill must be selected');
    } else {
      setError('');
    }
  }, [selectedSkills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill],
    );
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    skill: string,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSkill(skill);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="skills-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Select Skills
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md cursor-text"
          onClick={() => setIsOpen(true)}
        >
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkill(skill);
                }}
                className="ml-1 inline-flex items-center p-0.5 text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            id="skills-select"
            type="text"
            className="flex-grow outline-none text-sm"
            placeholder="Type to search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            aria-label="Search and select skills"
            aria-expanded={isOpen}
            aria-controls="skills-listbox"
          />
        </div>
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle skills dropdown"
        >
          <FaChevronDown
            className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
        {isOpen && (
          <ul
            id="skills-listbox"
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            role="listbox"
          >
            {filteredSkills.map((skill) => (
              <li
                key={skill}
                className={`${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-900'
                } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 transition duration-150 ease-in-out`}
                onClick={() => toggleSkill(skill)}
                onKeyDown={(e) => handleKeyDown(e, skill)}
                role="option"
                aria-selected={selectedSkills.includes(skill)}
                tabIndex={0}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 block truncate">{skill}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-pulse" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
