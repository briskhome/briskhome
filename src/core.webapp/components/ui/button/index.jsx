import React from 'react';
import cn from 'classnames';
import './button.styl';

type ButtonProps = {
  extraClassName?: string,
  yellow?: string,
  loading?: boolean,
  disabled?: boolean,
  target?: string,
  link?: string,
  onClick?: Function,
  children?: React.Children,
};

export default ({
  extraClassName,
  yellow,
  loading,
  disabled,
  target,
  link,
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
      },
      extraClassName,
    )}
    role="button"
    type="button"
    disabled={loading || disabled}
    href={link || '#'}
    target={target || '_self'}
    onClick={onClick}
  >
    {children}
  </a>
);
