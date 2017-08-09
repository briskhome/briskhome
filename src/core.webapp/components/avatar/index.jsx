/* @flow */
import React from 'react';
import './avatar.styl';

type AvatarPropsType = {
  name?: string,
  image?: string,
};

export const BriskhomeAvatar = ({ name, image }: AvatarPropsType): React.Element<*> => {
  return (
    <div className='briskhome-avatar'>
      {name && <span className='briskhome-avatar__name'>{name}</span>}
      {image && <img className='briskhome-avatar__image' src={image} alt='' />}
    </div>
  );
};

export default BriskhomeAvatar;
