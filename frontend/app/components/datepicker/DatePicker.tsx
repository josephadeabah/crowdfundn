import { useState } from 'react';

type DatePickerProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
};

const DatePicker = ({
  selectedDate,
  onDateChange,
  minYear = 2020,
  maxYear = 2030,
}: DatePickerProps) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    onDateChange(new Date(currentYear, currentMonth, day));
  };

  return (
    <div className="p-3 space-y-0.5">
      {/* Month & Year Controls */}
      <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
        {/* Prev Button */}
        <div className="col-span-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Previous"
          >
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Month / Year Display */}
        <div className="col-span-3 flex justify-center items-center gap-x-1">
          <select
            className="text-gray-800 dark:text-neutral-200"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <span className="text-gray-800 dark:text-neutral-200">/</span>
          <select
            className="text-gray-800 dark:text-neutral-200"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          >
            {Array.from(
              { length: maxYear - minYear + 1 },
              (_, i) => minYear + i,
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Next Button */}
        <div className="col-span-1 flex justify-end">
          <button
            type="button"
            onClick={handleNextMonth}
            className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Next"
          >
            <svg
              className="shrink-0 size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="flex pb-1.5">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <span
            key={day}
            className="m-px w-10 block text-center text-sm text-gray-500 dark:text-neutral-500"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days */}
      <div className="flex flex-wrap">
        {Array.from({
          length: firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6,
        }).map((_, index) => (
          <div key={index} className="m-px size-10" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => (
          <button
            key={day + 1}
            type="button"
            className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-red-600 hover:text-red-600 dark:text-neutral-200 ${
              selectedDate.getDate() === day + 1 &&
              selectedDate.getMonth() === currentMonth &&
              selectedDate.getFullYear() === currentYear
                ? 'bg-red-600 text-white'
                : ''
            }`}
            onClick={() => handleDateSelect(day + 1)}
          >
            {day + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
