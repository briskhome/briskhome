import * as React from 'react';
import cn from 'classnames';
import { MenuList, MenuItem, MenuButton, Dropdown } from 'react-menu-list';
import Title from '../../../ui/title';
import '../styles/widget.styl';

export const DashboardWidget = ({ id, title, menu, children }) => {
  const menuProps = {
    className: 'dashboard-widget__header-menu briskhome-menu',
    menuZIndex: 100,
    positionOptions: {
      position: 'cover',
      vAlign: 'top',
      hAlign: 'right',
    },
  };

  const className = 'briskhome-menu';
  return (
    <div
      className={cn('dashboard-widget', { [`dashboard-widget__${id}`]: id })}
    >
      <div className="dashboard-widget__header">
        <Title small className="dashboard-widget__header-title">
          {title}
        </Title>
        <div className="dashboard-widget__header-button">
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
                    className={cn(
                      `${className}__item`,
                      `${className}__item_red`,
                    )}
                  >
                    Hide widget
                  </MenuItem>
                </MenuList>
              </Dropdown>
            }
          >
            ■■■
          </MenuButton>
        </div>
      </div>
      <div className="dashboard-widget__content">{children}</div>
    </div>
  );
};

export default DashboardWidget;
