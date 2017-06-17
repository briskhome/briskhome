// @flow
import React from 'react';
import { merge } from '../../../utils'

require('./primary.styl')
export const Primary = ({ children }: Object) => {
  return (
    <button className='briskhome-button_primary' type='submit'>{ children }</button>
  );
}
