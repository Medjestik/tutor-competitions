import type { ILoginData } from '../../pages/Login/interface/interface';
import type { IAuthResponse, IUser, IMessageResponse, ISettings } from './types';

import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login, getMe, getSettings } from '../../shared/api/user';
import {
  startViewAsUser as startViewAsUserRequest,
} from '../../shared/api/viewAs';
import {
  beginViewAsSession,
  clearAllAuthTokens,
  endViewAsSession,
  getAccessToken,
  restoreStaffTokenAfterViewAs401,
} from '../../shared/utils/viewAsSession';

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
		const token = getAccessToken();
		if (token) {
			try {
				const user = await getMe(token);
				dispatch(setUser(user || null));
			} catch (error) {
				const restored = restoreStaffTokenAfterViewAs401();
				if (restored) {
					try {
						const user = await getMe(restored);
						dispatch(setUser(user || null));
					} catch (restoreError) {
						console.error('GET USER ERROR AFTER VIEW-AS RESTORE:', restoreError);
						clearAllAuthTokens();
						dispatch(setUser(null));
					}
				} else {
					console.error('GET USER ERROR:', error);
					dispatch(setUser(null));
				}
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
	async (_, { dispatch }) => {
		clearAllAuthTokens();
		dispatch(setUser(null));
		return { message: 'Logged out' };
	}
);

export const startViewAsUser = createAsyncThunk<IUser, number>(
	'user/startViewAs',
	async (userId, { dispatch }) => {
		const token = getAccessToken();
		if (!token) {
			throw new Error('Требуется авторизация');
		}
		const { access } = await startViewAsUserRequest(token, userId);
		beginViewAsSession(access);
		const user = await getMe(access);
		dispatch(setUser(user));
		return user;
	}
);

export const returnFromViewAs = createAsyncThunk<IUser | null>(
	'user/returnFromViewAs',
	async (_, { dispatch }) => {
		const staffToken = endViewAsSession();
		if (!staffToken) {
			dispatch(setUser(null));
			return null;
		}
		const user = await getMe(staffToken);
		dispatch(setUser(user || null));
		return user || null;
	}
);

export const getSettingsAction = createAsyncThunk<ISettings>(
  'user/getSettings',
  async () => {
    return await getSettings();
  }
);
