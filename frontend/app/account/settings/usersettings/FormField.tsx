import React from 'react';
import { motion } from 'framer-motion';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  isTextArea?: boolean;
}

const FormField: React.FC<FormFieldProps> = React.memo(
  ({
    label,
    id,
    value,
    onChange,
    type = 'text',
    error,
    disabled = false,
    isTextArea = false,
  }) => (
    <motion.div
      className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        {isTextArea ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            rows={4}
            aria-label={label}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className={`max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${error ? 'border-red-500' : ''}`}
            aria-label={label}
            disabled={disabled}
          />
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    </motion.div>
  ),
);

export default FormField;
