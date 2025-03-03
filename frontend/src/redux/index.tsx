import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';  // Nhập từ file reducers
import { localStorageMiddleware } from './middlewares/LocalStorageMiddleware';

// Tạo store với rootReducer
export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
