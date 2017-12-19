/** @flow */
import * as React from 'react';
import Toggle from 'react-toggle';
import './toggle.styl';

type ToggleProps = {
  checked: boolean,
  disabled?: boolean,
  className?: string,
};

export default ({ checked, disabled, className }: ToggleProps) => (
  <Toggle
    checked={checked}
    disabled={disabled}
    icons={false}
    className={className}
  />
);
