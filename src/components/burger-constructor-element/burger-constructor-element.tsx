import { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeConstructorIngredient,
  moveConstructorIngredient
} from '../../services/slices/burger-constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleMoveDown = () => {
      if (index >= totalItems - 1) return;
      dispatch(moveConstructorIngredient({ from: index, to: index + 1 }));
    };

    const handleMoveUp = () => {
      if (index <= 0) return;
      dispatch(moveConstructorIngredient({ from: index, to: index - 1 }));
    };

    const handleClose = () => {
      dispatch(removeConstructorIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
