import { rootReducer } from './root-reducer';

import { ingredientsReducer } from './slices/ingredients-slice';
import { feedReducer } from './slices/feed-slice';
import { profileOrdersReducer } from './slices/profile-orders-slice';
import { burgerConstructorReducer } from './slices/burger-constructor';
import { orderInfoReducer } from './slices/order-info';
import { authReducer } from './slices/auth-slice';

describe('rootReducer', () => {
  it('Должен корректно инициализировать начальное состояние', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      feed: feedReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      profileOrders: profileOrdersReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      burgerConstructor: burgerConstructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      orderInfo: orderInfoReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      auth: authReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
