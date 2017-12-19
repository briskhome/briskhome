import * as React from 'react';
import Title from '../../ui/title';

export const OnboardingSheet = ({ title, children }) => (
  <div className="onboarding-sheet">
    <Title medium>{title}</Title>
    {children}
  </div>
);

export default OnboardingSheet;
