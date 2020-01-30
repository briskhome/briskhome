import * as React from 'react';
type NavigationItemProps = {
  name: string;
  link: string;
  img: string;
};
export const NavigationItem = ({
  name,
  link,
  img
}: NavigationItemProps) => <a href={link}>
    <div>
      <img src={img} alt={name} />
      <span className="">{name}</span>
    </div>
  </a>;
export default NavigationItem;