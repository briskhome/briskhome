/** @flow */
import type { BriskhomeState } from '../../app/types';

export const storeState = (state: BriskhomeState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('briskhome:state', serializedState);
  } catch (e) {
    return;
  }
};

export const fetchState = (): {} | BriskhomeState => {
  try {
    const serializedState = localStorage.getItem('briskhome:state');
    if (!serializedState) return {};
    return JSON.parse(serializedState);
  } catch (e) {
    return {};
  }
};
