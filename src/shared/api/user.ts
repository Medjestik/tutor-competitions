import type { ILoginData } from '../../pages/Login/interface/interface';
import type { IAuthResponse } from '../../store/user/types';

import { request } from './utils';

const setTokens = (accessToken: string) => {
	localStorage.setItem('token', accessToken);
};

export const login = (data: ILoginData) => {
	return request('/accounts/login/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: data.username,
			password: data.password,
		}),
	}).then((res: IAuthResponse) => {
		if (res.key) {
			setTokens(res.key);
		}
		return res;
	});
};
