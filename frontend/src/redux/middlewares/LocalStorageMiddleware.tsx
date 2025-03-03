// Middleware cập nhật LocalStorage
import { Middleware } from '@reduxjs/toolkit';
import { UserSlice } from '../slices/UserSlice';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (UserSlice.actions.login.match(action) || UserSlice.actions.logout.match(action)) {
    const state = store.getState() as RootState;
    localStorage.setItem('userState', JSON.stringify(state.userAction.user));
  }

  return result;
};
