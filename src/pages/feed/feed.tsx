import { useEffect, FC } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../services/slices/feed-slice';

import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredients-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    dispatch(fetchFeed());
  }, [dispatch, ingredients.length]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-10'>{error}</div>;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
