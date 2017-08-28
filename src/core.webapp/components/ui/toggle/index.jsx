import React from 'react';
import Toggle from 'react-toggle';
import './toggle.styl';

export default ({ checked, disabled, extraClassName }) =>
  <Toggle
    checked={checked}
    disabled={disabled}
    icons={false}
    className={extraClassName}
  />;
