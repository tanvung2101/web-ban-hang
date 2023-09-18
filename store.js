import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cartItemSlice from './redux/cartItemSlice';
import logger from 'redux-logger'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import accountSlice from './redux/accountSlice';
import productModalSlice from './redux/productModalSlice';
import commonSlice from './redux/commonSlice';


const reducer = combineReducers({
  cartItem: cartItemSlice,
  account: accountSlice,
  productMadal: productModalSlice,
  common: commonSlice,
})


const loggerMiddleware = (store) => (next) => (action) => {
  next(action)
}

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (gDM) => gDM({ serializableCheck: false, }).concat(logger, loggerMiddleware),
  // middleware: [thunk],
})