import React from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectComponentProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      {label && (
        <label className="block mb-2 text-sm text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-white border-2 border-black rounded-full text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-50 transition duration-300 ease-in-out appearance-none"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-600">
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectComponent;
