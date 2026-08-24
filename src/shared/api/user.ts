import type { ILoginData } from '../../pages/Login/interface/interface';
import type { IAuthResponse } from '../../store/user/types';

import { request } from './utils';

const setTokens = (accessToken: string) => {
	localStorage.setItem('token', accessToken);
};

const jsonHeaders = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

export const login = (data: ILoginData) => {
	return request('/accounts/login/', {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify({
			username: data.username,
			password: data.password,
		}),
	}).then((res: IAuthResponse) => {
		if (res.access) {
			setTokens(res.access);
		}
		return res;
	});
};

export const requestPasswordReset = (email: string) => {
	return request('/accounts/password/reset/', {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify({ email }),
	});
};

export const confirmPasswordReset = (data: {
	uidb64: string;
	token: string;
	new_password: string;
}) => {
	return request('/accounts/password/reset/confirm/', {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify(data),
	});
};
