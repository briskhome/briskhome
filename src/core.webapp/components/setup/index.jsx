/**
 * @flow
 * @briskhome/core.webapp
 */

require('./setup.styl');

import React from 'react';
import { connect } from 'react-redux';

import {Help} from '../ui/buttons/help';
import {Spinner} from '../ui/spinner/spinner';

export const Setup = (): React.Element<*> => {
  return (
    <div className='setup'>
      <div className='setup__left'>
        <div className='setup__image'>
          <svg xmlns="http://www.w3.org/2000/svg" width="118" height="113">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" d="M9 63l50-50 50 50v50H9V63zm38 0v50h25V63H47z" />
              <path fill="#2766A8" d="M54.4 53L58 43l-7-1.8L63.6 28 59 38l7 2" />
              <path fill="#CF4B5D" stroke="#CF4B5D" strokeWidth="2" d="M60 3l-1-1-2 2L4 57.2l-2 2L5.8 63l1.8-2L59 9.7 110.4 61l1.8 2 3.8-3.8-2-2L61 4l-1-1z" strokeLinecap="square" />
            </g>
          </svg>
        </div>
        <h1>Welcome</h1>
        <p><strong>Briskhome</strong> is a work-in-progress extensible open-source house monitoring and automation system.</p>
      </div>

      <div className='setup__right'>
        <Help />
        <form>
          <fieldset>
            <legend>Create an account</legend>
            <div>
              <select>
                <option value="guest" disabled>Guest</option>
                <option value="user" disabled>User</option>
                <option value="superuser" selected>Superuser</option>
              </select>
          </div>
            {/* <label htmlFor="number">
              <span>Card number:</span>
            </label> */}
            <input type="text" id="number" name="cardnumber" placeholder='First name' />
            <input type="text" id="number" name="cardnumber" placeholder='Last name' />
            <button className='setup__button' type='submit'>Create account</button>
            {/* <button className='setup__button' type='submit'><Spinner /></button> */}
          </fieldset>
        </form>
      </div>
    </div>
  );
}

// export default Setup;
