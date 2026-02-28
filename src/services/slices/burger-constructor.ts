import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  nanoid
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import type { RootState } from '../root-reducer';
import type {
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '../../utils/types';

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TBurgerConstructorState = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

type TMoveIngredientPayload = {
  from: number;
  to: number;
};

const initialState: TBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'burgerConstructor/createOrder',
  async (ingredientsIds) => {
    const data = await orderBurgerApi(ingredientsIds);
    const o = data.order;

    const order: TOrder = {
      _id: o._id,
      status: o.status,
      name: o.name,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      number: o.number,
      ingredients: ingredientsIds
    };

    return order;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setConstructorBun(state, action: PayloadAction<TIngredient | null>) {
      state.constructorItems.bun = action.payload;
    },
    addConstructorIngredient(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      const item = {
        ...action.payload,
        id: action.payload.id ?? nanoid()
      };

      const items = state.constructorItems.ingredients;
      const middleIndex = Math.floor(items.length / 2);

      items.splice(middleIndex, 0, item);
    },
    removeConstructorIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveConstructorIngredient(
      state,
      action: PayloadAction<TMoveIngredientPayload>
    ) {
      const { from, to } = action.payload;

      const items = state.constructorItems.ingredients;

      if (from < 0 || to < 0 || from >= items.length || to >= items.length)
        return;

      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
    },
    clearConstructor(state) {
      state.constructorItems = { bun: null, ingredients: [] };
    },

    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const {
  setConstructorBun,
  addConstructorIngredient,
  removeConstructorIngredient,
  moveConstructorIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} = burgerConstructorSlice.actions;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;
