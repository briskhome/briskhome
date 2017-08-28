/* @flow */
import React from 'react';

import Onboarding from './';
import { HouseIcon } from './house';
import '../pages/dashboard/dashboard.styl';

export const Example = ({ children }: any): React.Element<*> => {
  const sheets = [
    [],
  ];
  return (
    <div className='dashboard'>
      <h1 className='briskhome__title'>Onboarding Example</h1>
      <Onboarding />
      {children}
    </div>
  );
};
