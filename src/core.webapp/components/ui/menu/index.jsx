import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import cn from 'classnames';
import './menu.styl';

type MenuProps = {
  extraClassName?: string,
  disabled?: boolean,
  trigger?: React.Element<*>,
  options: Array <*>,
  arrow?: boolean,
};

export default ({
  extraClassName,
  disabled,
  trigger,
  options,
  arrow,
}) => {
  const className = cn(
    extraClassName,
    'briskhome-menu',
  );

  return (
    <Dropdown className={className}>
      <DropdownTrigger className='briskhome-menu__trigger'>
        {trigger} {arrow && <div className='briskhome-menu__arrow' />}
      </DropdownTrigger>
      <DropdownContent className='briskhome-menu__content'>
        <ul>
          {options.map(option => (
            <li>
              {option}
            </li>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  );
};
