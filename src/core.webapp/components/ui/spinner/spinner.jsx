import React from 'react';
require('./spinner.styl');
export const Spinner = (): React.Element<*> => {
  return (
    <div className="spinner">
      <div className="spinner__bounce-1"></div>
      <div className="spinner__bounce-2"></div>
      <div className="spinner__bounce-3"></div>
    </div>
  );
}
