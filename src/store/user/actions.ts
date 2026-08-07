import type { ILoginData } from '../../pages/Login/interface/interface';

import type { IAuthResponse, IUser, IMessageResponse, ISettings } from './types';

import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login, getMe, getSettings } from '../../shared/api/user';

import { setIsAuthChecked } from './reducer';


export const loginUser = createAsyncThunk<IAuthResponse, ILoginData>(
	'user/login',
	async (data, { dispatch }) => {
		const res = await login(data);

		if (res.access) {
			const user = await getMe(res.access);
			dispatch(setUser(user));
		}

		return res;
	}
);

export const setUser = createAction<IUser | null>('user/setUser');

export const checkUserAuth = createAsyncThunk(
	'user/checkUser',
	async (_, { dispatch }) => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const user = await getMe(token);
				dispatch(setUser(user || null));
			} catch (error) {
				console.error('GET USER ERROR:', error);
				dispatch(setUser(null));
			} finally {
				dispatch(setIsAuthChecked(true));
			}
		} else {
			dispatch(setIsAuthChecked(true));
		}
	}
);

export const logoutUser = createAsyncThunk<IMessageResponse>(
	'user/logout',
	async () => {
		localStorage.removeItem('token');
		return { message: 'Logged out' };
	}
);

export const getSettingsAction = createAsyncThunk<ISettings>(
  'user/getSettings',
  async () => {
    return await getSettings();
  }
);

