/* @flow */
import React from 'react';

import Onboarding from './';
import '../pages/dashboard/dashboard.styl';

export const Example = ({ children }: any): React.Element<*> => (
  <div className="dashboard">
    <h1 className="briskhome__title">Onboarding Example</h1>
    <Onboarding />
    {children}
  </div>
);

export default Example;
