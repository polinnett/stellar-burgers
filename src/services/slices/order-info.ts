import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import type { RootState } from '../root-reducer';

type TOrderInfoState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderInfo/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(orderNumber);
    const order = data.orders?.[0];
    if (!order) return rejectWithValue('Заказ не найден');
    return order;
  } catch {
    return rejectWithValue('Не удалось загрузить данные заказа');
  }
});

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo(state) {
      state.orderData = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      });
  }
});

export const { clearOrderInfo } = orderInfoSlice.actions;
export const orderInfoReducer = orderInfoSlice.reducer;

export const selectOrderData = (state: RootState) => state.orderInfo.orderData;
export const selectOrderInfoLoading = (state: RootState) =>
  state.orderInfo.isLoading;
export const selectOrderInfoError = (state: RootState) => state.orderInfo.error;
