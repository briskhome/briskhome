/** @flow */
import * as React from 'react';
import { Switch } from 'react-router-dom';
import Header from "../navigation/index";
type WrapperProps = {
  children: React.Node;
};
export const Wrapper = ({
  children
}: WrapperProps): React.Fragment => <React.Fragment>
    <Header />
    <section>
      <Switch>{children}</Switch>
    </section>
  </React.Fragment>;
export default Wrapper;
export const withWrapper = (children: React.Node): React.Fragment => <Wrapper children={children} />;