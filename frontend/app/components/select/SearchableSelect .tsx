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
  className?: string; // Additional class for further customization
  variant?: 'default' | 'black' | 'outline' | 'ghost' | 'destructive'; // Variant for different styles
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  className = '',
  variant = 'default',
}) => {
  // Define base styles for the select box
  const baseStyles =
    'w-full px-4 py-2 rounded-full text-gray-800 border-1 focus:outline-none focus:ring-2 transition duration-300 ease-in-out appearance-none';

  // Define variant styles
  const variantStyles = {
    default:
      'bg-white border-1 border-gray-100 hover:bg-gray-50 focus-visible:outline-none focus:ring-0 hover:outline-none',
    black: 'bg-white  border-black hover:bg-gray-50 focus:ring-black',
    outline:
      'bg-transparent border-gray-800 hover:bg-gray-50 focus:ring-gray-800',
    ghost:
      'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-800',
    destructive:
      'bg-red-100 border-red-600 text-red-600 hover:bg-red-200 focus:ring-red-600',
  };

  // Combine base styles, variant styles, and any custom className passed
  const selectClassNames = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className="w-full max-w-sm mx-auto">
      {label && (
        <label className="block mb-2 text-sm text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClassNames}
          style={{
            // Apply custom styles for the select dropdown
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{
                // Custom styles for the option hover state
                backgroundColor: 'white', // Default background
                color: 'black', // Default text color
              }}
              className="hover:bg-gray-50" // Tailwind hover class (won't work for <option>)
            >
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
      {/* Add custom CSS for the hover state of <option> elements */}
      <style>
        {`
          select option:hover {
            background-color: #f9fafb !important; /* bg-gray-50 */
          }
        `}
      </style>
    </div>
  );
};

export default SelectComponent;
