import { useEffect, FC } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError
} from '../../services/slices/profile-orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-10'>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
