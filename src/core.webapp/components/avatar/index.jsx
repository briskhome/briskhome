/* @flow */
import * as React from 'react';
import './avatar.styl';

type AvatarPropsType = {
  name?: string,
  image?: string,
  online?: boolean,
};

export const BriskhomeAvatar = ({
  name,
  image,
  online,
}: AvatarPropsType): React.Node => (
  <div className="briskhome-avatar">
    {name && <span className="briskhome-avatar__name">{name}</span>}
    {image && <img className="briskhome-avatar__image" src={image} alt="" />}
    {online && <div className="briskhome-avatar__online" />}
  </div>
);

export default BriskhomeAvatar;
