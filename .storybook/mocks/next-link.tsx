import React, { AnchorHTMLAttributes, PropsWithChildren } from 'react';

type LinkProps = PropsWithChildren<
  {
    href: string;
  } & AnchorHTMLAttributes<HTMLAnchorElement>
>;

const Link = ({ href, children, className, onClick, ...props }: LinkProps) => {
  return (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

export default Link;


