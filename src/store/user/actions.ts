import type { ILoginData } from '../../pages/Login/interface/interface';

import type { IAuthResponse } from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../shared/api/user';


export const loginUser = createAsyncThunk<IAuthResponse, ILoginData>(
	'user/login',
	async (data) => {
		const res = await login(data);
    console.log(res);

		return res;
	}
);

