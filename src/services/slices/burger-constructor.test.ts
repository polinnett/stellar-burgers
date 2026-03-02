import {
  burgerConstructorReducer,
  addConstructorIngredient,
  removeConstructorIngredient,
  moveConstructorIngredient
} from './burger-constructor';

import type { TIngredient } from '../../utils/types';

describe('burgerConstructor reducer', () => {
  const ingredient1: TIngredient = {
    _id: 'i1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 10,
    image: 'x',
    image_mobile: 'x',
    image_large: 'x'
  };

  const ingredient2: TIngredient = {
    _id: 'i2',
    name: 'Соус 2',
    type: 'sauce',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 2,
    price: 20,
    image: 'x',
    image_mobile: 'x',
    image_large: 'x'
  };

  it('Должен обработать добавление ингредиента', () => {
    const state = burgerConstructorReducer(
      undefined,
      addConstructorIngredient(ingredient1)
    );
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0].name).toBe('Соус 1');
    expect(state.constructorItems.ingredients[0]).toHaveProperty('id');
  });

  it('Должен обработать удаление ингредиента', () => {
    const stateWithOne = burgerConstructorReducer(
      undefined,
      addConstructorIngredient(ingredient1)
    );
    const added = stateWithOne.constructorItems.ingredients[0];
    const stateAfterRemove = burgerConstructorReducer(
      stateWithOne,
      removeConstructorIngredient(added.id)
    );
    expect(stateAfterRemove.constructorItems.ingredients).toHaveLength(0);
  });

  it('Должен обработать изменение порядка ингредиентов в начинке', () => {
    const s1 = burgerConstructorReducer(
      undefined,
      addConstructorIngredient(ingredient1)
    );
    const s2 = burgerConstructorReducer(
      s1,
      addConstructorIngredient(ingredient2)
    );
    const before = s2.constructorItems.ingredients.map((x) => x.name);
    const moved = burgerConstructorReducer(
      s2,
      moveConstructorIngredient({ from: 0, to: 1 })
    );
    const after = moved.constructorItems.ingredients.map((x) => x.name);
    expect(before).toHaveLength(2);
    expect(after).toHaveLength(2);
    expect(after[0]).toBe(before[1]);
    expect(after[1]).toBe(before[0]);
  });
});
