import React from 'react';

interface SilverCupIconProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SilverCupIcon: React.FC<SilverCupIconProps> = ({
  width = '800px',
  height = '800px',
  className = '',
  style = {},
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <style type="text/css">
        {`
          .st0{fill:#E6E6E6;}
          .st1{fill:#69C9C9;}
          .st2{fill:#4D5152;}
        `}
      </style>
      <rect className="st0" height="28.7" width="58.9" x="226.6" y="355.9" />
      <polygon
        className="st0"
        points="246,492 266,492 266,482 351,482 351,453.3 161,453.3 161,482 246,482 "
      />
      <polygon
        className="st0"
        points="414.7,146.7 424.7,146.7 424.7,78.3 463.2,78.3 463.2,206.7 414.7,206.7 "
      />
      <polygon
        className="st0"
        points="97.3,146.7 87.3,146.7 87.3,78.3 48.8,78.3 48.8,206.7 97.3,206.7 "
      />
      <polygon
        className="st1"
        points="284.3,185.6 301.9,239.5 256,206.2 210.1,239.5 227.7,185.6 181.8,152.3 238.5,152.3 256,98.4   273.5,152.3 330.2,152.3 "
      />
      <g>
        <path
          className="st2"
          d="M391.7,132.3H288l-32-98.6l-32,98.6H120.3l83.9,61l-32,98.6l83.9-61l83.9,61l-32-98.6L391.7,132.3z M256,206.2   l-45.9,33.3l17.5-53.9l-45.9-33.3h56.7L256,98.4l17.5,53.9h56.7l-45.9,33.3l17.5,53.9L256,206.2z"
        />
        <rect className="st2" height="20" width="20" x="87.3" y="166.7" />
        <rect className="st2" height="20" width="20" x="404.7" y="166.7" />
        <path
          className="st2"
          d="M424.7,58.3V10H87.3v48.3H28.8v168.4h58.5v41.7l66.5,87.5h52.8v28.7h-21.8v48.7H141V502h105v-20h-85v-28.7H351   V482h-85v20h105v-68.7h-43.7v-48.7h-21.8v-28.7h52.8l66.5-87.5v-41.7h58.5V58.3H424.7z M307.2,433.3H204.8v-28.7h102.5V433.3z    M285.4,384.6h-58.9v-28.7h58.9V384.6z M463.2,206.7h-58.5v54.9l-56.4,74.2H163.7l-56.4-74.2v-54.9H48.8V78.3h38.5v68.4h20V30   h297.3v116.7h20V78.3h38.5V206.7z"
        />
      </g>
    </svg>
  );
};

export default SilverCupIcon;
