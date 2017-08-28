import React from 'react';
import Dropdown from 'react-dropdown';
import cn from 'classnames';
import './dropdown.styl';

type DropdownOption = {
  value: string,
  label: string,
};

type DropdownGroup = {
  type: string,
  name: string,
  items: Array<DropdownOption>,
};

type DropdownProps = {
  extraClassName?: string,
  placeholder?: string,
  disabled?: boolean,
  onChange?: Function,
  options?: Array<DropdownOption | DropdownGroup>,
  caption?: string,
  value?: string,
};

export default ({
  extraClassName,
  placeholder,
  disabled,
  onChange,
  options,
  caption,
  value,
}: DropdownProps) => {
  const className = cn(
    extraClassName,
    'briskhome-dropdown',
  );
  const captionClassNames = cn(
    'anim_show_block',
    'briskhome-label',
    'briskhome-label_gray',
    'briskhome-label_small',
    'briskhome-label__caption',
    {
      [`${extraClassName}_caption`]: extraClassName,
    },
  );
  return (
    <div className={className}>
      <Dropdown
        baseClassName='briskhome-dropdown'
        placeholder={placeholder}
        disabled={disabled}
        options={options}
        value={value}
        onChange={onChange}
      />
      {caption && <span className={captionClassNames}>{caption}</span>}
    </div>
  );
};
