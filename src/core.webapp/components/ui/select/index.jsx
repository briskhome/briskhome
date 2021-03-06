/** @flow */
import * as React from 'react';
import cn from 'classnames';
import './select.styl';

type SelectOption = {
  value: string,
  label: string,
};

type SelectProps = {
  className?: string,
  placeholder?: string,
  disabled?: boolean,
  onChange?: Function,
  options?: Array<SelectOption>,
  caption?: string,
  value?: string,
  name?: string,
};

export const Select = ({
  className = '',
  placeholder,
  disabled,
  options = [],
  value,
  name,
  onChange = () => null,
}: SelectProps) => {
  return (
    <select
      name={name}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={cn(className, 'briskhome-select', {
        'briskhome-select_disabled': disabled,
      })}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
