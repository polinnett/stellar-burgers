import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  createOrder,
  setOrderModalData
} from '../../services/slices/burger-constructor';

import { selectUser } from '../../services/slices/auth-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const user = useSelector(selectUser);
  const isAuth = Boolean(user);

  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ids));
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems.bun, constructorItems.ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
