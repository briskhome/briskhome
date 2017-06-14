// @flow
/* eslint jsx-quotes: ["error", "prefer-single"] */
import React from 'react';
import { merge } from '../../../utils'

require('./input.styl');
export const Input = ({
  label,
  disabled,
  classNames = [],
  placeholder,
  warning = false,
  error = false,
  success = false,
}: Object): React.Element<*> => {
  return (
    <fieldset className='briskhome-fieldset'>
      <div className={merge(['briskhome-form', ...classNames])}>
        {label && <label htmlFor='name' className='briskhome-form__label'>{label}:</label>}
        {/* <span className='icon email-icon'/> */}
        <input
          placeholder={placeholder}
          type='text'
          name='email'
          autoComplete='email'
          disabled={disabled}
          className={merge([
            'briskhome-form__input',
            success && 'briskhome-form_success',
            warning && 'briskhome-form_warning',
            error && 'briskhome-form_error'
          ])}
          // onChange={loginInputChangeHandler}
          // onClick={clickHandler}
          // value={value}
        />
        {success && <span className='briskhome-form__status briskhome-form__status_success' />}
        {warning && <span className='briskhome-form__status briskhome-form__status_warning' />}
        {error && <span className='briskhome-form__status briskhome-form__status_error' />}
      </div>
      {/* {error && <p className='spaced-s p-auth__errors red'>{error}</p>}*/}
    </fieldset>
  );
};
