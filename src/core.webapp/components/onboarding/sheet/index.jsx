import React from 'react';
import Title from '../../ui/title';

export const OnboardingSheet = ({
  title,
  children,
}) => {
  return (
    <div className='onboarding-sheet'>
      <Title medium>{title}</Title>
      {children}
    </div>
  );
};

export default OnboardingSheet;
