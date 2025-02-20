import React from 'react';

interface BronzeCupIconProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BronzeCupIcon: React.FC<BronzeCupIconProps> = ({
  width = '800px',
  height = '800px',
  className = 'text-blue-400',
  style = {},
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="-0.5 0 49 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 7.5C12 6.94772 12.4477 6.5 13 6.5H35C35.5523 6.5 36 6.94772 36 7.5V8.5H41C41.5523 8.5 42 8.94772 42 9.5V15.5C42 18.2614 39.7614 20.5 37 20.5H35.3172C33.8847 24.5529 30.3367 27.6065 26 28.3341V34.5H32C32.5523 34.5 33 34.9477 33 35.5V41.5C33 42.0523 32.5523 42.5 32 42.5H16C15.4477 42.5 15 42.0523 15 41.5V35.5C15 34.9477 15.4477 34.5 16 34.5H22V28.3341C17.6633 27.6065 14.1153 24.5529 12.6828 20.5H11C8.23858 20.5 6 18.2614 6 15.5V9.5C6 8.94772 6.44772 8.5 7 8.5H12V7.5ZM36 16.5V10.5H40V15.5C40 17.1569 38.6569 18.5 37 18.5H36V16.5ZM12 10.5H8V15.5C8 17.1569 9.34315 18.5 11 18.5H12V16.5V10.5Z"
        fill="#333333"
      />
    </svg>
  );
};

export default BronzeCupIcon;
