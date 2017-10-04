import React from 'react';
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from 'react-simple-dropdown';
import cn from 'classnames';
import './menu.styl';

type MenuProps = {
  extraClassName?: string,
  trigger?: React.Element<*>,
  options: Array<*>,
  arrow?: boolean,
  // disabled?: boolean,
};

export default ({
  extraClassName,
  trigger,
  options,
  arrow,
}: // disabled,
MenuProps) => {
  const className = cn(extraClassName, 'briskhome-menu');

  return (
    <Dropdown className={className}>
      <DropdownTrigger className="briskhome-menu__trigger">
        {trigger} {arrow && <div className="briskhome-menu__arrow" />}
      </DropdownTrigger>
      <DropdownContent className="briskhome-menu__content">
        <ul>{options.map(option => <li>{option}</li>)}</ul>
      </DropdownContent>
    </Dropdown>
  );
};
