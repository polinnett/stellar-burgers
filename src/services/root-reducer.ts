import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { feedReducer } from './slices/feed-slice';
import { profileOrdersReducer } from './slices/profile-orders-slice';
import { burgerConstructorReducer } from './slices/burger-constructor';
import { orderInfoReducer } from './slices/order-info';
import { authReducer } from './slices/auth-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  burgerConstructor: burgerConstructorReducer,
  orderInfo: orderInfoReducer,
  auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;
