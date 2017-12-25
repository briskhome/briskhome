/** @flow */
import * as React from 'react';
import Header from '../navigation/index';

type WrapperProps = {
  children: React.ChildrenArray<string>,
};

export const Wrapper = ({ children }: WrapperProps): React.Fragment => (
  <React.Fragment>
    <Header />
    <section>{children}</section>
  </React.Fragment>
);

export default Wrapper;
