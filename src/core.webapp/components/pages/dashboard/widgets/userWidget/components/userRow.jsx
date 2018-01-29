import * as React from 'react';
import cn from 'classnames';
import Avatar from '../../../../../avatar';
import { MenuList, MenuItem, MenuButton, Dropdown } from 'react-menu-list';

export const UserRow = ({
  name,
  type,
  username,
  user: currentUser,
  onRevoke = () => null,
}) => {
  const menuProps = {
    className:
      'dashboard-widget__header-menu briskhome-menu dashboard-widget__header-button_dots',
    menuZIndex: 100,
    positionOptions: {
      position: 'cover',
      vAlign: 'top',
      hAlign: 'right',
    },
  };
  const className = 'briskhome-menu';
  const menu = [];
  const operations = [{ title: 'View' }, { title: 'Edit' }];
  console.log({ type });
  if (type === 'VISITOR') {
    menu.push(...operations, { title: 'Suspend' });
  }

  if (type === 'MEMBER') {
    menu.push({ title: 'View' });
  }

  if (type === 'superuser') {
    menu.push(...operations, { title: 'Suspend' });
  }
  return (
    <tr className="user-widget__row">
      <td className="user-widget__cell">
        <Avatar name={name} online />
      </td>
      <td className="user-widget__cell">
        <span className="user-widget__cell-title">{name}</span>
        <span className="user-widget__cell-subtitle">{username}</span>
      </td>
      <td className="user-widget__cell">
        <MenuButton
          {...menuProps}
          menu={
            <Dropdown>
              <MenuList className={`${className}__list`}>
                {menu.map(item => (
                  <MenuItem className={`${className}__item`} {...item}>
                    {item.title}
                  </MenuItem>
                ))}
                <hr className={`${className}__separator`} />
                <MenuItem
                  className={cn(`${className}__item`, `${className}__item_red`)}
                >
                  Hide widget
                </MenuItem>
              </MenuList>
            </Dropdown>
          }
        >
          ■■■
        </MenuButton>
      </td>
    </tr>
  );
};

export default UserRow;
