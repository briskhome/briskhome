/** @flow */
import * as React from 'react';
import cn from 'classnames';
import "./title.styl";
type TitleProps = {
  children?: React.Node;
  className?: string;
  large?: boolean;
  medium?: boolean;
  small?: boolean;
  gray?: boolean;
};
export default (({
  className,
  children,
  large,
  medium,
  small,
  gray
}: TitleProps) => {
  const props = {
    className: cn('briskhome-title', {
      'briskhome-title_large': large,
      'briskhome-title_medium': medium,
      'briskhome-title_small': small
    }, {
      'briskhome-title_gray': gray
    }, className),
    children
  };
  if (large) return <h1 {...props} />;
  if (medium) return <h2 {...props} />;
  if (small) return <h3 {...props} />;
  return <span {...props} />;
});