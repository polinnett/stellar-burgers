import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';

import {
  addConstructorIngredient,
  setConstructorBun
} from '../../services/slices/burger-constructor';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setConstructorBun(ingredient));
        return;
      }

      const item: TConstructorIngredient = {
        ...ingredient,
        id: crypto.randomUUID()
      };

      dispatch(addConstructorIngredient(item));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
