import React from 'react';
import Title from '../ui/title';
import OnboardingSheet from './sheet';
import Dropdown from '../ui/dropdown';
import Button from '../ui/button';
import Input from '../ui/input';
import {HouseIcon} from './house';
import './onboarding.styl';

type OnboardingProps = {
  index?: number,
  sheets: Array<[?OnboardingSheet, OnboardingSheet]>,
}

export const Onboarding = ({ sheets = [[null, null]], index = 0 }: OnboardingProps) => {
  // caption='Guest accounts expire automatically in 24 hours.'
  return (
    <div className='onboarding'>
      <div className='onboarding__content'>
        <div className='onboarding__content_left'>
          <HouseIcon />
          <Title large extraClassName='briskhome-title_thin'>Welcome</Title>
          <p className='onboarding-paragraph'>
            To begin using Briskhome you need to create a superuser account.
            Fill in the form to the right to begin.
          </p>
          {sheets[index][0]}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
