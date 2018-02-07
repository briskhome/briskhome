import * as React from 'react';
import cn from 'classnames';
import Avatar from '../../../../../avatar';
import { MenuList, MenuItem, MenuButton, Dropdown } from 'react-menu-list';

export const UserRow = ({
  name,
  type,
  username,
  isActive,
  isOnline = false,
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
  const operations = [{ title: 'View details' }, { title: 'Edit account' }];

  return (
    <tr
      className={cn('user-widget__row', {
        'user-widget__row_inactive': !isActive,
      })}
    >
      <td className="user-widget__cell">
        <Avatar name={name} online={isActive && isOnline} />
      </td>
      <td className="user-widget__cell">
        <span className="user-widget__cell-title">{name}</span>
        <span className="user-widget__cell-subtitle">
          {username}
          {!isActive && ' — inactive'}
        </span>
      </td>
      <td className="user-widget__cell">
        <MenuButton
          {...menuProps}
          menu={
            <Dropdown>
              <MenuList className={`${className}__list`}>
                {operations.map(item => (
                  <MenuItem className={`${className}__item`} {...item}>
                    {item.title}
                  </MenuItem>
                ))}
                <hr className={`${className}__separator`} />
                <MenuItem
                  className={cn(`${className}__item`, `${className}__item_red`)}
                >
                  Deactivate
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
