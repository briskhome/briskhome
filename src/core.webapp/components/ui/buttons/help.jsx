import React from 'react';

require('./help.styl');

export const Help = ({ url = 'http://docs.briskhome.com' }: Object) => (
  <a className='briskhome-help' href={url}>
    <div>?</div>
  </a>
);
