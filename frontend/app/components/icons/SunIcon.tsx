import React from 'react';

type SunIconProps = {
  onClick: () => void;
  className: string;
  [key: string]: any;
};

export default function SunIcon({
  onClick,
  className,
  ...props
}: SunIconProps) {
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
      <path d="M12 4.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13c-3.02 0-5.5-2.48-5.5-5.5s2.48-5.5 5.5-5.5 5.5 2.48 5.5 5.5-2.48 5.5-5.5 5.5zm-1-12h2v2h-2zm-7.07 2.93l1.41-1.41 1.41 1.41-1.41 1.41zm11.07 0l1.41-1.41 1.41 1.41-1.41 1.41zm-7.07 9.07l1.41-1.41 1.41 1.41-1.41 1.41zm11.07-1.41l1.41 1.41-1.41 1.41-1.41-1.41zm-3.64-2.43l-1.41-1.41 1.41-1.41 1.41 1.41zm-7.07 0l-1.41-1.41 1.41-1.41 1.41 1.41z" />
    </svg>
  );
}
