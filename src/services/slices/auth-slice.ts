import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../root-reducer';
import type { TUser } from '../../utils/types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;

  isAuthChecked: boolean;
};

const initialState: TAuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

export const checkUserAuth = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('auth/checkUserAuth', async (_, { rejectWithValue }) => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) return rejectWithValue('unauthorized');

    const data = await getUserApi();
    if (!data?.success)
      return rejectWithValue('Не удалось получить пользователя');

    return data.user;
  } catch {
    return rejectWithValue('Не удалось получить пользователя');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('auth/loginUser', async (form, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(form);
    if (!data?.success) return rejectWithValue('Не удалось войти');

    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);

    return data.user;
  } catch {
    return rejectWithValue('Не удалось войти');
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('auth/registerUser', async (form, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(form);
    if (!data?.success) return rejectWithValue('Не удалось зарегистрироваться');

    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);

    return data.user;
  } catch {
    return rejectWithValue('Не удалось зарегистрироваться');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutApi();
      if (!data?.success) return rejectWithValue('Не удалось выйти');

      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');

      return;
    } catch {
      return rejectWithValue('Не удалось выйти');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (form, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(form);
    if (!data?.success)
      return rejectWithValue('Не удалось обновить пользователя');
    return data.user;
  } catch {
    return rejectWithValue('Не удалось обновить пользователя');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      });
  }
});

export const authReducer = authSlice.reducer;
export const { clearAuthError } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthChecked = (state: RootState) => state.auth.isAuthChecked;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
