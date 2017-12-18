/** @flow */
import * as React from 'react';
import cn from 'classnames';
import './loader.styl';

export default ({ inline, white }: { inline: boolean, white: boolean }) => (
  <div className="briskhome-spinner">
    <div
      className={cn('briskhome-spinner__content', {
        'briskhome-spinner__content_inline': inline,
        'briskhome-spinner__content_white': white,
      })}
    >
      <div />
      <div />
      <div />
    </div>
  </div>
);
