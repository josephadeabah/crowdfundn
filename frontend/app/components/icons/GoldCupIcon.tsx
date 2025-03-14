import React from 'react';

interface GoldCupIconProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GoldCupIcon: React.FC<GoldCupIconProps> = ({
  width = '800px',
  height = '800px',
  className = '',
  style = {},
}) => {
  return (
    <svg
      height={height}
      width={width}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      className={className}
      style={style}
    >
      <path
        style={{ fill: '#F6E27D' }}
        d="M476.625,55.699C468.256,22.902,440.128,0,408.218,0h-0.016H367.39H144.61H103.8h-0.019
          C71.873,0,43.743,22.902,35.375,55.696c-4.267,16.718-5.249,43.19,14.291,74.356c14.927,23.81,39.207,45.76,72.203,65.386
          c4.091,62.186,50.634,112.966,110.857,123.567v74.248c0,12.853,10.418,23.273,23.273,23.273c12.851,0,23.273-10.42,23.273-23.273
          v-74.206c60.379-10.51,107.061-61.414,111.096-123.75c32.875-19.588,57.069-41.491,71.961-65.243
          C481.874,98.889,480.891,72.419,476.625,55.699z M80.476,67.204c3.461-13.565,14.342-20.658,23.313-20.658h0.003h17.579l0.13,92.643
          C85.513,111.523,75.943,84.975,80.476,67.204z M390.665,139.064V46.545h17.546h0.003c8.966,0,19.852,7.095,23.311,20.662
          C436.053,84.949,426.519,111.442,390.665,139.064z"
      />
      <path
        style={{ fill: '#F2D23D' }}
        d="M476.625,55.699C468.256,22.902,440.128,0,408.218,0h-0.016H367.39H256.001v369.98h23.273v-50.933
          c60.379-10.51,107.061-61.414,111.096-123.75c32.875-19.588,57.069-41.491,71.961-65.243
          C481.874,98.889,480.891,72.419,476.625,55.699z M390.665,139.064V46.545h17.546h0.003c8.966,0,19.852,7.095,23.311,20.662
          C436.053,84.949,426.519,111.442,390.665,139.064z"
      />
      <path
        style={{ fill: '#D8145D' }}
        d="M351.476,369.98H160.522c-12.854,0-23.273,10.42-23.273,23.273v95.474
          c0,12.854,10.418,23.273,23.273,23.273h190.954c12.851,0,23.273-10.418,23.273-23.273v-95.474
          C374.749,380.4,364.328,369.98,351.476,369.98z"
      />
      <path
        style={{ fill: '#A90140' }}
        d="M351.476,369.98h-95.476V512h95.476c12.851,0,23.273-10.418,23.273-23.273v-95.474
          C374.749,380.4,364.328,369.98,351.476,369.98z"
      />
    </svg>
  );
};

export default GoldCupIcon;
