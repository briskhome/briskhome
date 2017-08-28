import React from 'react';
import Modal from 'react-modal';

import Title from '../ui/title';
import Dropdown from '../ui/dropdown';
import Input from '../ui/input';
import Button from '../ui/button';

import './onboarding.styl';

export default (): React.Element<*> => {
  return (
    <div>
      <Title
        medium
        extraClassName='briskhome-title_thin onboarding-title_medium'
      >
        Create an account
      </Title>
      <form className='briskhome-form'>
        <Dropdown
          disabled
          extraClassName='onboarding-dropdown'
          value='Superuser account'
          options={[
            { value: '2', label: 'Superuser account' },
            { value: '1', label: 'Regular account' },
            { value: '0', label: 'Guest account' },
          ]}
          caption='Superuser account with administrative priviliges.'
        />
        <Input type='text' placeholder='First name' />
        <Input type='text' placeholder='Last name' />
        <Button yellow>Create account</Button>
      </form>
    </div>
  );
};
