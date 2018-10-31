/** @flow */
import * as React from 'react';
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from 'react-simple-dropdown';
import cn from 'classnames';
import './menu.styl';

type MenuProps = {
  className?: string,
  trigger?: React.Node,
  options: Array<*>,
  arrow?: boolean,
};

export default ({ className, trigger, options, arrow }: MenuProps) => {
  return (
    <Dropdown className={cn(className, 'briskhome-menu')}>
      <DropdownTrigger className="briskhome-menu__trigger">
        {trigger} {arrow && <div className="briskhome-menu__arrow" />}
      </DropdownTrigger>
      <DropdownContent className="briskhome-menu__content">
        <ul>
          {options.map(option => (
            <li>{option}</li>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  );
};
