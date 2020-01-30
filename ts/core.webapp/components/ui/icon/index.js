/** @flow */
import * as React from 'react';
import cn from 'classnames';
import "./index.styl";
type IconProps = {
  className?: string;
  name: string;
};

const Icon = ({
  className,
  name
}: IconProps): React.Node => {
  return <span className={cn('briskhome-icon', `briskhome-icon__${name}`, className)} />;
};

export default Icon;