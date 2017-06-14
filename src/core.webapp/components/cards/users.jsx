// @flow
import React from 'react';

// require('style-loader!css-loader!stylus-loader!./users.styl');
require('./users.styl');
export const Card = () => {
  return (
    <div className='briskhome-card'>
      <div className='briskhome-card__header'>
        <h1 className='briskhome-card__heading'>Sample heading</h1>
        <div className='briskhome-card__action'>
          <ul class="squares">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
      <div className='briskhome-card__body'>

      </div>
      <div className='briskhome-card__footer'>

      </div>
    </div>
  );
};
