// @flow
import React from 'react';

require('./button.styl')
export const Button = ({ label }: Object): React.Element<*> => {
  return (
    <a className='briskhome-button' href='#'><div>{label}</div></a>
  )
};
