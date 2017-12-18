/** @flow */
import * as React from 'react';
import cn from 'classnames';
import Loader from '../loader';
import './button.styl';

type ButtonProps = {
  className?: string,
  display?: 'inline' | 'inline-block' | 'block',
  yellow?: string,
  loading?: boolean,
  disabled?: boolean,
  target?: string,
  link?: string,
  caps?: boolean,
  onClick?: Function,
  children?: React.ChildrenArray<string>,
};

export default ({
  className,
  display,
  yellow,
  loading,
  disabled,
  target,
  caps,
  link,
  type,
  onClick,
  children,
}: ButtonProps) => (
  <a
    className={cn(
      'briskhome-button',
      {
        'briskhome-button_yellow': yellow,
        'briskhome-button_loading': loading,
        'briskhome-button_disabled': disabled,
        'briskhome-button_caps': caps,
        [`briskhome-button_${display}`]: display,
      },
      className,
    )}
    role="button"
    type={type || 'button'}
    disabled={loading || disabled}
    href={link || '#'}
    target={target || '_self'}
    onClick={onClick}
  >
    {loading ? <Loader inline white /> : children}
  </a>
);
