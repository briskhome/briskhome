/* @flow */
import React from 'react';
import Avatar from '../avatar';
import Card from './';
import './widget-table.styl';

export const UserCard = ({ data: { error, loading, users } }): React.Element<*> => {
  return (
    <Card
      error={error}
      loading={loading}
      title='Users & Guests'
      caption='1 user and 3 guests online'
    >
      <table className='widget-table'>
        <tbody>
          {users && users.map(user => (
            <tr className='widget-table__row'>
              <td className='widget-table__cell widget-table__cell_first'>
                <Avatar name={user.name.split(' ').map(el => el[0]).join('')} />
                {/* <img className='profile-image' src='/static/assets/img/avatar.jpg' /> */}
              </td>
              <td className='widget-table__cell widget-table__cell_middle'>
                <div className='widget-table__cell-title'>{user.name}</div>
                <div className='widget-table__cell-subtitle'>{user.id}</div>
              </td>
              <td className='widget-table__cell widget-table__cell_last'>
                <div className='widget-table__cell-action' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
export default UserCard;
