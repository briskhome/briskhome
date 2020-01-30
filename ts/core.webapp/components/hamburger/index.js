import * as React from 'react';
import "./hamburger.styl";
export const Hamburger = (): React.Element => <button className="hamburger hamburger--3dx" type="button">
    <span className="hamburger-box">
      <span className="hamburger-inner" />
    </span>
  </button>;
export default Hamburger;