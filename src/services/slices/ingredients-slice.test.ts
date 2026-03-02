import { ingredientsReducer, fetchIngredients } from './ingredients-slice';
import type { TIngredient } from '../../utils/types';

describe('ingredients reducer', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 1,
      price: 10,
      image: 'x',
      image_mobile: 'x',
      image_large: 'x'
    }
  ];

  it('Request: isLoading - true и error - null', () => {
    const state = ingredientsReducer(undefined, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Success: items записываются, isLoading - false', () => {
    const startState = {
      items: [],
      isLoading: true,
      error: null
    };
    const state = ingredientsReducer(startState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('Failed: error записывается, isLoading - false', () => {
    const startState = {
      items: [],
      isLoading: true,
      error: null
    };
    const state = ingredientsReducer(startState, {
      type: fetchIngredients.rejected.type,
      payload: 'Не удалось загрузить ингредиенты'
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
