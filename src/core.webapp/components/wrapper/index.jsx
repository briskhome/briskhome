import * as React from 'react';
import Header from '../navigation';

type WrapperProps = {
  children: React.ReactChildren,
};

export const Wrapper = ({ children }: WrapperProps): React.Fragment => (
  <React.Fragment>
    <Header />
    <section>{children}</section>
  </React.Fragment>
);

export default Wrapper;
