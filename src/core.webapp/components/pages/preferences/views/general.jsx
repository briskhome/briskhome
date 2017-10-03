import React from 'react';
import Input from '../../../ui/input';
import Title from '../../../ui/title';

export default () => (
  <div className="preferences">
    <Title medium extraClassName="preferences-pane__title">
      General
    </Title>
    {/* <Title small extraClassName="preferences-pane__subtitle">
        Database
      </Title> */}
    <Input
      label="Hostname"
      value="localhost"
      extraClassName="preferences-pane__content-input"
    />
    <Input
      label="Database"
      value="localhost"
      extraClassName="preferences-pane__content-input"
    />
    <Input
      label="Username"
      value="localhost"
      extraClassName="preferences-pane__content-input"
    />
    <Input
      label="Password"
      value="localhost"
      type="password"
      extraClassName="preferences-pane__content-input"
    />
  </div>
);
