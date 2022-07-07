import { FC } from 'react';

export const Triangle: FC = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
};
