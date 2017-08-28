/* @flow */
import React from 'react';
import Loader from '../ui/loader';
import './card.styl';

type CardType = {
  icon?: string,
  title: string,
  caption: string,
  button?: string,
  onClick?: Function,
  children: React.Element<*>,
  loading?: boolean,
  error?: boolean,
};

export const Card = ({
  icon,
  title,
  caption,
  button,
  onClick = () => null,
  children,
  loading,
  error,
}: CardType): React.Element<*> => {
  const renderContent = (): React.Element<*> => {
    if (loading) return <Loader />;
    if (error) return <div />;
    return children;
  };

  return (
    <div className="card">
      <div className="card__content">
        {renderContent()}
      </div>
      <div className="card__footer">
        {icon &&
          <div className="card__icon">
            <img src="" />
          </div>}
        <div className="card__title card__title_uppercase">
          {title}
        </div>
        <div className="card__title card__title_small card__title_gray">
          {caption}
        </div>
        {button &&
          <div className="card__action">
            <a
              className="card__action-link"
              role="button"
              type="button"
              onClick={() => onClick()}
            >
              {button}
            </a>
          </div>}
      </div>
    </div>
  );
};
export default Card;
