/** @flow */
import * as React from 'react';
import cn from 'classnames';
import Button from '../../ui/button';
import type { WizardControlsProps } from '../types';

export const WizardControls = ({
  className,
  prev,
  prevLabel = 'Go Back',
  prevClassName,
  next,
  nextLabel = 'Next',
  nextClassName,
}: WizardControlsProps): React.Node => {
  if (!prev && !next) return null;
  return (
    <div
      className={cn(
        'briskhome-wizard__footer-controls',
        {
          'briskhome-wizard__footer-controls_left': prev && !next,
          'briskhome-wizard__footer-controls_right': !prev && next,
          'briskhome-wizard__footer-controls_justify': prev && next,
        },
        className,
      )}
    >
      {prev && (
        <Button
          link=""
          display="inline-block"
          className={cn(
            'briskhome-wizard__button-prev',
            { 'briskhome-wizard__button_hidden': !prev },
            prevClassName,
          )}
          onClick={prev}
        >
          {prevLabel}
        </Button>
      )}
      {next && (
        <Button
          caps
          link=""
          large
          yellow
          loading={false}
          display="inline-block"
          className={cn(
            'briskhome-wizard__button-next',
            { 'briskhome-wizard__button_hidden': !next },
            nextClassName,
          )}
          onClick={next}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
};

export default WizardControls;
