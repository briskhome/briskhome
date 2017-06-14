

import request from 'superagent';

export const fetchUsersAndGuests = (): Function => async (dispatch, getState) => {
  request
    .get('/mocks/users.json')
    .end((err, res) => {
      console.log(err, res);
    });
};