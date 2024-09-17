import React from 'react';

type MoonIconProps = {
  onClick: () => void;
  className: string;
  [key: string]: any;
};

export default function MoonIcon({
  onClick,
  className,
  ...props
}: MoonIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="24"
      height="24"
      onClick={onClick}
      className={className}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-2.16 0.84-4.16 2.2-5.6a6.972 6.972 0 0 0 0 11.2C9.16 17.16 11.16 18 12 18zm0-4c-1.67 0-3.13-0.67-4.24-1.76a6.971 6.971 0 0 0 0-11.2A7.92 7.92 0 0 0 12 6c4.41 0 8 3.59 8 8s-3.59 8-8 8z" />
    </svg>
  );
}
