import React from 'react';

// Mock Next.js Link component for Storybook
const Link = ({ href, children, className, onClick, ...props }) => {
  return (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

export default Link;