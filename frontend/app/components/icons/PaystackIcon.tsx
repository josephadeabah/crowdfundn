import React from 'react';

interface PaystackIconProps {
  className?: string;
}

const PaystackIcon: React.FC<PaystackIconProps> = ({ className }) => {
  return (
    <svg
      className={className} // Apply the className prop here
      width="24" // Set width to 24
      height="23" // Set height to 23
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 612 602" // Maintain the original viewBox for scaling
    >
      <g clipPath="url(#clip0)" fill="#000">
        <path d="M548.416 0H31.792C14.306 0 0 14.333 0 31.852v57.333c0 17.519 14.306 31.852 31.792 31.852h515.034c17.486 0 31.792-14.333 31.792-31.852V31.852C580.208 14.333 565.901 0 548.416 0zM548.416 320.111H31.792C14.306 320.111 0 334.444 0 351.963v57.333c0 17.519 14.306 31.852 31.792 31.852h515.034c17.486 0 31.792-14.333 31.792-31.852v-57.333c1.59-17.519-12.717-31.852-30.202-31.852zM322.691 480.963H31.792C14.306 480.963 0 495.296 0 512.815v57.333C0 587.667 14.306 602 31.792 602h290.899c17.486 0 31.792-14.333 31.792-31.852v-57.333c0-17.519-14.306-31.852-31.792-31.852zM580.208 160.852H31.792C14.306 160.852 0 175.185 0 192.703v57.334c0 17.518 14.306 31.852 31.792 31.852h548.416c17.486 0 31.792-14.334 31.792-31.852v-57.334c0-17.518-14.306-31.851-31.792-31.851z" />
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h612v602H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PaystackIcon;